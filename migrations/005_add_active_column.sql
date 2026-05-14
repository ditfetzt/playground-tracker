-- Add active column to profiles for soft-delete support
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
