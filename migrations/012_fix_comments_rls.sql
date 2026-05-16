-- Fix RLS for invite-code auth (no Supabase Auth session)
-- The app uses anon key + client-side permissions, so RLS needs to be permissive

ALTER TABLE item_comments DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read comments" ON item_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON item_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON item_comments;
DROP POLICY IF EXISTS "Admins can delete any comment" ON item_comments;
