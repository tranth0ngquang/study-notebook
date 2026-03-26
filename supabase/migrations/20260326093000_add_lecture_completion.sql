alter table public.lectures
  add column if not exists is_completed boolean not null default false,
  add column if not exists completed_at timestamptz;

create index if not exists lectures_is_completed_idx
  on public.lectures (user_id, course_id, is_completed);
