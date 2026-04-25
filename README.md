# 🏕️ The Playground 2026 — Camp Tracker

A single-page web app for tracking inventory, finance, roles, volunteer hours, and tickets for **The Playground** theme camp at **Otherworld 2026** (Vancouver Island Regional Burn).

Built with vanilla HTML/CSS/JS + Supabase. No frameworks, no build step.

## Setup

### 1. Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project (name it `playground-tracker`)
3. Go to **SQL Editor** in the Supabase dashboard
4. Open `schema.sql` from this repo and paste it all in → **Run**
5. Go to **Project Settings → API** and copy your:
   - **Project URL**
   - **anon public key**

### 2. Configure the app

Open `index.html` and at the top of the `<script>` section, find:

```js
const CONFIG = {
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  ...
};
```

Replace with your Supabase project URL and anon key.

### 3. Create member profiles

You need to add invite codes for every camp member so they can log in. In the Supabase Table Editor, add rows to `profiles`:

| Column | Value |
|--------|-------|
| name | Member's name |
| emoji | Fun avatar emoji |
| invite_code | A unique secret word (you'll DM this to them) |
| is_admin | true only for you (Maxim) |

Example: `{ "name": "Will", "emoji": "🔧", "invite_code": "tools-daddy-42", "is_admin": false }`

### 4. Deploy

**Option A: GitHub Pages**
1. Create a GitHub repo (e.g. `playground-tracker`)
2. Push `index.html` and `README.md`
3. Go to repo Settings → Pages → deploy from `main`
4. Your app is live at `your-username.github.io/playground-tracker`

**Option B: Netlify**
1. Drag `index.html` onto [netlify.com/app/deploy](https://netlify.com/app/deploy)
2. Done. Instant URL.

### 5. Share

- Share the public URL with the whole camp (they can read everything)
- DM each member their unique invite code so they can edit their roles/items
- You (as admin) can edit everything

## Usage

### Invite Codes

| Person | Code |
|--------|------|
| Maxim (Admin) | `playground-admin` |
| _Kiki_ | _DM from Maxim_ |
| _Will_ | _DM from Maxim_ |
| _..._ | _DM from Maxim_ |

Every member gets a unique code. When they visit the site, they:
1. Click "Enter Code" in the top-right (or see the login prompt)
2. Enter their code
3. Now they can edit items linked to their roles

### Tabs

- **📦 Inventory** — Kanban board: drag items between Needed → Sourcing → Acquired → On-Site
- **💰 Finance** — Ledger, budget bar, income vs expenses
- **👥 Roles** — All camp roles, who's doing what, vacancies
- **🗺️ Spaces** — Camp areas and their readiness
- **⏱️ Hours** — Volunteer hour tracking (12h/person target)
- **🎫 Tickets** — Grant/directed ticket tracking
- **📜 Activity** — Live feed of recent actions

### Inventory Status Flow

```
Needed → Sourcing → Acquired → On-Site ✓
```

Drag cards between columns to update status. Add new items with the form.

### Budget

- Income = grants + camp fees
- Expense = purchases, materials
- Budget bar shows remaining vs spent
- All camp members can see the full picture

## Customization

- **Camp name & theme**: Change the `CONFIG` values in the HTML
- **Event date**: Update the countdown target date
- **Admin code**: Change `playground-admin` to your preferred code

## Tech

- **Frontend**: Vanilla HTML, CSS (custom properties), JavaScript (ES6)
- **Database**: Supabase (PostgreSQL + REST API)
- **Hosting**: GitHub Pages / Netlify (free, static hosting)
- **CDN**: Supabase JS client, Google Fonts (DM Sans + DM Mono)
- **Zero build tools**: No webpack, no npm, no framework
