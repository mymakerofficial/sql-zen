-- Welcome to sql-zen`
-- You can run queries by clicking the "Run All" button`,

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT
);

INSERT INTO users (name)
VALUES ('Alice'),
    ('Bob'),
    ('Charlie');

SELECT * FROM users;