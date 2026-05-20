-- Add notifications table for persistent activity feed

CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link_to text,
  related_id uuid,
  related_table text,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index for fast unread lookups per recipient
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON notifications(recipient_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS (permissive, following existing app pattern)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "PT notifications select" ON notifications;
CREATE POLICY "PT notifications select" ON notifications FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "PT notifications insert" ON notifications;
CREATE POLICY "PT notifications insert" ON notifications FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "PT notifications update" ON notifications;
CREATE POLICY "PT notifications update" ON notifications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "PT notifications delete" ON notifications;
CREATE POLICY "PT notifications delete" ON notifications FOR DELETE TO anon, authenticated USING (true);
