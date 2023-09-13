# Next.js with TypeScript example

## Express server usage details

### `better-module-alias` [npm](https://www.npmjs.com/package/better-module-alias)

#### Step 1: Create `./server.src` dir

#### Step 2: Install tools
```bash
yarn add better-module-alias
```

#### Step 2: Add `./tsconfig.server.json``
```json
{
  "compilerOptions": {
    "allowJs": true,
    "target": "es5",
    "module": "commonjs",
    "lib": [
      "es2015",
      "es5"
    ],
    "removeComments": true,
    "preserveConstEnums": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": false,
    "isolatedModules": false,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*", "./*"],
    },
    "typeRoots": [
      "node_modules/@types"
    ],
    "outDir": "./server.dist"
  },
  "include": [
    "run.ts",
    "./srv.*/*"
  ],
  "exclude": [
    "node_modules",
    "**/__tests__/*"
  ]
}
```

#### Step 3: Start project scripts updates. See `package.json` diffs:
```js
{
  "scripts": {

    "dev": "yarn build && NODE_ENV=development node server.dist/run.js",
    "build": "yarn transpile-server && next build",
    "start": "NODE_ENV=production node server.dist/run.js",
    
    "transpile-server": "node_modules/.bin/tsc --downlevelIteration --project tsconfig.server.json"
  },
  "_moduleAliases": {
    "$tests": "./tests",
    "~": "./" // NOTE: It's for server runtime only
  },
}
```

#### Step 4: `./run.ts` diffs
```js
const packageJson = require("../package.json")
import betterModuleAlias from "better-module-alias";
betterModuleAlias(__dirname, packageJson._moduleAliases);
```

#### Step 5: Ready to use! In `./srv.socket-logic/socketLogic.ts` for example
```ts
import { getTstValue } from '~/srv.utils/getTstValue'

console.log('--')
console.log(getTstValue(1))
console.log('--')
```

## How to use

Download the example [or clone the repo](https://github.com/mui-org/material-ui):

<!-- #default-branch-switch -->

```sh
curl https://codeload.github.com/mui-org/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/nextjs-with-typescript
cd nextjs-with-typescript
```

Install it and run:

```sh
npm install
npm run dev
```

or:

<!-- #default-branch-switch -->

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/mui-org/material-ui/tree/master/examples/nextjs-with-typescript)

## The idea behind the example

The project uses [Next.js](https://github.com/zeit/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5. If you prefer, you can [use styled-components instead](https://mui.com/guides/interoperability/#styled-components).

## The link component

Next.js has [a custom Link component](https://nextjs.org/docs/api-reference/next/link).
The example folder provides adapters for usage with MUI.
More information [in the documentation](https://mui.com/guides/routing/#next-js).

## What's next?

<!-- #default-branch-switch -->

You now have a working example project.
You can head back to the documentation, continuing browsing it from the [templates](https://mui.com/getting-started/templates/) section.
