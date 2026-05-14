-- Sync all 23 roles from ThePlayground2026RolesHowtoJoinOW2026.html (May 12, 2026)
-- Applied via JS client due to RLS blocking DELETE operations.
-- All rows updated in-place (including duplicates — deduplication handled in frontend via uniqueBy()).
-- 
-- To run directly in Supabase SQL editor, replace the whole table:
--   DELETE FROM roles;
--   Then run the INSERT statements below.

-- ============================================================
-- MAJOR ROLES (12)
-- ============================================================

-- Playground Cabaret         | major  | lead: Kiki       | support: Julia, Tito
-- Admin & Communication      | major  | lead: Pablo & Mario | support: —
-- Set-Up Lead                | major  | lead: Mario      | support: —
-- Take-Down Lead (Leave No Trace) | major | lead: Hailey | support: Pablo
-- Inventory & Finance        | major  | lead: Maxim      | support: —
-- Tools Daddy                | major  | lead: Will       | support: —
-- Power & Generators Lead    | major  | lead: Tom        | support: Ignacio, Ben, Vince, Greg, Gael, JuliaG
-- Camps Mommy (Concierge Lead) | major | lead: Tito Ohep | support: Pablo, Fay, Hannes, Zoe, Sebas, Greg, Gael, JuliaG
-- Workshops & Offerings Logistics | major | lead: Isa    | support: Estara
-- Transportation Logistics   | major  | lead: Fay & Hannes | support: Dani, Ben
-- Sound System               | major  | lead: Ignacio    | support: Sebas
-- Building Lead              | major  | lead: Lyly       | support: Maxim

-- ============================================================
-- MINOR ROLES — SPACE CURATORS (11)
-- ============================================================

-- Village Sanctuary          | minor  | lead: Ignacio    | support: Will, Vince, Jenny
-- Stage + Tunnel Curator     | minor  | lead: Tito       | support: Lyly, Kiki, Mario, Ignacio
-- Bell Tent Curator          | minor  | lead: Vince      | support: Estara, Fay, Gael, Zoe
-- Movement Space Curator     | minor  | lead: Will       | support: Isa, Hannes
-- Crafts Area Curator        | minor  | lead: Pablo      | support: Ben, Juls, JuliaG, Gael, Zoe
-- Massage Tent Curator       | minor  | lead: Hailey     | support: Jenny, JuliaG
-- Puppets Stage Curator      | minor  | lead: Pablo      | support: Gael, Zoe
-- Satellite Camp             | minor  | lead: Pablo      | support: Hailey, Isa
-- Mystic Yoni                | minor  | lead: Juls       | support: —
-- Mobile Playground          | minor  | lead: Estara     | support: Jules
-- Reception                  | minor  | lead: Ben        | support: —

-- ============================================================
-- HIDDEN ROLES (not displayed in UI):
--   Admin & Communication, Inventory & Finance
--   (defined in src/lib/constants.ts: HIDDEN_ROLE_NAMES)
-- ============================================================
