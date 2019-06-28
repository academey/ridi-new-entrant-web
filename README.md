### This repo is Working in Progress
[![Build Status](https://travis-ci.org/academey/ridi-new-entrant-web.svg?branch=master)](https://travis-ci.org/academey/ridi-new-entrant-web)
# Ridi Mini Library (Web Part)

상세 기획안 : https://ridicorp.atlassian.net/wiki/spaces/DevSpace/pages/808716446
리디 뷰어팀의 신규 입사자 과제 저장소 입니다.

## 설치방법
##### 1. 프로젝트 의존성 및 DB 설치   
<pre><code>$ git clone https://github.com/academey/ridi-new-entrant-web
$ cd ridi-new-entrant-web
$ npm install
$ docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass --name mariadb3306 mariadb
$ docker exec -it mariadb3306 mysql -u root -p
... 사용할 DB 생성 </code></pre>

##### 2. 환경 변수 설정 
프로젝트 루트의 .env.example 파일을 자기 환경에 맞게 조정한다.

##### 3. 프로젝트 실행
<pre><code> $ npm run dev</code></pre>

## 사용한 기술 스펙
- Typescript
- Express, Sequelize
- React, Redux, Redux-saga 

