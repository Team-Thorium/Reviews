create or replace view ratings_view as
	select product_id,
		SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as "1",
		SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as "2",
		SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as "3",
		SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as "4",
		SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as "5"
	from reviews
	group by product_id;


create or replace view recommend_view as
	select product_id,
		SUM(CASE WHEN recommend = true THEN 1 ELSE 0 END) as true,
		SUM(CASE WHEN recommend = false THEN 1 ELSE 0 END) as false
	from reviews
	group by product_id;

create or replace view characteristics_meta_view as
	select
		c.product_id,
		c.id char_id,
		c.name,
		AVG(cr.value) as value
	from characteristics c
	inner join characteristics_reviews cr
	on c.id = cr.characteristic_id
	group by c.id, c.product_id, c.name;

create or replace view reviews_view as
	select
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
		(select json_agg(photos) from
		(select p.id, p.url from photos p where p.review_id = r.id) as photos
		) as photos
	from reviews r;

create or replace view meta_view as
	select
		product_id,
		(select row_to_json(ratings) from
			(select "1", "2", "3", "4", "5"
			from ratings_view rv where rv.product_id = r.product_id) as ratings
		) as ratings,
		(select row_to_json(rec) from
				(select "false"::VARCHAR, "true"::VARCHAR
				from recommend_view rev where rev.product_id = r.product_id) as rec
			) as recommended,
		(select
				jsonb_object_agg(name,
					(select row_to_json(char) from
						(select char_id as id, value::VARCHAR
						from characteristics_meta_view cm where cm.char_id = c.char_id and cm.product_id = c.product_id) as char
					)
				)
		from characteristics_meta_view c
		where product_id = r.product_id
		) as characteristics
	from reviews r
	group by product_id;