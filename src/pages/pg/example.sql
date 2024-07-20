-- Welcome to sql-zen`,
-- You can run queries by clicking the "Run All" button

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    data JSONB
);

INSERT INTO products (name, data)
VALUES ('Quantum Leap Headphones', '{"price": 299.99, "description": "Immersive audio with noise cancellation that transports you."}'),
    ('Office Chair', '{"price": 1499.99, "description": "Experience optimal comfort and support while working."}'),
    ('Virtual Reality Headset', '{"price": 699.99, "description": "Your new favorite way to avoid chores."}');

SELECT
    name,
    (data->>'price')::numeric AS price,
    data->>'description' AS description
FROM products
ORDER BY price;