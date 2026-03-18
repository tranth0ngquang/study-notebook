# AGENT_PROGRESS

## Current Phase
- Phase 14: Materials upload body-limit hardening completed

## Assessment Date
- 2026-03-17

## What Exists Already
- Next.js App Router project with TypeScript, Tailwind CSS v4, ESLint, and `shadcn/ui`
- Supabase Auth with protected app shell, sign up, log in, log out, and session proxy
- Dashboard with recent courses, recent lectures, and upcoming tasks summaries
- Course CRUD with authenticated ownership enforcement
- Lecture CRUD with course-scoped lecture list and lecture detail shell
- Structured lecture section CRUD for:
  - objectives
  - concepts
  - examples
  - timestamps
  - questions
  - summary
  - understanding score
- Lecture materials upload inside lecture detail
- Verified local checks:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`

## Current Codebase Summary
- The app is now a usable single-user study workspace foundation with auth, courses, lectures, structured lecture notes, lecture materials, and lecture task management
- Ownership is enforced through authenticated queries plus RLS-backed tables and private storage design
- Materials are stored in Supabase Storage and tracked in `lecture_materials`
- Tasks are now integrated into lecture detail, dashboard, course detail, and the dedicated tasks route
- Course review and course-scoped search are implemented for revision workflows
- Global lecture and materials index pages now exist for smoother workspace navigation
- Handoff documentation is now in `README.md`

## What I Will Build Next
- No new feature phase is active
- The app is back in post-polish verification and handoff state
- Any next work should come from runtime issues or further UX feedback

## Risks or Blockers
- Sign-up confirmation behavior still depends on Supabase Auth dashboard settings
- End-to-end flows against the live Supabase project were not executed automatically to avoid mutating user auth/data/storage from the agent
- `bootstrap-tmp/` still exists in the workspace because deletion was blocked by policy, but it is ignored by lint and does not affect the app
- The new tasks phase depends on applying the compatibility migration that aligns task enum values and renames `due_at` to `due_date`
- Search will use pragmatic multi-query matching in Supabase for the MVP rather than a dedicated full-text engine
- Final live verification still depends on connecting the current repo state to a real migrated Supabase project

## Immediate Build Plan
1. Materials upload body-limit hardening is complete
2. Local verification is complete
3. Next work depends on fresh product feedback or deployment/runtime findings

## Completed In This Phase
- Bootstrapped the project foundation
- Added Supabase clients, auth, protected shell, and setup docs
- Added SQL migrations for the base schema, RLS, storage setup, lecture core fields, and lecture section fields
- Implemented course CRUD and dashboard summaries
- Implemented lecture core CRUD and lecture detail shell
- Implemented lecture section CRUDs for objectives, concepts, examples, timestamps, and questions
- Implemented lecture materials lifecycle:
  - multi-file upload
  - duplicate filename renaming with numeric suffixes
  - metadata persistence in `lecture_materials`
  - materials list in lecture detail
  - open via signed redirect route
  - download via server route
  - delete from storage and metadata
- Implemented tasks lifecycle:
  - task schema alignment migration for enum values and due-date naming
  - task queries and server actions
  - lecture-level task create, edit, delete, and quick status changes
  - grouped assignment and action-item UI inside lecture detail
  - overdue highlighting and task status badges
  - dashboard, course, and dedicated tasks-route summaries
- Implemented review and search:
  - course review route with lecture summaries, understanding score, unresolved question counts, and unfinished task counts
  - review filters for low understanding, unfinished tasks, and unresolved questions
  - course-scoped search across lecture title, topic, summary, concepts, and questions
  - lecture-linked search results with field labels and matching snippets
  - loading and empty states for review and search routes
- Performed final polish and hardening:
  - replaced scaffold-era copy across the landing page, auth layout, shell, loading, not-found, and error states
  - replaced placeholder `/lectures` and `/materials` routes with real workspace summary pages
  - added protected-route error handling and additional loading states
  - aligned auth forms with shared input components
  - removed the unused `SectionPlaceholder` helper
  - updated README for project handoff, setup, migrations, storage, and limitations
- Added UX messaging that timestamps are for local video review only and materials upload excludes video files
- Updated storage docs with manual bucket fallback and file lifecycle notes
- Improved lecture section item cards so saved rows are visually distinct from create forms
- Removed exposed sort-order inputs from lecture section create UIs and now assign sort order server-side where appropriate
- Increased the global typography scale and control sizing across the app shell, inputs, textareas, buttons, and tabs for better readability
- Refreshed saved lecture-section items with stronger colored card treatments so existing data is visually distinct from create forms across objectives, concepts, examples, timestamps, and questions
- Converted saved lecture-section items into compact accordion rows with summary headers for objectives, concepts, examples, timestamps, and questions
- Reworked lecture materials upload to send files directly from the browser to Supabase Storage so large PDFs no longer hit the Next.js Server Action 1 MB body limit
- Verified with:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`

