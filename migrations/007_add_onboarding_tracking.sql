-- Onboarding tracking and builder bypass
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bypass_onboarding boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_dismissed_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;
