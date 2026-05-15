-- Shopping links for items
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS link_url text;
