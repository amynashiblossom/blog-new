---
title: 생산성,브랜딩 관련_옵시디언을 cloudflare로 연동시켜 기술블로그 생성_수정본2
tags:
  - 기술브랜딩
  - 브랜딩
  - 생산성
publish: true
---
!! 옵시디언을 cloudflare와 연동시키는 데에는 원래는 이렇게 복잡하거나 어렵거나 꼬이는 일이 없습니다
다만 저의 경우는 뭔가 자꾸 꼬여서 문제가 생겼었고요

전체적인 구조는 https://hel-p.tistory.com/56 을 참고하셔서 진행하시면 됩니다.

다만 추가적인 설명을 함께 드리고자 합니다.

1. github의 계정 생성 및 git 다운로드 - 레포지토리의 이름을 blog-new식으로 만든다면
![[Pasted image 20260630110933.png]]![[Pasted image 20260630111645.png]]이 폴더 즉 blog-new로 git 을 다운받으셔야 합니다

일단 git 다운 후 깃허브와 연동시키는 과정 외에
[cmd] 실행 통해서 
npm install 시켜야 하는 부분이 있어요


그 밖에 사항들 중 진행하다가 오류가 약 4일 동안 많이 난 부분을 말씀드릴게요


! component 폴더 내의 Quartz/ components 내에 경로 설정 부분

!. Quartz 에서 head.tsx 파일 내에 customOgIamges를 정의하는 코드가 꼭 필요합니다
const CustomImagesEmitterName = "CustomOgImages"
(제미나이의 도움 받아 코드 작성) * 이 부분은 * CustomOgimages 관련 플러그인이 없는 관계로 아예 이 줄을 삭제하는 방법으로 다시 해결했습니다.

![[Pasted image 20260630133356.png]]

이 방식보다는 그냥 
/customOgImages 가 없는 형태로 수정해서 진행했습니다.
![[생산성,브랜딩 관련_옵시디언을 cloudflare로 연동시켜 기술블로그 생성1.png]]

깃허브 연동까지 시키신 후에는 => cloudflare라는 배포사이트의 도움으로 옵시디언을 배포시킬 수 있는데요(무료)
이 과정에서 오류가 많이 났습니다.

cloudflare 가입하신 후,
일단 page로 설정하셔야 하는데요
worker를 create 하는게 아니라 page를 찾는 것도 까다롭습니다.

제가 찾은 방법은 홈에서 +add 를 눌렀을 때 나오는 page를 선택하면
pages로 배포 선택에 용이합니다.


그런다음 git repository를 import 한다는 옵션을 선택하시고

!!이 상태에서 주의하실 사항: 
 - github계정도 있으셔야 함
 - git도 윈도우용이든 맥 용이든 다운을 받아서 
 - 깃허브의 레포지토리-동기화시키시고자하는 옵시디언 블로그와 연동된) 내에 
 - git을 까신 상태셔야 합니다.




저 다음 단계에서는 이름을 설정해야 하는데 그것이
pages.dev 앞에 들어갈 url구성을 합니다(변경 못함)/ 프로젝트를 밀고 새로 만들어야 가능
(새로 만들때는 그 전 이름으로 가능하나 반드시 빌드캐시를 계속 clear 해 줘야만 함)

도움 받은 https://hel-p.tistory.com/56 에서는 
build command를 npx quartz build로 적으라 되어 있는데요,

head 파일에서 Csu





!! 매우 중요한 부분 : 빌드 캐시를 계속 없애준다




5일간의 생고생을 했지만, 
시각화에 뛰어난 옵시디언을 통해
자료를 정리하고 포폴을 구현하며
배포까지 시키는 부분 세팅이 아주 유익하다 생각됩니다.

윤지님의 말씀에 따르면 ai도 옵시디언 글을 잘 읽는다고 합니다!

윤지님께도 감사를 드립니다.

!! 그리고 옵시디언의 왼쪽 하단의 세팅(톱니바퀴)

통해서 세팅에서
plugin 꼭 다운받으셔야 할 부분이
 - git (개발자 vinzent 기여)
 - paste image rename 
이 두 플러그인 입니다!!
[[생산성]] 

1. git 통해서는 git 통해 [ctrl]+p 로 
 git: commit all changes, 
 git: commit-and-sync,
 git: push 를 순서대로 눌러서 깃허브와 동기화를 바로 시킬 수 있습니다.

(ctrl+p를 눌렀을 때 뜨는 화면)

2. paste image rename 통해서는 
단축키인 [윈도우]+[shift]+[s] 통해 이렇게 바로바로 캡쳐를 뜨는 화면이 나옵니다
(해당화면은 prt screen키로 땄습니다)

 (옵시디언플러그인이용) 
 - 옵시디언플러그인
 을 함께 활용하면 생산성 증대에 매우 유리한 세팅을 할 수 있기에 꼭 추천드립니다.
감사합니다!

* 큰 문제점을 발견한게 : 클립보드에서 바로 붙여넣으면 다시 깃허브에서 다운받을때 파일이 없어져버리는 문제점을 발견했습니다.
* 그래서 그냥 asset에 화면을 [윈도우]+[shift]+[s]가 아니라 하단의 
*오려두기 형태로 화면을 캡쳐하셔셔 저장하시는 것을 추천드립니다.

그리고 [[옵시디언태그가독성강화]]

![[옵시디언활용2.PNG]]

![[옵시디언활용법3.png]]



styles의 custom에서 태그 가독성 강화 코드는 

![[옵시디언 활용4.png|615]]

해당 코드는 
@use "./variables.scss" as *;

  

.tags {

    display: flex;

    flex-wrap: wrap;

    gap: 0.25rem;

}

.pill {

    white-space: nowrap;

    margin: 0 !important;

}

.page-header .properties {

    display: block;

    text-align: left;

}

  

/* 태그가 나열되는 셀의 정렬을 왼쪽으로 변경 */

.page-header .properties td {

    text-align: left !important;

    justify-content: flex-start !important;

}

  

/* 태그 그룹을 왼쪽으로 배치 */

.page-header .tags {

    display: flex;

    justify-content: flex-start;

    flex-wrap: wrap;

    gap: 0.5rem;

}