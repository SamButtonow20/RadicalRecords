-- insert_products.sql
INSERT INTO products (name, description, image_url, price, category_id, is_featured)
VALUES ('Abbey Road Vinyl', 'Classic Beatles album', 'images/abbey_road.jpg', 29.99, 1, TRUE);

INSERT INTO products (name, description, image_url, price, category_id, is_featured)
VALUES ('Dark Side of the Moon CD', 'Pink Floyd’s iconic album', 'images/darksideofthemoon.jpg', 34.99, 2, FALSE);

INSERT INTO products (name, description, image_url, price, category_id, is_featured)
VALUES ('King Gizzard Live From Chicago 23', 'Official Live Ablum of KGLW from Chicago', 'images/kglwchicago.jpg', 54.99, 3, TRUE);
