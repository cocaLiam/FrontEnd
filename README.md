#### 
# 구성
#### 
  - react
  - vite 모듈 번들러
  - tailWind CSS LIB 사용

___

#### 
# vite 프로젝트 생성
#### 

### install
```bash
$ npm create vite@latest viteProject --template react
$ cd viteProject
$ npm install
```

___

#### 
# Tailwind CSS 설치 및 설정
#### 

### install
```bash
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init
```
### Setup
***tailwind.config.js 설정*** 
```js 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}" // JSX 파일 추가
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
***src/index.css 설정***
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 ... 여기부터 기존 코드 ....
```
***output.css 빌드***
 - index.css를 읽어서 Tailwind CSS를 포함한 output.css로 빌드
```bash
$ npx tailwindcss -i ./src/index.css -o ./src/output.css
```
***index.html 설정***
 - Main HTML 문서(index.html)에 Tailwind CSS를 포함한 output.css 스타일 적용
```html
<link href="./src/output.css" rel="stylesheet">
```
```html
전체 코드 예시
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./src/output.css" rel="stylesheet">
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
***tailWind 및 vite 실시간 변경 되는지 확인할만 한 코드***
 - src/App.jsx
```jsx
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <form>
      <h1>Hi Vite 모듈번들러, and tailWind CSS</h1>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div className="flex flex-col">
          <p1 className="text-left ">taiWind CSS 확인용</p1>
          <p1 className="text-left text-red-500">taiWind CSS 확인용</p1>
        </div>
      </div>
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <div className="card">
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    </form>
  );
}

export default App;
```

___

#### 
# 사용 방법
#### 

### FrontEnd code 배포판 빌드
***npm run build 시, .env.production 환경변수를 참조해 빌드***
***npm run build 시, dist package 파일들을 AWS S3 업로드 하면 된다***
```bash
$ npm run build
```
### [tailWind CSS 실시간 적용 ]
***변경사항 감지시 ./src/output.css를 빌드해 실시간으로 Web에 적용***
```bash
npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
```
### [vite + React 프로젝트] Local Test ( with hosted backend )
***localhost:3000 으로 서버구성해서 dist 디렉토리에 있는 코드 로컬실행***
```bash
$ npm run build
$ npm run preview -- --port 3000 --host
```
### [vite + React 프로젝트] Local Test ( with local backend )
***npm run dev 시, .env.development 환경변수를 참조해 빌드***
```bash
$ npm run dev -- --port 3000 --host
```


