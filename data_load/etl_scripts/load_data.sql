-- create staging table for reviews, and import data
drop table reviews_staging;
create table reviews_staging (
	id varchar(2000),
	product_id varchar(2000),
	rating  varchar(2000),
	date  varchar(2000),
	summary varchar(2000),
	body varchar(2000),
	recommend  varchar(2000),
	reported  varchar(2000),
	reviewer_name varchar(2000),
	reviewer_email varchar(2000),
	response varchar(2000),
	helpfulness  varchar(2000)
);

\COPY reviews_staging (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM './data/reviews.csv' DELIMITER ',' NULL AS 'null'  CSV HEADER;

-- convert and insert from staging into reviews
insert into reviews
	select
		id::INTEGER,
		product_id::INTEGER,
		rating::INTEGER,
		TO_TIMESTAMP(date::BIGINT / 1000),
		summary,
		body,
		recommend::BOOLEAN,
		reported::BOOLEAN,
		reviewer_name,
		reviewer_email,
		response,
		helpfulness::INTEGER
	from reviews_staging;


-- import directly into photos
\COPY photos (id, review_id, url) FROM './data/reviews_photos.csv' DELIMITER ',' NULL AS 'null' CSV HEADER

-- import directly into characteristic

\COPY characteristics (id, product_id, name) FROM './data/characteristics.csv' DELIMITER ',' NULL AS 'null' CSV HEADER;

-- import directly into characteristic_review
\COPY characteristics_reviews (id, characteristic_id, review_id, value) FROM './data/characteristic_reviews.csv' DELIMITER ',' NULL AS 'null' CSV HEADER;


-- reset sequence of ids after import
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM "reviews"));
SELECT setval('photos_id_seq', (SELECT MAX(id) FROM "photos"));
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM "characteristics"));
SELECT setval('characteristics_reviews_id_seq', (SELECT MAX(id) FROM "characteristics_reviews"));
