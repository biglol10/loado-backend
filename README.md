# loado-backend
로스트아크 숙제관리 백엔드 + React build 폴더


<br/>

사용 언어, DB:
  1. Node express
  2. MongoDB, mongoose 패키지

<br/>

참고/공부 자료 (일부만 기재)
  1. React - https://www.udemy.com/course/mernstack-nextjs-withsocketio/
  2. Express - https://www.udemy.com/course/nodejs-api-masterclass/
  3. Html, js, css - https://www.udemy.com/course/web-projects-with-vanilla-javascript/
  4. Open source UI library - https://react.semantic-ui.com/
 
<br/>

배포 및 가상 서버
  1. Heroku - React, Express 배포
  2. AWS EC2 - 06시 배치 api 전송용

<br/>

주요 기능 소개
  1. 사용자 가입 및 로그인 (이메일 등 개인정보 관리가 힘들 것 같아 비밀번호 복구 기능 존재X)
  2. 사용자별 등록한 숙제 가져오기
  3. 숙제별(케릭터별) 휴식게이지, 컨탠츠 수정반영
  4. 원정대 공유 컨탠츠(어비스 레이드, 리허설, 데자뷰)는 수요일에 초기화
  5. AWS 가상서버로 매일 06시에 배치를 돌려 매일 06시 기준 휴식게이지 정산 
  6. 매주 수요일은 주간컨탠츠 (군단장) 초기화



