# Auth Setup

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Optional: `NEXT_PUBLIC_SITE_URL`

## Recommended Supabase Dashboard Settings

### Authentication
- Enable Email provider
- For local MVP development, disable `Confirm email` if you want immediate sign-in after registration
- If `Confirm email` remains enabled, the app already handles this by:
  - showing a confirmation message after sign-up
  - using `/auth/callback` for confirmation redirects

### URL Configuration
- Site URL:
  - local: `http://localhost:3000`
- Additional redirect URLs:
  - `http://localhost:3000/auth/callback`

### Profiles
- Profile creation is synced automatically by the `handle_new_user()` trigger from the initial SQL migration
- Pass `display_name` through Supabase Auth metadata during sign-up so the trigger can populate `public.profiles`

## Notes

- Protected routes live under `src/app/(app)`
- Public auth routes live under `src/app/(auth)`
- Session refresh is handled in the app proxy/middleware layer
