-- Create a table to store products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    heading TEXT,
    description TEXT,
    price MONEY,
    weight NUMERIC,
    rating NUMERIC
);

-- Insert some data
INSERT INTO products (name, heading, description, price, weight, rating)
VALUES
    ('Quantum Leap Headphones', 'Sonic Bliss Unleashed', 'Immersive audio with noise cancellation that transports you.', 299.99, 0.5, 4.5),
    ('Smartphone', 'Your Digital Life', 'The ultimate device for staying connected and entertained.', 999.99, 0.3, 4.7),
    ('Smartwatch', 'Your Wrist, Your World', 'Stay connected and track your fitness goals.', 199.99, 0.2, 4.0),
    ('Office Chair', 'Elevate Your Workspace', 'Experience optimal comfort and support while working.', 1499.99, 0.0, 4.8),
    ('Virtual Reality Headset', 'Escape the Ordinary', 'Your new favorite way to avoid chores.', 399.99, 1.0, 4.2);

-- Select all products
SELECT
    name,
    concat(heading, ': ', description) as details,
    price
FROM products
ORDER BY price DESC;