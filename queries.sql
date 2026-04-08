select * from authors;
select * from  categories;
SELECT 
    b.title,
    a.name AS author,
    c.category_name AS 
category,
    b.price
FROM books b
JOIN authors a ON b.
author_id = a.author_id
JOIN categories c ON b.
category_id = c.category_id;
SELECT * FROM authors WHERE 
author_id = 1;
SELECT * FROM books;
SELECT * FROM books WHERE 
price BETWEEN 250 AND 450;
SELECT * FROM authors where 
author_id = 2;
SELECT * FROM categories
WHERE category_name = 
'Fiction';