## Files Added/Changed
- `AGENT_PROGRESS.md`
- `.env.example`
- `.env.local`
- `src/proxy.ts`
- `src/lib/env.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/auth/actions.ts`
- `src/lib/auth/types.ts`
- `src/lib/courses/actions.ts`
- `src/lib/courses/queries.ts`
- `src/lib/courses/types.ts`
- `src/lib/lectures/actions.ts`
- `src/lib/lectures/queries.ts`
- `src/lib/lectures/types.ts`
- `src/lib/lecture-sections/actions.ts`
- `src/lib/lecture-sections/queries.ts`
- `src/lib/lecture-sections/types.ts`
- `src/lib/materials/actions.ts`
- `src/lib/materials/queries.ts`
- `src/lib/materials/shared.ts`
- `src/lib/materials/storage.ts`
- `src/lib/materials/types.ts`
- `src/lib/tasks/actions.ts`
- `src/lib/tasks/queries.ts`
- `src/lib/tasks/types.ts`
- `src/lib/tasks/utils.ts`
- `src/lib/review/queries.ts`
- `src/lib/search/queries.ts`
- `src/lib/lectures/overview.ts`
- `src/types/database.ts`
- `src/types/domain.ts`
- `src/validation/auth.ts`
- `src/validation/courses.ts`
- `src/validation/lectures.ts`
- `src/validation/materials.ts`
- `src/validation/tasks.ts`
- `src/app/(auth)/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/(app)/layout.tsx`
- `src/app/(app)/error.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/dashboard/loading.tsx`
- `src/app/(app)/courses/page.tsx`
- `src/app/(app)/courses/loading.tsx`
- `src/app/(app)/courses/[courseId]/page.tsx`
- `src/app/(app)/courses/[courseId]/loading.tsx`
- `src/app/(app)/courses/[courseId]/lectures/page.tsx`
- `src/app/(app)/courses/[courseId]/lectures/[lectureId]/page.tsx`
- `src/app/(app)/courses/[courseId]/lectures/[lectureId]/loading.tsx`
- `src/app/(app)/lectures/page.tsx`
- `src/app/(app)/lectures/loading.tsx`
- `src/app/(app)/materials/page.tsx`
- `src/app/(app)/materials/loading.tsx`
- `src/app/(app)/tasks/page.tsx`
- `src/app/(app)/tasks/loading.tsx`
- `src/app/(app)/review/page.tsx`
- `src/app/(app)/review/loading.tsx`
- `src/app/(app)/search/page.tsx`
- `src/app/(app)/search/loading.tsx`
- `src/app/api/materials/[materialId]/open/route.ts`
- `src/app/api/materials/[materialId]/download/route.ts`
- `src/app/auth/callback/route.ts`
- `src/components/auth/*`
- `src/components/courses/*`
- `src/components/lectures/*`
- `src/components/lecture-sections/*`
- `src/components/materials/*`
- `src/components/tasks/*`
- `src/components/layout/*`
- `src/components/ui/*`
- `src/components/ui/accordion.tsx`
- `README.md`
- `supabase/AUTH_SETUP.md`
- `supabase/STORAGE_SETUP.md`
- `supabase/migrations/20260317143500_foundation.sql`
- `supabase/migrations/20260317172000_expand_lectures_core.sql`
- `supabase/migrations/20260317181500_expand_lecture_sections.sql`
- `supabase/migrations/20260317193000_align_tasks_module.sql`

## Database Changes
- Base schema migration with:
  - `profiles`
  - `courses`
  - `lectures`
  - `lecture_objectives`
  - `lecture_concepts`
  - `lecture_examples`
  - `lecture_timestamps`
  - `lecture_questions`
  - `lecture_materials`
  - `tasks`
  - `lecture_relations`
- RLS and ownership policies across user-owned tables
- Private storage bucket and storage policies for `lecture-materials`
- Lecture core schema expansion for:
  - `topic`
  - `lecture_number`
  - `lecturer`
  - `duration_minutes`
  - `local_video_label`
  - `record_link`
  - `slides_link`
- Lecture section schema expansion for:
  - concept fields: `title`, `definition`, `formula`, `example`, `usage_note`
  - example fields: `title`, `description`
  - timestamp fields: `time_label`, `title`
- Task schema alignment migration for:
  - `task_type`: `action_item` -> `action`
  - `task_status`: `in_progress` -> `doing`
  - `tasks.due_at` -> `tasks.due_date`
  - `tasks_due_date_idx` on `due_date`

## Storage Notes
- Bucket: `lecture-materials`
- Path convention: `user_id/course_id/lecture_id/file_name`
- Bucket is private
- If the foundation migration has not been applied yet, create the bucket manually and keep it private
- Duplicate filenames inside a lecture folder are renamed with numeric suffixes before metadata insert
- Delete flow removes the storage object first, then deletes the metadata row
- Materials upload intentionally rejects video files

## Commands Run
- `npx create-next-app@latest bootstrap-tmp --ts --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*" --yes`
- `robocopy bootstrap-tmp . /E /XD bootstrap-tmp\\.git bootstrap-tmp\\.next bootstrap-tmp\\node_modules /XF bootstrap-tmp\\package-lock.json /NFL /NDL /NJH /NJS /NC /NS`
- `npx shadcn@latest init -d`
- `npx shadcn@latest add card input textarea badge separator`
- `npx shadcn@latest add tabs`
- `npx shadcn@latest add select`
- `npm install @supabase/supabase-js @supabase/ssr zod`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Remaining Issues
- End-to-end auth, course, lecture, lecture-section, materials, task, review, and search flows were not executed against the live Supabase project from the agent to avoid mutating real user data/storage automatically
- The new tasks phase requires running `supabase/migrations/20260317193000_align_tasks_module.sql` before using task CRUD against the live database
- The MVP now depends on final live Supabase verification rather than further local feature work
- Typography has been increased globally, but final tuning can still be adjusted after real-device review if specific screens need even larger text
- The lecture workspace now uses more vivid saved-item colors; any further tuning should focus on preferred saturation level rather than basic differentiation
- Large material uploads now bypass the Server Action body limit, but final live verification should still confirm the Supabase bucket policies and browser upload experience in production
