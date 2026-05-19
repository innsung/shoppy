use shoppy;
select database();
show tables;
select * from information_schema.views where table_schema = 'shoppy';
select * from member;
select * from product;
desc product;

-- 전제 상품 조회
select  pid,
        concat('images/', image) as image
from product;        

-- product + product_detailinfo 테이블 조인
select  p.pid,
		p.name,
		p.price,
		p.info,
		p.rate,
		concat('/images/', p.image) as image,
		p.img_list as imgList,
		pd.title_en,
		pd.title_ko,
		pd.list
	from product p, product_detailinfo pd
	where p.pid = pd.pid
	and p.pid = 1;
        
show tables;
select * from product_detailinfo;

select count(id) as isFind from member where id='test';
select * from member;

-- x select count(*) from member where id ='test' and pwd='1234';

select pwd from member where id = 'test';

select * from cart;
select * from member;
select * from product;
select * from view_Cartlist;
select * from support;
-- 어떤 고객이 어떤 상품을 몇개 구입했는가?




























