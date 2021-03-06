# Ridi Mini Library (Web Part)
[![Build Status](https://travis-ci.org/academey/ridi-new-entrant-web.svg?branch=master)](https://travis-ci.org/academey/ridi-new-entrant-web)
***
[Demo Link][Demo Link] | [상세 기획안][상세 기획안] | [Asana Project][Asana Project]


리디 뷰어팀 박현준의 신규 입사자 과제(미니 도서관 만들기) 저장소 입니다.
Server(Node), Client(React)를 typescript로 구현했습니다. 

## Prerequisites
***
- Docker
- Docker-compose
- Node (^10.16.0)
## Installation
***
### 1. 환경 변수 설정 
프로젝트 루트의 .env.example 파일을 자기 환경에 맞게 조정해 .env 파일로 변경합니다.

### 2. 프로젝트 의존성 및 DB 설치   
<pre><code>$ git clone https://github.com/academey/ridi-new-entrant-web
$ cd ridi-new-entrant-web
$ npm install
$ npm run compose-dev</code></pre>


### 3-1. [Development] 프로젝트 실행
<pre><code> $ npm run compose-dev</code></pre>

### 3-2. [Production] 프로젝트 실행
<pre><code> $ npm run compose-prod</code></pre>

## Examples
***
![메인 페이지][메인 페이지]
> 메인 페이지. 책 리스트를 조회하고 대여할 수 있다.

&nbsp;

![회원 가입 페이지][회원 가입 페이지]
> 회원 가입 페이지. JWT Token 방식으로 인증하며 토큰이 쿠키에 내려가고 해당 토큰을 이용해 유저 정보를 불러온다.

&nbsp;

![대여하기][대여하기]
> 로그인 한 상태에서 대여시간을 설정하고 대여하기 버튼을 누르면 책을 대여할 수 있다. 다른 유저가 빌린 책은 못 빌린다.

&nbsp;

![반납하기][반납하기]
> 로그인 한 유저가 대여한 책이 있다면 해당 책을 반납할 수 있다. 대여 종료 시각이 얼마나 남았는지 알려준다.

&nbsp;

![연체 반납하기][연체 반납하기]
> 대여한 책의 대여 종료 시각이 현재 시각보다 연체되었다면 빨리 반납하도록 유도하고, 다른 신규 책을 빌리지 못 한다.

&nbsp;

![대여불가][대여불가]
> 연체 반납했을 때, 연체된 시각의 두 배 만큼 대여 불가하게 만든다. 

&nbsp;

## 사용한 기술 스펙
***
### 1. Language / Platform / Framework
#### Typescript
[ridi/tslint-config][ridi/tslint-config]를 상속해서 개발했습니다. commit 시 lint-staged 를 통해 lint 와 prettier 가 실행되며 코드 컨벤션이 맞춰집니다. 
#### Node.js
10.16.0 버전을 사용했습니다.
#### Express
Express 에서 async/await 문법을 쓰고 싶어 [express-async-handler][express-async-handler]를 사용했습니다. 또한 그 외의 에러처리, DB Sync, cors, logger, body-parser 등 다양한 미들웨어를 사용했습니다. [property-validator][property-validator]를 이용해서 입력값에 대한 검증을 추가 했습니다. 또한 해당 케이스들에 대해 테스트 케이스를 만들었습니다.
#### Sequelize
typescript 와 연계해서 사용하려고 했으나 인터페이스와 타입형을 지원하지 않습니다. 따라서 데코레이터 기반으로 타입형을 지원하는 라이브러리인 [sequelize-typescript][sequelize-typescript]를 사용했습니다. sequelize-cli 을 이용해 migration, seed 파일도 생성했습니다. 또한 Model 에 직접 접근하지 않고 Service 레이어를 사용해 코드 사용의 용이성을 높였습니다.

### 2. Front Framework / Middleware / Library
#### React
이제 React의 대다수의 라이브러리가 Typescript를 지원한다고 해서 이를 이용해 개발해봤습니다.
#### Redux & Redux-saga
상태 관리를 Redux 와 Redux-saga 를 이용했습니다. 비동기로 작동하는 액션을 처리하는 것은 모두 redux-saga 를 통하도록 만들었습니다. 추후에는 Saga를 연결하거나 컨테이너를 호출하는 부분을 최적화시켜야 합니다.
#### redux-form & styled-components & reactstrap
[redux-form][redux-form]을 이용해 Redux state container 를 만들었습니다. [HOC][HOC]기법을 이용해 Redux container 로 폼의 필드값들을 등록해주고 액션을 관리합니다. 항상 반복되는 폼 형태를 쉽게 만들 수 있습니다.
[styled-components][styled-components]을 이용해 컴포넌트 단위별로 스타일을 관리할 수 있습니다.
[reactstrap][reactstrap] 그냥 그나마 이뻐서 썼습니다.

### 3. DB
#### MariaDB
Docker Image 로 DB를 관리했습니다. DB 데이터를 보존하고 싶으면 docker-compose.yml 의 volumes 마운팅 부분 설정을 넣어줘야 합니다. Author 와 Book 을 M:N 관계로 구현하고자 테이블은 만들어 놓았으나 필수 스펙에 작가 조회 및 생성이 없어 진행하지 않았습니다. BookReservation의 endAt 칼럼과 현재 시각과 비교해 ReservationPenalty를 생성합니다.

### 4. Test
#### Jest
[supertest][supertest]를 사용해서 통합 테스트를 진행했습니다. 단위 테스트를 할만한 기능이 없었고 모두 DB를 이용한 CRUD 였기 때문에 DB와 passport를 Jest mocking 하고 테스트했습니다.

### 5. 개발 환경
#### docker-compose
DB와 Web(client + server)을 띄웠습니다. Web을 volume mounting 하여 hot-reload 시킬 수 있습니다. webpack-dev-server와 nodemon을 이용해 개발했습니다. 

### 6. 배포 환경
![배포 구조][배포 구조]
#### Travis 
Git commit 이 오면 Travis 에서 빌드 & 테스트를 시작합니다. 성공하면 배포도 시작하게 됩니다. 스크립트로 수동으로 클라우드에 접근하는 방식이 아닌 [Travis Deployment](https://docs.travis-ci.com/user/deployment)을 이용해 배포했습니다. 
#### S3
소스코드를 압축해서 버켓에 업로드합니다. github의 코드를 바로 올리지 않고 S3를 사용하는 이유는 1) build 파일을 유지해서 추후 같은 버젼을 재배포할 경우 빌드 시간이 소요되지 않음 2) build 파일 버젼 관리 및 롤백 용이. 두 이점을 가지기 위해 s3를 끼워서 관리하는 게 더 좋을 것 같습니다. 
#### CodeDeploy
업로드한 소스코드를 EC2에 보냅니다. 존재하던 기존 소스코드를 overwrite 하고, 실패할 경우 자동으로 롤백시킵니다.
#### EC2
소스코드를 받으면 ./execute-deploy.sh 를 실행합니다. 기존 docker 프로세스를 멈추고, 다시 띄웁니다. 이 과정에서 downtime 이 발생합니다. 따라서 추후에는 Blue-Green 배포를 지원할 예정입니다.

### 7. Tools
#### Asana
해당 [프로젝트][Asana Project]에서 관리했습니다.

## Structure
***
```
ridi-new-entrant-web/src
├── client
│   ├── api
│   ├── components
│   ├── containers
│   │   └── Root
│   ├── pages
│   │   ├── auth
│   │   │   ├── LoginPage
│   │   │   └── RegisterPage
│   │   └── resources
│   │       └── book
│   │           └── ListViewPage
│   │               └── components
│   ├── sagas
│   ├── store
│   └── utils
├── database
│   ├── config
│   ├── migrations
│   ├── models
│   │   └── __mocks__
│   └── seeders
└── server
    ├── routes
    ├── service
    ├── sql
    └── utils
```
## TODO
***
- docker-compose 로 nginx 무중단 배포 지원
- Sequelize Pagination 기능 추가

## REFERENCES
***
- [Express 공식 문서](https://expressjs.com/ko/guide/error-handling.html)
- [Jest 공식 문서](https://jestjs.io/docs/en/mock-functions)
- [Sequelize CLI를 사용하여 User API 만들기](https://velog.io/@jeff0720/Sequelize-CLI%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EA%B0%84%EB%8B%A8%ED%95%9C-User-API-%EB%A7%8C%EB%93%A4%EA%B8%B0-vdjpb8nl0k#6.-sequelize-cli-seed%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0)
- [Setup a REST API with Sequelize and Express.js](https://medium.com/infocentric/setup-a-rest-api-with-sequelize-and-express-js-fae06d08c0a7)
- [Implementing JSON Web Tokens & Passport.js in a JavaScript Application with React](https://itnext.io/implementing-json-web-tokens-passport-js-in-a-javascript-application-with-react-b86b1f313436)
- [[Node.js / JWT] Express.js 서버에서 JWT 기반 회원인증 시스템 구현하기](https://velopert.com/2448)
- [JWT(JSON Web Token)로 로그인 REST API 만들기](https://www.a-mean-blog.com/ko/blog/Node-JS-API/_/JWT-JSON-Web-Token-%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-REST-API-%EB%A7%8C%EB%93%A4%EA%B8%B0)
- [Nodejs Authentication Using JWT and Refresh Token](https://codeforgeek.com/refresh-token-jwt-nodejs-authentication/)
- [Docker Compose에서 컨테이너 startup 순서 컨트롤하기](https://jupiny.com/2016/11/13/conrtrol-container-startup-order-in-compose/)
- [도커 컴포즈를 활용하여 완벽한 개발 환경 구성하기](https://www.44bits.io/ko/post/almost-perfect-development-environment-with-docker-and-docker-compose#%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%8B%A4%ED%96%89)
- [6) 스프링부트로 웹 서비스 출시하기 - 6. TravisCI & AWS CodeDeploy로 배포 자동화 구축하기](https://jojoldu.tistory.com/265)

[Demo Link]: http://54.180.137.113
[상세 기획안]: https://ridicorp.atlassian.net/wiki/spaces/DevSpace/pages/808716446
[Asana Project]: https://app.asana.com/0/1125465046061846/list "Asana Project 입니다"
[메인 페이지]: public/1_home.png
[회원 가입 페이지]: public/2_register.png
[대여하기]: public/3_borrow.png
[반납하기]: public/4_return.png
[연체 반납하기]: public/5_delay.png
[대여불가]: public/6_penalty.png
[ridi/tslint-config]: https://github.com/ridi/tslint-config
[express-async-handler]: https://www.npmjs.com/package/express-async-handler
[sequelize-typescript]: https://www.npmjs.com/package/sequelize-typescript
[redux-form]: https://redux-form.com/8.2.2/docs/gettingstarted.md/
[HOC]: https://velopert.com/3537
[styled-components]: https://www.styled-components.com/docs/basics#attaching-additional-props
[reactstrap]: https://reactstrap.github.io/components/toasts/
[supertest]: https://github.com/visionmedia/supertest
[sinon]: https://sinonjs.org/releases/v7.3.2/
[배포 구조]: https://images.velog.io/post-images/jeff0720/e95839f0-1e49-11e9-8462-69750cac5b40/-2019-01-22-10.30.27.png "배포 구조"
[Travis Deployment]: https://docs.travis-ci.com/user/deployment
[프로젝트]: https://app.asana.com/0/1125465046061846/list
[property-validator]: https://www.npmjs.com/package/property-validator#everything
