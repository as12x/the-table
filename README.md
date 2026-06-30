# The Table

A small private communication platform for a trusted group. It uses plain HTML, CSS, JavaScript, Supabase for auth/messages, and Vercel for hosting.

## Files

- `index.html` - app layout
- `styles.css` - responsive Discord-style interface
- `app.js` - Supabase auth, channels, realtime messages
- `config.js` - local Supabase settings
- `supabase/schema.sql` - database table, row level security, realtime setup
- `vercel.json` - static Vercel config

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Go to Authentication > Providers and enable Email.
4. Add your email to the private allowlist:

```sql
insert into public.member_emails (email, role)
values ('you@example.com', 'owner')
on conflict (email) do update set role = excluded.role;
```

5. Go to Authentication > URL Configuration and add your Vercel domain after deploy.
6. Copy your project URL and anon public key into Vercel environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SITE_URL`

For local-only testing, you can also put those public values in `config.js`.

## Local Preview

Use any static server from this folder. With Node installed:

```bash
npx serve .
```

## Vercel Launch

1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SITE_URL` in Project Settings > Environment Variables.
4. Deploy. No build command is required.
5. Add the Vercel URL to Supabase Authentication > URL Configuration.

For a private group, add each allowed email to `public.member_emails` before inviting them.
