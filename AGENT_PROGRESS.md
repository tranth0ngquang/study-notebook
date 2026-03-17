# AGENT_PROGRESS

## Current Phase
- Phase 1: Foundation and Supabase platform setup

## Assessment Date
- 2026-03-17

## What Exists Already
- Project root exists at `E:\APP-BY-ME\app-tom-tat-bai-hoc`
- No application source files detected
- No `package.json`, `next.config.*`, `tsconfig.json`, `tailwind.config.*`, or `src/` / `app/` directories detected
- No `.git` directory detected at the project root
- No Supabase files detected (`supabase/`, migrations, SQL, config)
- No existing UI components, no authentication setup, and no storage integration code

## Current Codebase Summary
- The repository is effectively empty at the provided root path
- This means the MVP must be bootstrapped from scratch rather than extended from an existing implementation
- There is currently no evidence of partial work, architecture decisions, or existing domain model choices to preserve

## What I Will Build Next
- Bootstrap the application foundation from scratch:
  - Next.js App Router with TypeScript and Tailwind CSS
  - `shadcn/ui` initialization and base component primitives
  - Supabase client libraries and environment scaffolding
  - browser/server/middleware Supabase helpers
  - project structure for auth, dashboard, courses, lectures, materials, tasks, review, search, validation, and shared types
- Add organized SQL migrations for:
  - profiles
  - courses
  - lectures
  - lecture_objectives
  - lecture_concepts
  - lecture_examples
  - lecture_timestamps
  - lecture_questions
  - lecture_materials
  - tasks
  - lecture_relations
- Add RLS policy design and storage bucket setup guidance for `lecture-materials`
- Add a basic root layout and placeholder authenticated workspace shell

## Proposed Implementation Phases

### Phase 1: Foundation
- Bootstrap Next.js App Router project
- Configure TypeScript, Tailwind CSS, ESLint, and base app layout
- Install and configure `shadcn/ui`
- Add shared utilities, environment validation, and basic design tokens
- Add `AGENT_PROGRESS.md` update workflow checkpoints

### Phase 2: Supabase Platform Setup
- Add Supabase browser/server clients
- Define database schema and SQL migrations
- Create enums for task types and structured lecture item types where useful
- Add RLS policies for strict per-user ownership
- Add storage bucket setup guidance and path strategy: `user_id/course_id/lecture_id/file_name`

### Phase 3: Auth and Protected Shell
- Implement sign up, log in, and log out
- Add authenticated route protection
- Build app shell with responsive navigation
- Add loading and error handling for auth transitions

### Phase 4: Courses
- Courses CRUD
- Course listing and search
- Empty states and inline validation
- Course detail layout that can host lectures, tasks, and review

### Phase 5: Lectures and Structured Lecture Data
- Lectures CRUD within a course
- Structured lecture sections:
  - objectives
  - concepts
  - examples
  - timestamps
  - questions
  - summary
  - understanding score
- Validation and responsive editing UX

### Phase 6: Tasks
- Assignment and action item management
- Status and due-date capable MVP model if justified by final schema
- Course-level and lecture-level task views if the data model supports both cleanly

### Phase 7: Materials and Storage
- Upload lecture materials to Supabase Storage
- List, open, download, and delete material records
- Keep storage paths scoped to user/course/lecture ownership
- Ensure storage access lines up with data ownership and RLS assumptions

### Phase 8: Course Review
- Build course review page with rollups across lectures and tasks
- Surface understanding score trends and unresolved questions/tasks
- Keep this lightweight and deterministic, with no AI features

### Phase 9: Hardening and Verification
- Add loading, empty, and error states across major pages
- Verify local app startup
- Verify key CRUD flows
- Review schema/index/RLS completeness
- Clean up UX gaps and documentation

## Risks or Blockers
- The repository is empty, so initial setup time is higher than if a base app already existed
- Supabase project credentials are now available, but actual bucket creation and migration execution still need to happen in the Supabase project environment
- Without an existing git repo, change tracking is file-based only unless git is initialized later
- Final storage policy details may depend on whether public or signed URL access is preferred for downloaded materials

## Immediate Build Plan
1. Scaffold the Next.js application and install required dependencies
2. Initialize `shadcn/ui` and shared UI utilities
3. Add Supabase environment handling and browser/server/middleware clients
4. Establish the domain-oriented folder structure and placeholder app shell
5. Author SQL migrations with schema, indexes, RLS, policies, and storage guidance
6. Validate the project boots locally and document results

## Completed In This Phase
- Inspected the provided repository root
- Confirmed the project currently has no application files
- Created initial implementation tracking document
- Defined the execution phases for the MVP

## Files Added/Changed
- `AGENT_PROGRESS.md`

## Database Changes
- None yet

## Commands Run
- `Get-ChildItem -Force`
- `rg --files`
- `git status --short`
- `Get-ChildItem -Force | Format-Table -Auto Name,Mode,Length`
- `Get-ChildItem -Force -Recurse -Depth 2 | Select-Object FullName,Length,Mode | Format-Table -Auto`
- `Get-ChildItem -Force -Recurse -Filter package.json | Select-Object -ExpandProperty FullName`
- `Get-Location`
- `cmd /c dir /a`
- `Test-Path .`

## Remaining Issues
- No source repository contents are present yet
- No dependencies or runtime scripts exist yet
- No database or storage configuration exists yet
