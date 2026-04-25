-- ============================================================
-- The Playground 2026 - Camp Tracker Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com)
-- ============================================================

-- 1. PROFILES (camp members with invite codes)
CREATE TABLE profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  emoji text DEFAULT '🙋',
  invite_code text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  role_names text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 2. ROLES (major + minor community roles)
CREATE TABLE roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('major', 'minor', 'internal')),
  lead text,
  key_support text[] DEFAULT '{}',
  status text DEFAULT 'filled' CHECK (status IN ('filled', 'vacant')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- 3. SPACES (physical areas of the camp)
CREATE TABLE spaces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  curators text[] DEFAULT '{}',
  description text,
  created_at timestamptz DEFAULT now()
);

-- 4. INVENTORY ITEMS
CREATE TABLE inventory_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text DEFAULT 'other',
  qty_needed integer DEFAULT 1,
  qty_acquired integer DEFAULT 0,
  sourcing text CHECK (sourcing IN ('borrow', 'buy', 'already_have')),
  source_name text,
  cost_estimate numeric(10,2),
  actual_cost numeric(10,2),
  storage_location text,
  brought_by text,
  assigned_role text,
  space_id uuid REFERENCES spaces(id) ON DELETE SET NULL,
  status text DEFAULT 'needed' CHECK (status IN ('needed', 'sourcing', 'acquired', 'on_site')),
  notes text,
  created_by_invite text,
  created_at timestamptz DEFAULT now()
);

-- 5. FINANCE ENTRIES
CREATE TABLE finance_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  amount numeric(10,2) NOT NULL,
  description text,
  person text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
  date date DEFAULT CURRENT_DATE,
  created_by_invite text,
  created_at timestamptz DEFAULT now()
);

-- 6. VOLUNTEER HOURS
CREATE TABLE volunteer_hours (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  hours numeric(4,1) NOT NULL,
  type text CHECK (type IN ('pre_camp', 'on_site')),
  task text,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- 7. TICKETS
CREATE TABLE tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('grant', 'directed', 'volunteer', 'general')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'issued')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 8. ACTIVITY LOG (for the gamified feed)
CREATE TABLE activity_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type text,
  entity_id text,
  created_at timestamptz DEFAULT now()
);

-- ===== ROW LEVEL SECURITY =====
-- For a camp tool, we trust the group.
-- Anyone with the anon key can read/write.
-- The invite code in the app determines what UI you see.
-- This is appropriate for a trusted community tool.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON roles FOR SELECT USING (true);
CREATE POLICY "Public read" ON spaces FOR SELECT USING (true);
CREATE POLICY "Public read" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON finance_entries FOR SELECT USING (true);
CREATE POLICY "Public read" ON volunteer_hours FOR SELECT USING (true);
CREATE POLICY "Public read" ON tickets FOR SELECT USING (true);
CREATE POLICY "Public read" ON activity_log FOR SELECT USING (true);

-- Allow full write access for authenticated (anyone with the key)
CREATE POLICY "Public write" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Public write" ON roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON roles FOR UPDATE USING (true);
CREATE POLICY "Public write" ON spaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON spaces FOR UPDATE USING (true);
CREATE POLICY "Public write" ON inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON inventory_items FOR UPDATE USING (true);
CREATE POLICY "Public write" ON inventory_items FOR DELETE USING (true);
CREATE POLICY "Public write" ON finance_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON finance_entries FOR UPDATE USING (true);
CREATE POLICY "Public write" ON finance_entries FOR DELETE USING (true);
CREATE POLICY "Public write" ON volunteer_hours FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON volunteer_hours FOR UPDATE USING (true);
CREATE POLICY "Public write" ON volunteer_hours FOR DELETE USING (true);
CREATE POLICY "Public write" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON tickets FOR UPDATE USING (true);
CREATE POLICY "Public write" ON tickets FOR DELETE USING (true);
CREATE POLICY "Public write" ON activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write" ON activity_log FOR DELETE USING (true);

-- ===== SEED DATA =====

-- Admin profile
INSERT INTO profiles (name, emoji, invite_code, is_admin) VALUES
  ('Maxim', '🧑‍💻', 'playground-admin', true);

-- Roles (from ThePlayground2026RolesHowtoJoinOW2026.html)
INSERT INTO roles (name, type, lead, key_support, status) VALUES
  ('Master of Ceremonies', 'major', 'Kiki', ARRAY['Julia'], 'filled'),
  ('Admin & Communication', 'major', 'Estara', '{}', 'filled'),
  ('Set-Up Lead', 'major', 'Mario', ARRAY['4 assistants'], 'filled'),
  ('Take-Down Lead (LNT)', 'major', 'Hailey', ARRAY['Pablo'], 'filled'),
  ('Inventory & Finance', 'major', 'Maxim', '{}', 'filled'),
  ('Tools Daddy', 'major', 'Will', '{}', 'filled'),
  ('Power & Generators Lead', 'major', 'Tom', ARRAY['Ignacio', 'Ben', 'Vince'], 'filled'),
  ('Camps Mommy (Concierge)', 'major', 'Tito Ohep', ARRAY['Pablo'], 'filled'),
  ('Workshops & Offerings Logistics', 'major', 'Isa', ARRAY['Pablo'], 'filled'),
  ('Transportation Logistics', 'major', '', ARRAY['Ben'], 'vacant'),
  ('Building Lead', 'major', 'Lyly', ARRAY['Maxim'], 'filled'),
  ('Village Sanctuary', 'minor', 'Ignacio', ARRAY['Will', 'Vince', 'Jenny'], 'filled'),
  ('Stage + Tunnel Curator', 'minor', 'Tito', ARRAY['Lyly', 'Kiki', 'Mario', 'Ignacio'], 'filled'),
  ('Bell Tent Curator', 'minor', 'Mario', ARRAY['Vince', 'Estara'], 'filled'),
  ('Movement Space Curator', 'minor', 'Will', ARRAY['Isa'], 'filled'),
  ('Crafts Area Curator', 'minor', 'Pablo', ARRAY['Ben'], 'filled'),
  ('Massage Tent Curator', 'minor', 'Hailey', ARRAY['Jenny'], 'filled'),
  ('Puppets Stage Curator', 'minor', 'Pablo', '{}', 'filled'),
  ('Satellite Camp', 'minor', 'Pablo', ARRAY['Hailey', 'Isa'], 'filled'),
  ('Mobile Playground', 'minor', '', '{}', 'vacant'),
  ('Reception', 'minor', 'Adam', ARRAY['Ben'], 'filled');

