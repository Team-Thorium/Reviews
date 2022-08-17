create or replace view ratings_view as select
		product_id,
		SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as "1",
		SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as "2",
		SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as "3",
		SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as "4",
		SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as "5"
	from reviews
	group by product_id;


create or replace view recommend_view as select product_id,
		SUM(CASE WHEN recommend = true THEN 1 ELSE 0 END) as true,
		SUM(CASE WHEN recommend = false THEN 1 ELSE 0 END) as false
	from reviews
	group by product_id;

create or replace view characteristics_meta_view as select
		c.product_id,
		c.id char_id,
		AVG(cr.value) as value
	from characteristics c
	inner join characteristics_reviews cr
	on c.id = cr.characteristic_id
	group by c.id, c.product_id, c.name;

create or replace view reviews_view as select
		id as review_id,
		product_id,
		rating,
		summary,
		recommend,
		response,
		body,
		date,
		reviewer_name,
		helpfulness,
		(
			select coalesce(json_agg(photos), '[]'::json) from
			(select p.id, p.url from photos p where p.review_id = r.id) as photos
		) as photos
	from reviews r
	where reported = false;

create or replace view meta_view as
with products as (
	select distinct product_id from reviews
)
select
		r.product_id,
		json_build_object('1', rv."1", '2', rv."2", '3', rv."3", '4',rv."4", '5', rv."5") as ratings,
		json_build_object('false', rev."false", 'true', rev."true") as recommended,
		json_build_object(c.name,
			json_build_object('id', cm.char_id, 'value', cm."value")
		) as characteristics
	from products r
  inner join ratings_view rv on rv.product_id = r.product_id
	inner join recommend_view rev on rev.product_id = r.product_id
	inner join characteristics c on c.product_id = r.product_id
	inner join characteristics_meta_view cm on (cm.char_id = c.id and cm.product_id = c.product_id);