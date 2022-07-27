-- create tables --
drop table reviews;
create table reviews (
	id serial primary key,
	product_id int,
	rating int,
	date timestamp not null,
	summary varchar(2000),
	body varchar(2000),
	recommend boolean,
	reported boolean default false,
	reviewer_name varchar(100),
	reviewer_email varchar(100),
	response varchar(2000),
	helpfulness int
);

drop table photos;
create table photos (
	id serial primary key,
	review_id int,
	url varchar(2000),
	FOREIGN KEY (review_id)
		REFERENCES reviews (id)
);

drop table characteristics;
create table characteristics (
	id serial primary key,
	product_id int,
	name varchar(100)
);

drop table characteristics_reviews;
create table characteristics_reviews (
	id serial primary key,
	characteristic_id int,
	review_id int,
	value int,
	FOREIGN KEY (characteristic_id)
		REFERENCES characteristic (id),
	FOREIGN KEY (review_id)
		REFERENCES reviews (id)
);