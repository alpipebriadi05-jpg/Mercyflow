# Mercyflow

Mercyflow is a transparency-first platform for meaningful giving.

## Stack
- React 19
- Vite
- Supabase Auth + Postgres
- Vercel
- Lucide icons

## Environment

Set these in Vercel for **Production, Preview, and Development**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use the Supabase **Publishable key** (`sb_publishable_...`). Never put a Supabase secret/service-role key in the frontend.

## Auth

The current MVP supports:
- Email/password sign up
- Email/password sign in
- Persistent sessions
- Sign out
- Supabase Row Level Security

## Launch checklist

1. Configure Supabase Auth Site URL and redirect URLs for the production domain.
2. Configure the two Vercel environment variables.
3. Deploy from `main`.
4. Test sign up, email confirmation, sign in, session persistence, and sign out.
5. Verify RLS policies before enabling real donations.
6. Add payment/blockchain transaction processing only through trusted server-side functions.

## Product principle

Mercyflow should never claim that a donation is verified or delivered unless there is an auditable record supporting that claim.
