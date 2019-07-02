# Ridi Mini Library (Web Part)
[![Build Status](https://travis-ci.org/academey/ridi-new-entrant-web.svg?branch=master)](https://travis-ci.org/academey/ridi-new-entrant-web)

[Demo Link][Demo Link] | [상세 기획안][상세 기획안] | [Asana Project][Asana Project]


리디 뷰어팀 박현준의 신규 입사자 과제(미니 도서관 만들기) 저장소 입니다.

## Prerequisites
- Docker
- Docker-compose
- Node (^10.16.0)
## Installation
##### 1. 환경 변수 설정 
프로젝트 루트의 .env.example 파일을 자기 환경에 맞게 조정해 .env 파일로 변경합니다.

##### 2. 프로젝트 의존성 및 DB 설치   
<pre><code>$ git clone https://github.com/academey/ridi-new-entrant-web
$ cd ridi-new-entrant-web
$ npm install
$ docker-compose up
... 사용할 DB 생성 </code></pre>


##### 3-1. [Development] 프로젝트 실행
<pre><code> $ npm run dev</code></pre>

##### 3-2. [Production] 프로젝트 실행
<pre><code> $ npm run prod</code></pre>

## Examples
![메인 페이지][메인 페이지]
> 메인 페이지. 책 리스트를 조회하고 대여할 수 있다.

![회원 가입 페이지][회원 가입 페이지]
> 회원 가입 페이지. JWT Token 방식으로 인증하며 토큰이 스토리지에 저장되고 해당 토큰을 이용해 유저 정보를 불러온다.

![대여하기][대여하기]
> 로그인 한 상태에서 대여하기 버튼을 누르면 책을 대여할 수 있다. 다른 유저가 빌린 책은 못 빌린다.

![반납하기][반납하기]
> 로그인 한 유저가 대여한 책이 있다면 해당 책을 반납할 수 있다.

## 사용한 기술 스펙
#### 1. Language / Platform / Framework
##### Typescript
[ridi/tslint-config][ridi/tslint-config]를 상속해서 개발했습니다. commit 시 lint-staged 를 통해 lint 와 prettier 가 실행되며 코드 컨벤션이 맞춰집니다. 
##### Node.js
10.16.0 버전을 사용했습니다.
##### Express
Express 에서 async/await 문법을 쓰고 싶어 [express-async-handler][express-async-handler]를 사용했습니다. 또한 그 외의 에러처리, DB Sync, cors, logger, body-parser 등 다양한 미들웨어를 사용했습니다.
##### Sequelize
typescript 와 연계해서 사용하려고 했으나 인터페이스와 타입형을 지원하지 않습니다. 따라서 데코레이터 기반으로 타입형을 지원하는 라이브러리인 [sequelize-typescript][sequelize-typescript]를 사용했습니다. sequelize-cli 을 이용해 migration, seed 파일도 생성했습니다.

#### 2. Front Framework / Middleware / Library
##### React
이제 React의 대다수의 라이브러리가 Typescript를 지원한다고 해서 이를 이용해 개발해봤습니다.
##### Redux & Redux-saga
상태 관리를 Redux 와 Redux-saga 를 이용했습니다. 비동기로 작동하는 액션을 처리하는 것은 모두 redux-saga 를 통하도록 만들었습니다. 추후에는 Saga를 연결하거나 컨테이너를 호출하는 부분을 최적화시켜야 합니다.
##### redux-form & styled-components & reactstrap
[redux-form][redux-form]을 이용해 Redux state container 를 만들었습니다. [HOC][HOC]기법을 이용해 Redux container 로 폼의 필드값들을 등록해주고 액션을 관리합니다. 항상 반복되는 폼 형태를 쉽게 만들 수 있습니다.
[styled-components][styled-components]을 이용해 컴포넌트 단위별로 스타일을 관리할 수 있습니다.
[reactstrap][reactstrap] 그냥 그나마 이뻐서 썼습니다.

#### 3. DB
##### MariaDB
Docker Image 로 DB를 관리했습니다. DB 데이터를 보존하고 싶으면 docker-compose.yml 의 volumes 마운팅 부분 설정을 넣어줘야 합니다. Author 와 Book 을 M:N 관계로 구현하고자 테이블은 만들어 놓았으나 필수 스펙에 작가 조회 및 생성이 없어 진행하지 않았습니다. 현재 BookReservation 에 endAt 칼럼이 있는데, 추가 스펙인 *예약된 도서가 일정 기간 동안 대여가 되지 않았을 경우 다음 사람에게 넘어감* 을 추후 개발하기 위해 생성해두었습니다.

#### 4. Test
##### Jest
[supertest][supertest]를 사용해서 통합 테스트를 진행했습니다. 단위 테스트를 할만한 기능이 없었고 모두 DB를 이용한 CRUD 였기 때문에 DB를 [sinon](https://sinonjs.org/releases/v7.3.2/)을 통해 mocking 하고 테스트했습니다. 다만 passport 미들웨어를 mocking 하는 부분이 잘 되지 않아 로직 쪽에 분기문을 불가피하게 넣었습니다. 이는 추후 과제로 남겨두었습니다.

#### 5. 개발 환경
##### docker-compose
DB와 Web(client + server)을 띄웠습니다. Web을 volume mounting 하여 hot-reload 시키려고 했으나 에러가 발생했고, 해결하지 못해 webpack-dev-server와 nodemon을 이용해 개발했습니다. [관련 링크][관련 링크] 

#### 6. 배포 환경
![배포 구조][배포 구조]
##### Travis 
Git commit 이 오면 Travis 에서 빌드 & 테스트를 시작합니다. 성공하면 배포도 시작하게 됩니다. 스크립트로 수동으로 클라우드에 접근하는 방식이 아닌 [Travis Deployment](https://docs.travis-ci.com/user/deployment)을 이용해 배포했습니다. 
##### S3
소스코드를 압축해서 버켓에 업로드합니다.
##### CodeDeploy
업로드한 소스코드를 EC2에 보냅니다. 존재하던 기존 소스코드를 overwrite 하고, 실패할 경우 자동으로 롤백시킵니다.
##### EC2
소스코드를 받으면 ./execute-deploy.sh 를 실행합니다. 기존 docker 프로세스를 멈추고, 다시 띄웁니다. 이 과정에서 downtime 이 발생합니다. 따라서 추후에는 Blue-Green 배포를 지원할 예정입니다.

#### 7. Tools
##### Asana
해당 [프로젝트][Asana Project]에서 관리했습니다.

## TODO
- docker-compose 로 nginx container 관리 및 무중단 배포 지원
- docker-compose 에서 server의 volume mounting 이 에러가 남. 해당 에러는 아직 해결 못함 [관련 링크][관련 링크]
- jest 에서 React Unit Test 추가
- Sequelize Pagination 기능 추가

[Demo Link]: http://54.180.137.113
[상세 기획안]: https://ridicorp.atlassian.net/wiki/spaces/DevSpace/pages/808716446
[Asana Project]: https://app.asana.com/0/1125465046061846/list "Asana Project 입니다"
[메인 페이지]: public/1_home.png
[회원 가입 페이지]: public/2_register.png
[대여하기]: public/3_borrow.png
[반납하기]: public/4_return.png
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
[관련 링크]: https://nickjanetakis.com/blog/docker-tip-75-how-to-avoid-node-modules-in-your-volume-mounts