-- Spaces
INSERT INTO spaces (name, curators, description) VALUES
  ('Pillow Fort Stage', ARRAY['Tito', 'Lyly', 'Kiki', 'Mario', 'Ignacio'], 'Main performance space for Playground Cabaret'),
  ('Village Sanctuary', ARRAY['Ignacio', 'Will', 'Vince', 'Jenny'], 'Rest and eat together space'),
  ('Bell Tent', ARRAY['Mario', 'Vince', 'Estara'], 'Cozy interior space for workshops and gatherings'),
  ('Movement Space', ARRAY['Will', 'Isa'], 'Open area for dance, embodiment, movement'),
  ('Crafts Area', ARRAY['Pablo', 'Ben'], 'Creative workspace with tables, chairs, glue guns'),
  ('Massage Tent', ARRAY['Hailey', 'Jenny'], 'Space for giving and receiving body work'),
  ('Puppets Stage', ARRAY['Pablo'], 'Puppet and animist play performances'),
  ('Satellite Camp', ARRAY['Pablo', 'Hailey', 'Isa'], 'Extended camp area for puppetry and play'),
  ('Tunnel', ARRAY['Tito', 'Lyly', 'Kiki', 'Mario', 'Ignacio'], 'Fun transition experience from stage into tent'),
  ('Storage', ARRAY['Hailey', 'Maxim'], 'Carport storage at Hailey''s home');

-- Seed some inventory items based on known camp needs
INSERT INTO inventory_items (name, category, qty_needed, sourcing, storage_location, brought_by, status, notes) VALUES
  ('Extension cords (long)', 'power', 4, 'borrow', 'Hailey''s carport', '', 'needed', 'Kiki(2), Estara(2), Pablo(1) have some'),
  ('Extension cords (medium)', 'power', 3, 'borrow', 'Hailey''s carport', '', 'needed', 'Estara has 2, Pablo has 1'),
  ('Roto hammer / drill', 'tools', 2, 'borrow', '', 'Will', 'needed', 'Will has these'),
  ('Pillow covers', 'decor', 20, 'buy', '', '', 'needed', 'For giant pillow fort'),
  ('Large pillows', 'decor', 10, 'borrow', '', '', 'needed', 'For pillow fort seating'),
  ('Craft tables', 'furniture', 4, 'borrow', '', '', 'needed', 'For crafts area'),
  ('Chairs', 'furniture', 10, 'borrow', '', '', 'needed', 'Mix of normal and cozy'),
  ('Glue guns', 'crafts', 4, 'buy', '', '', 'needed', 'For crafts area'),
  ('Generators', 'power', 2, 'borrow', '', 'Tom', 'needed', 'Tom managing these'),
  ('Puppet canvas', 'props', 1, 'already_have', '', 'Pablo', 'needed', 'Grant funded puppet project'),
  ('Massage table', 'furniture', 1, 'borrow', '', '', 'needed', 'For massage tent'),
  ('Camp flag / signage', 'decor', 1, 'buy', '', '', 'needed', 'Mobile Playground flag'),
  ('Laundry basket', 'props', 2, 'already_have', '', '', 'needed', 'For Mobile Playground'),
  ('Sound system', 'equipment', 1, 'borrow', '', '', 'needed', 'For stage area'),
  ('Twinkle lights', 'decor', 200, 'borrow', '', '', 'needed', 'String lights in meters');

-- Seed admin finance entries as sample
INSERT INTO finance_entries (type, category, amount, description, person, status) VALUES
  ('income', 'grant', 1500.00, 'The Playground Grant', 'Maxim', 'confirmed'),
  ('income', 'grant', 800.00, 'Mystic Yoni Grant', 'Maxim', 'confirmed'),
  ('income', 'grant', 600.00, 'Puppet Canvas Grant', 'Pablo', 'confirmed'),
  ('income', 'grant', 400.00, 'Burlesque Grant', 'Kiki', 'confirmed'),
  ('income', 'camp_fee', 500.00, 'Camp fees collected', 'Maxim', 'pending');

-- Activity log initial entry
INSERT INTO activity_log (message, profile_id, entity_type) VALUES
  ('Camp Tracker launched! Let''s get this Playground ready 🌟', (SELECT id FROM profiles WHERE invite_code = 'playground-admin'), 'system');
