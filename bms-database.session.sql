use Books;

SELECT * FROM booksData;
SELECT title, price FROM booksData;
SELECT * FROM booksData
WHERE price > 300;
SELECT * FROM booksData
WHERE author_id = 1;
SELECT 
    b.title,
    a.name AS author,
    c.category_name AS category
FROM booksData b
JOIN authors a ON b.author_id = a.author_id
JOIN categories c ON b.category_id = c.category_id;
SELECT COUNT(*) AS total_books FROM booksData;
SELECT 
    c.category_name,
    COUNT(*) AS total_books
FROM booksData b
JOIN categories c ON b.category_id = c.category_id
GROUP BY c.category_name;
SELECT MAX(price) AS highest_price FROM booksData;
SELECT MIN(price) AS lowest_price FROM booksData;
UPDATE booksData
SET price = 599.99
WHERE book_id = 1;
SELECT * FROM booksData
WHERE title LIKE '%Harry%';
SELECT * FROM booksData
ORDER BY price DESC;
SELECT * FROM booksData
LIMIT 2;