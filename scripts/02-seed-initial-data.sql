-- Seeding initial data for coffee shop
-- Insert default categories
INSERT INTO categories (name, description, display_order) VALUES
('Coffee', 'Freshly brewed coffee beverages', 1),
('Pastries', 'Fresh baked goods and pastries', 2),
('Sandwiches', 'Delicious sandwiches and wraps', 3),
('Beverages', 'Non-coffee drinks and refreshments', 4),
('Desserts', 'Sweet treats and desserts', 5)
ON CONFLICT DO NOTHING;

-- Insert menu items
INSERT INTO menu_items (name, description, price, category_id, image_url, preparation_time, ingredients, allergens) VALUES
('Espresso', 'Rich and bold single shot', 3.50, 1, '/espresso-coffee-cup.png', 3, ARRAY['espresso beans', 'water'], ARRAY['caffeine']),
('Cappuccino', 'Espresso with steamed milk foam', 4.50, 1, '/placeholder-h3iwf.png', 5, ARRAY['espresso beans', 'milk', 'water'], ARRAY['caffeine', 'dairy']),
('Latte', 'Smooth espresso with steamed milk', 5.00, 1, '/placeholder-l1f75.png', 5, ARRAY['espresso beans', 'milk', 'water'], ARRAY['caffeine', 'dairy']),
('Americano', 'Espresso with hot water', 3.75, 1, '/placeholder-5c60b.png', 3, ARRAY['espresso beans', 'water'], ARRAY['caffeine']),
('Croissant', 'Buttery, flaky pastry', 3.25, 2, '/fresh-croissant.png', 2, ARRAY['flour', 'butter', 'eggs'], ARRAY['gluten', 'dairy', 'eggs']),
('Blueberry Muffin', 'Fresh baked with real blueberries', 4.00, 2, '/blueberry-muffin.png', 2, ARRAY['flour', 'blueberries', 'sugar', 'eggs'], ARRAY['gluten', 'eggs'])
ON CONFLICT DO NOTHING;

-- Insert table configuration
INSERT INTO tables (table_number, capacity, location) VALUES
(1, 2, 'window'), (2, 2, 'window'), (3, 4, 'center'), (4, 4, 'center'),
(5, 6, 'corner'), (6, 2, 'counter'), (7, 4, 'center'), (8, 2, 'window'),
(9, 4, 'center'), (10, 6, 'corner'), (11, 2, 'counter'), (12, 4, 'center'),
(13, 2, 'window'), (14, 4, 'center'), (15, 6, 'corner'), (16, 2, 'counter'),
(17, 4, 'center'), (18, 2, 'window'), (19, 4, 'center'), (20, 6, 'corner')
ON CONFLICT DO NOTHING;

-- Insert default admin staff
INSERT INTO staff (name, email, role, password_hash) VALUES
('Admin User', 'admin@brewandbean.com', 'admin', '$2b$10$example_hash_here'),
('Manager', 'manager@brewandbean.com', 'manager', '$2b$10$example_hash_here')
ON CONFLICT DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (item_name, current_stock, minimum_stock, unit, cost_per_unit, supplier) VALUES
('Coffee Beans - Arabica', 50, 10, 'kg', 25.00, 'Premium Coffee Suppliers'),
('Milk', 100, 20, 'liters', 2.50, 'Local Dairy Farm'),
('Sugar', 25, 5, 'kg', 1.50, 'Sweet Supplies Co'),
('Flour', 30, 10, 'kg', 2.00, 'Bakery Ingredients Ltd'),
('Butter', 15, 5, 'kg', 8.00, 'Dairy Products Inc'),
('Blueberries', 10, 3, 'kg', 12.00, 'Fresh Fruit Suppliers')
ON CONFLICT DO NOTHING;
