-- Add fee_paid column to profiles for camp fee payment tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fee_paid boolean DEFAULT false;
