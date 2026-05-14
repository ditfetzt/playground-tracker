-- Track member login activity
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
