# Study Workspace MVP

Single-user lecture-based study workspace built with Next.js App Router and Supabase. The app is designed for managing courses, lectures, structured lecture notes, manual local-video review timestamps, lecture materials, lecture tasks, course review, and course-scoped search.

## Project overview

This repository contains a production-oriented MVP for a personal study workflow:

- Sign up, log in, and log out with Supabase Auth
- Create, edit, view, and delete courses
- Create, edit, view, and delete lectures inside courses
- Manage lecture objectives, concepts, examples, timestamps, questions, summary, and understanding score
- Upload lecture materials to Supabase Storage and manage file lifecycle
- Track lecture assignments and action items
- Review course revision status across lectures
- Search inside a course across lecture content

The product is intentionally single-user and ownership-scoped. Every data model is designed around authenticated personal access.

## Tech stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui with Base UI primitives
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Zod for validation

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Required env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` is recommended for auth redirects

### 3. Run the app

```bash
npm run dev
```

App URL:

- `http://localhost:3000`

### 4. Verification commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Supabase setup

### Auth setup

In the Supabase dashboard:

1. Enable the Email auth provider.
2. Set Site URL to `http://localhost:3000` for local development.
3. Add `http://localhost:3000/auth/callback` to Additional Redirect URLs.
4. Decide whether email confirmation should be enabled:
   - If disabled, sign-up can immediately create a session.
   - If enabled, the app shows a confirmation message and uses `/auth/callback`.

More detail:

- `supabase/AUTH_SETUP.md`

### Run migrations

This repo includes SQL migrations under `supabase/migrations`.

Important migrations:

- `20260317143500_foundation.sql`
- `20260317172000_expand_lectures_core.sql`
- `20260317181500_expand_lecture_sections.sql`
- `20260317193000_align_tasks_module.sql`

Apply them in order with the Supabase CLI or SQL editor.

Example with Supabase CLI:

```bash
supabase db push
```

If you are applying manually in the SQL editor, run the files in timestamp order.

Important:

- The task alignment migration renames old task enum values and renames `tasks.due_at` to `tasks.due_date`.
- Run all migrations before testing task, review, and search flows against live data.

### Storage bucket

Bucket name:

- `lecture-materials`

Bucket requirements:

- Private bucket
- Intended only for lecture documents and materials
- Not for video uploads

Expected storage path convention:

- `user_id/course_id/lecture_id/file_name`

The foundation migration attempts to create the bucket and policies. If the bucket does not exist yet, create it manually in the Supabase dashboard and keep it private.

Storage notes:

- The app uses signed open URLs and authenticated downloads
- Duplicate file names inside the same lecture folder are renamed with a numeric suffix
- Delete flow removes the storage object before deleting the metadata row

More detail:

- `supabase/STORAGE_SETUP.md`

## RLS assumptions

This MVP assumes every authenticated user only accesses their own data.

RLS design notes:

- User-owned tables include `user_id` where helpful for direct ownership checks
- Policies restrict access to rows where `auth.uid() = user_id`
- Courses, lectures, structured lecture sections, tasks, materials metadata, and lecture relations are all ownership-scoped
- Storage object policies restrict access by matching the first folder segment to `auth.uid()`

The app also checks ownership in server queries and server actions before mutating data.

## Feature overview

### Auth

- Sign up
- Log in
- Log out
- Protected app shell
- Auth callback handling

### Courses

- Create, edit, delete, and view courses
- Course detail page with lecture creation and task summary

### Lectures

- Create, edit, delete, and view lectures
- Lecture detail workspace with tabs
- Summary and understanding score editing

### Structured lecture sections

- Objectives CRUD
- Concepts CRUD
- Examples CRUD
- Timestamps CRUD
- Questions CRUD

### Materials

- Upload one or more lecture files
- Open and download files
- Delete files from storage and metadata
- Global materials overview page

### Tasks

- Assignment and action item support
- Create, edit, delete, and quick status changes
- Grouped UI inside lecture detail
- Dashboard, course, and tasks-route summaries

### Review

- Course review page with lecture-by-lecture revision signals
- Filters for:
  - low understanding
  - has unfinished tasks
  - has unresolved questions

### Search

- Search within a selected course
- Matches lecture title, topic, summary, concepts, and questions
- Returns lecture-linked contextual snippets

## App flow

1. Create an account or log in.
2. Create a course.
3. Add lectures inside the course.
4. Fill lecture notes and manual timestamps.
5. Upload lecture materials if needed.
6. Add assignments and action items to lectures.
7. Use review to identify weak lectures.
8. Use search to find concepts and unresolved questions quickly.

## Known limitations

- No AI features
- No server-side video upload or hosting
- Timestamps are for manual local video review only
- Search is pragmatic MVP search, not a dedicated full-text or semantic engine
- Live end-to-end verification against a real Supabase project still needs to be performed after migrations are applied

## Handoff notes

- Read `AGENT_PROGRESS.md` for the implementation history and current repo state.
- Apply pending migrations before validating live flows.
- Verify the `lecture-materials` bucket and auth redirect URLs before testing materials and sign-up confirmation flows.
