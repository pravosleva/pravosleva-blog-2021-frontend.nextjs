# Next.js with TypeScript

## News 2026.08

### Upgrage
```bash
yarn upgrade caniuse-lite
```

Yarn Classic перечитает дерево зависимостей, найдет пакет `caniuse-lite` (который тянут за собой Next.js и Autoprefixer) и накатит на него самую свежую минорную версию из реестра npm. Предупреждение `Browserslist: caniuse-lite is outdated `гарантированно исчезнет при следующем билде.

### 📝 Архитектурная сводка: Оптимизация Markdown-рендереров и Code Splitting

В рамках этой задачи была проведена глубокая диагностика и оптимизация клиентского и серверного бандлов Next.js приложения. Мы успешно изолировали тяжелые интерактивные фичи в ленивые асинхронные чанки, разгрузив основной монолит рендереров.

---

#### 🔍 Исходная проблема (Конкатенированный монолит)

При анализе бандла через `webpack-bundle-analyzer` было обнаружено, что папка кастомных компонентов-маркеров (`./src/react-markdown-renderers`) собиралась Webpack в **один неделимый монолитный чанк** (`static/chunks/5174-*.js` весом **63.04 KB** на клиенте и **141.48 KB** на сервере):
```text
./src/react-markdown-renderers/index.tsx + 59 modules (concatenated) (57.67 KB)
```
**Следствие:** При открытии любой (даже самой простой текстовой) статьи блога, браузер пользователя и PWA-контейнер были вынуждены синхронно скачивать и парсить код *всех* 60 кастомных модулей сразу — включая тяжелый синтаксический хайлайтер кода, логику подкастов и экспериментальный интерактивный стенд `EdnaExp` с реактивным сервисом и зашитой внутрь строкой Web Worker.

---

#### 💥 Коварство Webpack: Почему `next/dynamic` сначала не работал?

Первая попытка обернуть компоненты в `next/dynamic` не принесла результатов из-за **сквозного реэкспорта (Barrel Files)** и **неявных циклических связей**:
1. **Проблема точек входа:** Файл `react-markdown-renderers/index.tsx` содержал жесткие синхронные `export * from './Alert'`.
2. **Проблема скрытых импортов:** Соседние компоненты (например, `BlockquoteRenderer`, обрабатывающий цитаты `> [!warning]`) импортировали `Alert` напрямую через стандартный `import`.

Когда Webpack видит, что компонент А импортируется динамически, но компонент Б (который сам загружается синхронно) требует компонент А «прямо сейчас», он игнорирует ленивую загрузку и принудительно стягивает код обратно в общий монолит.

---

#### 🛠️ Как мы это решили (Правильный паттерн разделения кода)

1. **Тотальная изоляция путей:** Указали для `next/dynamic` точечные пути до конкретных файлов (`~/react-markdown-renderers/Alert/Alert.v4`), минуя общие файлы реэкспорта (`index.tsx`).
2. **Устранение Barrel-утечек:** Полностью вырезали синхронные экспорты ленивых компонентов из главного файла `index.tsx`.
3. **Перенос динамики в родительский контекст:** Перевели скрытые импорты внутри родительских рендереров (например, внутри компонента цитат) на `next/dynamic`.
4. **Отключение SSR для клиентских фич:** Стенд `EdnaExp`, завязанный на глобальный объект `window` и динамические `Blob URL` воркеров, импортирован с параметром `{ ssr: false }`. Это полностью освободило серверный HTML-рендеринг от лишней логики.

---

#### 📊 Итоговые результаты оптимизации [Parsed Size]

Благодаря разорванным связям и точечному Code Splitting, Webpack смог безошибочно изолировать кодовую базу:

| Чанк / Компонент | Было (Монолит) | Стало (Разделенный бандл) | Статус / Результат |
| :--- | :--- | :--- | :--- |
| **Базовый чанк рендереров (`7082`)** | **63.35 KB** (59 модулей) | **44.86 KB** (54 модуля) | **Похудел на ~30%** 📉 |
| **Чанк Алерта (`7902`)** | Склеен внутри | **4.85 KB** | Выделен в асинхронный чанк 📦 |
| **Чанк Стенда EdnaExp (`7018`)** | Склеен внутри | **14.22 KB** | Выделен в асинхронный чанк 📦 |
| **Серверный бандл рендереров** | **141.48 KB** | **112.21 KB** | **Разгружен Node.js SSR** 📉 |

**🎯 Главный профит для UX:** Теперь 14.22 КБ кода интерактивного стенда `EdnaExp` (вместе с его Web Worker движком) и 4.85 КБ кода алертов скачиваются на устройство пользователя **строго по требованию** — только тогда, когда эти компоненты физически встречаются в тексте читаемой статьи. Метрики производительности **LCP** и **TBT** на страницах блога и внутри PWA существенно улучшены.

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
