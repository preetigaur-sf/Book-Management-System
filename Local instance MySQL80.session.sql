use BMS;
select * from Books;
select * from Authors;
select * from Categories;
show tables;


SELECT 
    b.title,
    a.name AS author,
    b.isbn,
    b.publication_date,
    c.category_name AS category,
    b.price
FROM Books b
JOIN Authors a ON b.AuthorId = a.id
JOIN Categories c ON b.CategoryId = c.id;