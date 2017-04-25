# AutoTypes tool

A reaaaaally simple tool to perform an otherwise manual task: checking if there are typings in the @types npm organization and adding them to your project.

## How to use it

1. Install globally

        $ yarn global add autotypes
      
      or
      
        $ npm i -g autotypes

2. Go to your project root and run

        $ autotypes

> **NOTE:** it will install ALL types found. No questions asked!


You can also pass the path to a project or a `package.json`. But keep in mind that `yarn` will **ALWAYS** be run from the folder where the package.json is.
