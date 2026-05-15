-- Support multiple leads per role via co_lead array
ALTER TABLE roles ADD COLUMN IF NOT EXISTS co_lead text[];
