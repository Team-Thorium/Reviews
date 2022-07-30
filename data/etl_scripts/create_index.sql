create index reviews_product_id_idx on reviews (
	product_id
);

create index char_product_id_idx on characteristics (
	product_id
);

create index photo_reviews_id_idx on photos (
	review_id
);

create index char_review_char_id_idx on characteristics_reviews (
	characteristic_id
);