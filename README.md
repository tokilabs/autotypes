# AutoTypes tool

A reaaaaally simple tool to perform an otherwise manual task: checking if there are typings in the @types npm organization and adding them to your project.

## How to use it

1. Install globally

        yarn global add autotypes

      or

        npm i -g autotypes

2. Go to your project root and run

        $ autotypes

> **NOTE:** it will install ALL types found. No questions asked!

You can also pass the path to a project or a `package.json`. But keep in mind that `yarn` will **ALWAYS** be run from the folder where the package.json is.

## Pro Tip

In a typescript project, everytime you install a new package, you need to check if types exist in that package. You can combine `autotypes` with that command to automatically install types if they exist, e.g.:

    yarn add --dev mocha && autotypes
    
or

    npm i --save-dev mocha && autotypes
    
