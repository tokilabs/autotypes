#! /usr/bin/env node

import * as chalk from 'chalk';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as req from 'request-promise-native';

import * as D from 'debug';
const debug = D('autotypes');

async function loadTypes(): Promise<{}[]> {
  console.log(chalk.gray('Loading types from Microsoft TypeSearch'));
  const url = 'https://typespublisher.blob.core.windows.net/typespublisher/data/search-index-min.json';

  return req.get(url, { gzip: true })
    .then( (res: string) => {
      const types: {}[] = JSON.parse(res);

      debug(`Got types list with ${types.length} types!`);
      return types;
    })
    .catch( (err: { message?: string}) => {
      console.error('Failed to get types list', err.message || err);
      process.exit(-2);
      return [];
    });
}

function findPackage(pathArg?: string): string {
  let pkgPath: string;

  if (!pathArg) {
    pkgPath = path.join(process.cwd(), 'package.json');
  }
  else {
    pkgPath = path.isAbsolute(pathArg) ? pathArg : path.join(process.cwd(), pathArg);

    if (!pkgPath.toLowerCase().endsWith('package.json'))
      pkgPath = path.join(pkgPath, 'package.json');
  }

  if (!fs.existsSync(pkgPath)) {
    console.error(`Could not find package.json in ${pkgPath}`);
    process.exit(-1);
  }

  return pkgPath;
}

// tslint:disable-next-line:no-floating-promises
loadTypes().then(types => {
  const pkgPath = findPackage(process.argv[2]);

  console.log(chalk.gray('Reading (dev)dependencies from'), chalk.blue(pkgPath));
  const pkg = require(pkgPath);

  const deps = _.keys(_.merge(pkg.dependencies, pkg.devDependencies));
  const typesFound = [];

  debug('Package (dev)dependencies:', deps.filter(d => !d.startsWith('@types/')));

  deps.forEach( (key) => {
    // tslint:disable-next-line:no-any
    if (types.some( (t: any) => t.t === key)) {
      if (!deps.some(k => k === `@types/${key}`))
        typesFound.push(`@types/${key}`);
    }
  });

  if (!typesFound.length) {
    console.log(chalk.yellow('No types to install'));
    process.exit(0);
  }

  console.log(
    `${chalk.green('Running yarn')} ${['add', '--dev'].concat(typesFound).join(' ')}
        in: ${chalk.blue(path.dirname(pkgPath))}`);

  spawn('yarn', ['add', '--dev'].concat(typesFound), { stdio: 'inherit', cwd: path.dirname(pkgPath) });
})
.catch( (err: {}) => {
  console.error(err);
  process.exit(-3);
});
