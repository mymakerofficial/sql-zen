CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    favorite_color TEXT NOT NULl,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, favorite_color)
VALUES ('Alice', 'blue'),
    ('Bob', 'green'),
    ('Charlie', 'red'),
    ('David', 'blue');

SELECT * FROM users;

SELECT *
FROM users
WHERE favorite_color = 'blue'
ORDER BY name DESC;