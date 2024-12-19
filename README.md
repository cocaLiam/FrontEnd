## 구성
![구성](구성도.png)

#### 
# FrontEnd 구성 overview
#### 
- vite 모듈번들러 - react - tailWind CSS
- 컴포넌트 기반 아키텍처
- mongoose (mongoDB), (cloud Server DB : Atlas)
  - [MongoDB Atlas](https://cloud.mongodb.com/v2#/org/66fcba7d069a4d43c73cf7af/projects)
- 구글 MAP_API 사용
  - [Google Cloud Console](https://console.cloud.google.com/apis/credentials?hl=ko&project=effective-brook-437306-h0)
- FrontEnd 서버
  - ***AWS s3***
    - [awsS3] https://eu-north-1.console.aws.amazon.com/console/home?region=eu-north-1#
- BackEnd 서버
  - ***heroku***
    - [heroku] https://dashboard.heroku.com/

___

#### 
# FrontEnd 구성 설명
#### 

### ( react - vite - tailWind CSS << 컴포넌트 기반 아키텍처 )
```tree
src/
├── components/             # UI 컴포넌트들을 모아둔 디렉토리
│   ├── atoms/              # 더 이상 쪼갤 수 없는 가장 작은 단위의 컴포넌트 (버튼, 입력창, 아이콘 등)
│   ├── molecules/          # atoms를 조합하여 만든 좀 더 복잡한 컴포넌트 (검색바, 유저카드 등) 
│   ├── organisms/          # molecules를 조합한 더 큰 단위의 독립적인 컴포넌트 (헤더, 푸터, 사이드바 등)
│   ├── templates/          # 페이지의 레이아웃을 담당하는 컴포넌트 (대시보드 레이아웃, 관리자 레이아웃 등)
│   └── pages/              # 실제 라우팅되는 페이지 컴포넌트 (홈페이지, 프로필페이지 등)
├── context/                # React Context API를 사용한 전역 상태 관리 디렉토리
│   └── UserContext.js      # 사용자 정보 관련 전역 상태 관리
├── hooks/                  # 재사용 가능한 커스텀 훅들을 모아둔 디렉토리
│   ├── useFetch.js         # API 요청을 위한 커스텀 훅
│   └── useNativeBridge.js  # 네이티브 앱과의 통신을 위한 커스텀 훅
├── utils/                  # 여러 곳에서 재사용되는 유틸리티 함수들을 모아둔 디렉토리
│   ├── api.js              # API 호출 관련 유틸리티 함수
│   └── format.js           # 데이터 포맷팅 관련 유틸리티 함수
├── styles/                 # 스타일 관련 파일들을 모아둔 디렉토리
│   └── index.css           # Tailwind CSS 설정 및 전역 스타일
├── App.jsx                 # 앱의 최상위 컴포넌트
├── index.css               # 기본 스타일시트
├── main.jsx                # React 앱의 진입점 (ReactDOM.render)
└── output.css              # Tailwind CSS가 빌드된 최종 CSS 파일

```

### 환경변수 설명
  - `.env` <- 개발환경, 배포판 공통 환경변수
  - `.env.development` <- 개발환경 환경변수
  - `.env.production`  <- 배포판 환경변수
  - `github에 "Actions secrets and variables"` <- AWS S3 버킷 업로드 코드 ( with hosted backend )

___

#### 
# FrontEnd( JavaScript, React ) 설치 및 배포
#### 

### Library 설치
```bash
$ npm i
```

### AWS S3 업로드
  - `https://eu-north-1.console.aws.amazon.com/s3/home?region=eu-north-1#` 
  - 해당링크에서 APP 전용 도메인 버킷에 업로드
  - FrontEndProd에 `Release_v*.* [***]` 커밋명으로 푸시 ( Git Action -> IAM 자동 업로드 )
  - OR `$ npm run build` 으로 빌드해서 dist 에 있는 파일을 직접 업로드 해도됨

___

#### 
# FrontEnd 실행 방법 
##### 터미널2개 필요
#####  - Tailwind CSS의 JIT(Just-In-Time) 모드
#####  - vite의 HMR(Hot Module Replacement)
#### 

### [tailWind CSS 실시간 적용 ]
***변경사항 감지시 ./src/output.css를 빌드해 실시간으로 Web에 적용***
```bash
npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
```
### FrontEnd code 배포판 빌드
***npm run build 시, .env.production 환경변수를 참조해 빌드***
***npm run build 시, dist package 파일들을 AWS S3 업로드 하면 된다***
```bash
$ npm run build
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

___