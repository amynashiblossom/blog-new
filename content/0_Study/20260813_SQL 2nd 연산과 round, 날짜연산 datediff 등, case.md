---
title: 20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등
tags:
  - SQL
  - 날짜연산
  - round
  - concat
  - datediff
  - case
date: 2026-08-13
publish: true
---
*일단 데이터베이스가* 내가 생성했던 데이터베이스가 맞는지 확인도 해야 함! 
localhost 그리고 gangdong
![[20260813_SQL 2nd.png]]

![[20260813_SQL 2nd-1.png]]
order by는 정렬만 반환한 것이지, 데이터 순서는 바뀌는 것 아님.

null 값에 항상 주의해야 함.

샘플데이터의 엔티티를 보기 위해 "다이어그램 보기"로 엔티티 관계도로 확인 가능
![[20260813_SQL 2nd-2.png]]

볼드처리된 항이 기본키( #primarykey )

[LIMIT - 결과 행 제한하는 명령어]
실무에서 십만개 이런식으로 행이 나오지 않게 행의 개수를 제한하는 것

![[20260813_SQL 2nd-3.png]]

#offset offset 10 이면 10개 건너띄고 나오게 하라는 의미
![[20260813_SQL 2nd-4.png]]

주의할 부분이!! 
order by에 #limit** 을 걸려면
order by 하고 limit을 적어야 함.
order by lastname limit 3
![[20260813_SQL 2nd-5.png]]

![[20260813_SQL 2nd-6.png]]

![[20260813_SQL 2nd-7.png]]

사칙연산 -> 가장 먼저 
연산자의 우선순위 상 사칙연산 먼저
![[20260813_SQL 2nd-8.png]]![[20260813_SQL 2nd-9.png]]

#orderby 는 select 보다는 더 나중에 실행되므로 select에서 붙인 별명 사용가능하다
![[20260813_SQL 2nd-10.png]]

그리고 연산이 된 건 실제 데이터값 변경으로 반영되어 칼럼이 생성되는게 아니라 보여지기만 하는것

![[20260813_SQL 2nd-11.png]]

order by total >=2 #secelct 에서 붙인 별명으로 orderby에서 못쓴다!!

  

select invoicelineId,

unitprice,

quantity,

unitprice * quantity as total

from invoiceline

where unitprice * quantity >=2;
![[20260813_SQL 2nd-12.png]]
![[20260813_SQL 2nd-13.png]]
조건을 넣을때는 where 넣어서 하자!!

*소수점* 처리하는 부분 
-> round : 반올림 #round 를 select에서 지금 하기!
![[20260813_SQL 2nd-15.png]]

![[20260813_SQL 2nd-16.png]]

 round(amount,-2) 하면 10의 자리에서 반올림한다.
 ![[20260813_SQL 2nd-17.png]]
 
roound 외에도 sin, cos(삼각함수)
SQRT : 루트계산
SUM: 그룹의 합계

#concat : 문자열을 합치는 함수
![[20260813_SQL 2nd-18.png]]

select concat '   ' 중간 띄우기 가능
![[20260813_SQL 2nd-19.png]]

#substring(칼럼이름, 몇번째부터, 몇 글자) 꼭 칼럼이름다음 , 콤마 꼭!!!!
![[20260813_SQL 2nd-20.png]]

![[20260813_SQL 2nd-21.png]]

그리고 두 칸 이상 엔터가 쳐지면 어디서 테이블 가져와야 할 지모르겠다고 오류자주남!
![[Pasted image 20260813153053.png]]

연산자 우선순위 
산술연산자 - 연결연산자 || - 비교연산자 <,>,<=>=<>,= - is null/like/in- between - not연산자  and 연산자 or 연산자

#날짜연산
데이터베이스에서 아주 빈번하게 일어남
쇼핑사이트 입하, 출하, 주문, 가입날짜 등
날짜나 시간데이터는 사칙연산이 가능

select #now();
는 지금 실제 날짜와 시간
![[20260813_SQL 2nd-23.png]]

select now()에 테이블 갯수만큼 출력이 됨.
![[20260813_SQL 2nd-24.png]]
interval  day나 year 하면 과거로 돌아갈 수도 있거나 다음날짜로 갈 수 있음.

datediff라고하면 날짜가 얼만큼 지났는지 알 수 있음
select datediff('2026-08-13', '2026-01-01');
![[20260813_SQL 2nd-25.png]]
==datediff는 앞에서 뒤를 뺀다!!!==
==그래서 얼마나 지났는지 순방향은 앞에지금 , 뒤에 과거 숫자==
==주문으로부터 얼마나 걸렸는지,==
==월 분기, 얼마나 사람들이 이탈했는지 등을 구할때== 

#datediff diffday로 별칭삼아 하는 문제
![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등.png]]
datediff
와 반대로 
select #timestampdiff(second,)
timestampdiff는 뒤에서 앞을 뺀다!!!!  year, second, day등 다양하게 바꿀 순 있지만
select #timestampdiff(second,)

select #timestampdiff(second,)![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등-1.png]]

참고
![[Pasted image 20260813160639.png]]

![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등-3.png]]

![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등-4.png]]

#case 
조건문
![[Pasted image 20260813161156.png]]

값에 라벨링 할 때 많이 사용
 ==#case 도 첫번째는 select에서 사용된다!!!!!!!!!!!!!!==
조건별로 나눠지게 된 상황
![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등-6.png]]


![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등-7.png]]

else "~구" 따로 빼는건 복잡해지기에 보통은 address로 만듦
![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등-8.png]]

select  * , 
case
 a=1 
 case는 라벨링을 한다.
 #구간화
 #binning
 수치형 데이터로 그룹핑 하는 것
구간별 라벨을 부여해서 
데이터 요약이나 분석결과 해석을 쉽게 해줌

구매금액 구간별 고객 분류(vip,일반)
-비즈니스 보고서에 가격대별 상품 개수
![[Pasted image 20260813164545.png]]

case와 order by를 같이 쓰는 상황
![[Pasted image 20260813164915.png]]
case~로 end, 맺고 country (asc) 하면 다시 country는 3 내에서는 순서대로 나열 가능

즉 case로는 하나의 덩어리라고 생각하면 좋다

!!! 한 덩이로 보는것이 편하다!!!
![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등-11.png]]

case와 order by 같이 쓸 때 한 덩이로 보는 것의 중요성
select도 아무리 길어도 select다 이렇게 구조를 보는 것이 중요

그리고 정렬할때도 다시 order by 내에 case 넣어서 정렬시킬 수 있음
![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등, case.png]]

![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등, case-1.png]]

주의할 부분은 case가 = 일때만 생략가능하고
case가 부등호일때는 saleslevel =  생략안된다!!!

![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등, case-2.png]]

**==case에서 like를 쓸 수 있을때에는 "~한 상태"와 함께 쓸 때에만 가능하다!==**
**==query쓸 때 자동완성값을 사용하는게 더 안전하다!!**==
==**자동완성을 많이 사용하자==**

 **==자동완성된 값+탭을 누르는게==** 안전하다!
![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등, case-3.png]]
더이상 가져올 칼럼 없는데 ,을 쓰는 것 주의!!!!!

![[20260813_SQL 2nd 연산과 round, 날짜연산 datediff 등, case-4.png]]연습문제4번의 답

datediff는 ('큰 날짜', invoicedate ) <=90 then '최근주문'

case 구문으로 많이 익숙해질정도로 계속 하는 게 중요하다고 생각됨