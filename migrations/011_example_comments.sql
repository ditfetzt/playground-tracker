-- Insert example test comments on existing items
-- This uses real item and profile IDs from your database

WITH random_items AS (
  SELECT id, name, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM inventory_items
  LIMIT 5
),
random_profiles AS (
  SELECT id, name, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM profiles
  WHERE active = true
  LIMIT 3
)
INSERT INTO item_comments (item_id, profile_id, content, created_at)
SELECT 
  (SELECT id FROM random_items WHERE rn = 1),
  (SELECT id FROM random_profiles WHERE rn = 1),
  'Hey, I think I know someone who has extra cables we could borrow!',
  now() - interval '2 hours'
UNION ALL
SELECT 
  (SELECT id FROM random_items WHERE rn = 1),
  (SELECT id FROM random_profiles WHERE rn = 2),
  'Nice! Can you connect us? We still need the mixing board though.',
  now() - interval '1 hour'
UNION ALL
SELECT 
  (SELECT id FROM random_items WHERE rn = 2),
  (SELECT id FROM random_profiles WHERE rn = 1),
  'I can source the tarps from my work — they have extras lying around.',
  now() - interval '30 minutes'
UNION ALL
SELECT 
  (SELECT id FROM random_items WHERE rn = 2),
  (SELECT id FROM random_profiles WHERE rn = 3),
  'Awesome, that would save us ~$50! 🙌',
  now() - interval '10 minutes'
UNION ALL
SELECT 
  (SELECT id FROM random_items WHERE rn = 3),
  (SELECT id FROM random_profiles WHERE rn = 2),
  'Has anyone checked if we actually need the extra power strips? I have 4 at home.',
  now() - interval '5 minutes'
ON CONFLICT DO NOTHING;
