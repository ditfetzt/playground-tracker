-- Item comments for collaborative sourcing
CREATE TABLE IF NOT EXISTS item_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) > 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_item_comments_item_id ON item_comments(item_id);
CREATE INDEX IF NOT EXISTS idx_item_comments_created_at ON item_comments(created_at);

ALTER TABLE item_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON item_comments
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can create comments" ON item_comments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can delete own comments" ON item_comments
  FOR DELETE TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "Admins can delete any comment" ON item_comments
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
