-- Create a table to store products
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    heading TEXT,
    description TEXT,
    price NUMERIC
);

-- Insert some data
INSERT INTO products (name, heading, description, price)
VALUES
    ('Quantum Leap Headphones', 'Sonic Bliss Unleashed', 'Immersive audio with noise cancellation that transports you.', 299.99),
    ('Smartphone', 'Your Digital Life', 'The ultimate device for staying connected and entertained.', 999.99),
    ('Smartwatch', 'Your Wrist, Your World', 'Stay connected and track your fitness goals.', 199.99),
    ('Office Chair', 'Elevate Your Workspace', 'Experience optimal comfort and support while working.', 1499.99),
    ('Virtual Reality Headset', 'Escape the Ordinary', 'Your new favorite way to avoid chores.', 399.99);

-- Select all products
SELECT
    name,
    concat(heading, ': ', description) as details,
    concat(price, '€') as price
FROM products
ORDER BY price DESC;