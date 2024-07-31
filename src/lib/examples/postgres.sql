-- Load pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    data JSON,
    price NUMERIC,
    weight NUMERIC,
    rating NUMERIC,
    embedding VECTOR(3)
);

-- Insert some data
INSERT INTO products (name, data, price, weight, rating, embedding)
VALUES
    ('Quantum Leap Headphones', '{"heading": "Sonic Bliss Unleashed", "description": "Immersive audio with noise cancellation that transports you."}', 299.99, 0.5, 4.5, '[0.1, 0.9, 0.2]'),
    ('Smartphone', '{"heading": "Your Digital Life", "description": "The ultimate device for staying connected and entertained."}', 999.99, 0.3, 4.7, '[0.2, 0.8, 0.1]'),
    ('Smartwatch', '{"heading": "Your Wrist, Your World", "description": "Stay connected and track your fitness goals."}', 199.99, 0.2, 4.0, '[0.3, 0.7, 0.3]'),
    ('Office Chair', '{"heading": "Elevate Your Workspace", "description": "Experience optimal comfort and support while working."}', 1499.99, 10.0, 4.8, '[0.4, 0.6, 0.4]'),
    ('Virtual Reality Headset', '{"heading": "Escape the Ordinary", "description": "Your new favorite way to avoid chores."}', 399.99, 1.0, 4.2, '[0.5, 0.5, 0.5]');

-- Select all products, ordered by similarity to the 'Virtual Reality Headset'
SELECT
    name,
    data->>'heading' AS heading,
    data->>'description' AS description,
    price,
    weight,
    rating,
    embedding <-> (SELECT embedding FROM products WHERE name LIKE '%Headset%') AS distance
FROM products
ORDER BY distance;