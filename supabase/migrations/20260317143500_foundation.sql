create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_type') then
    create type public.task_type as enum ('assignment', 'action_item');
  end if;

  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum ('todo', 'in_progress', 'done');
  end if;

  if not exists (select 1 from pg_type where typname = 'lecture_relation_type') then
    create type public.lecture_relation_type as enum ('prerequisite', 'related', 'follow_up');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  code text,
  instructor text,
  term text,
  color text,
  description text,
  archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  lecture_date date,
  video_path text,
  summary text,
  understanding_score smallint check (understanding_score between 1 and 5),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lecture_objectives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lecture_id uuid not null references public.lectures (id) on delete cascade,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lecture_concepts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lecture_id uuid not null references public.lectures (id) on delete cascade,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lecture_examples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lecture_id uuid not null references public.lectures (id) on delete cascade,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lecture_timestamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lecture_id uuid not null references public.lectures (id) on delete cascade,
  label text not null,
  time_seconds integer not null check (time_seconds >= 0),
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lecture_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lecture_id uuid not null references public.lectures (id) on delete cascade,
  content text not null,
  is_resolved boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lecture_materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  lecture_id uuid not null references public.lectures (id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  mime_type text,
  file_size bigint check (file_size is null or file_size >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  lecture_id uuid references public.lectures (id) on delete set null,
  type public.task_type not null,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lecture_relations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_lecture_id uuid not null references public.lectures (id) on delete cascade,
  target_lecture_id uuid not null references public.lectures (id) on delete cascade,
  relation_type public.lecture_relation_type not null,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint lecture_relations_no_self_reference
    check (source_lecture_id <> target_lecture_id),
  constraint lecture_relations_unique
    unique (source_lecture_id, target_lecture_id, relation_type)
);

create index if not exists courses_user_id_idx on public.courses (user_id);
create index if not exists courses_user_title_idx on public.courses (user_id, title);
create index if not exists courses_title_trgm_idx on public.courses using gin (title gin_trgm_ops);

create index if not exists lectures_user_id_idx on public.lectures (user_id);
create index if not exists lectures_course_id_idx on public.lectures (course_id);
create index if not exists lectures_course_sort_idx on public.lectures (course_id, sort_order);
create index if not exists lectures_title_trgm_idx on public.lectures using gin (title gin_trgm_ops);

create index if not exists lecture_objectives_lecture_sort_idx on public.lecture_objectives (lecture_id, sort_order);
create index if not exists lecture_concepts_lecture_sort_idx on public.lecture_concepts (lecture_id, sort_order);
create index if not exists lecture_examples_lecture_sort_idx on public.lecture_examples (lecture_id, sort_order);
create index if not exists lecture_timestamps_lecture_sort_idx on public.lecture_timestamps (lecture_id, sort_order);
create index if not exists lecture_questions_lecture_sort_idx on public.lecture_questions (lecture_id, sort_order);

create index if not exists lecture_materials_user_id_idx on public.lecture_materials (user_id);
create index if not exists lecture_materials_lecture_id_idx on public.lecture_materials (lecture_id);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_course_id_idx on public.tasks (course_id);
create index if not exists tasks_lecture_id_idx on public.tasks (lecture_id);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_due_at_idx on public.tasks (due_at);

create index if not exists lecture_relations_source_idx on public.lecture_relations (source_lecture_id);
create index if not exists lecture_relations_target_idx on public.lecture_relations (target_lecture_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists set_lectures_updated_at on public.lectures;
create trigger set_lectures_updated_at
  before update on public.lectures
  for each row execute function public.set_updated_at();

drop trigger if exists set_lecture_objectives_updated_at on public.lecture_objectives;
create trigger set_lecture_objectives_updated_at
  before update on public.lecture_objectives
  for each row execute function public.set_updated_at();

drop trigger if exists set_lecture_concepts_updated_at on public.lecture_concepts;
create trigger set_lecture_concepts_updated_at
  before update on public.lecture_concepts
  for each row execute function public.set_updated_at();

drop trigger if exists set_lecture_examples_updated_at on public.lecture_examples;
create trigger set_lecture_examples_updated_at
  before update on public.lecture_examples
  for each row execute function public.set_updated_at();

drop trigger if exists set_lecture_timestamps_updated_at on public.lecture_timestamps;
create trigger set_lecture_timestamps_updated_at
  before update on public.lecture_timestamps
  for each row execute function public.set_updated_at();

drop trigger if exists set_lecture_questions_updated_at on public.lecture_questions;
create trigger set_lecture_questions_updated_at
  before update on public.lecture_questions
  for each row execute function public.set_updated_at();

drop trigger if exists set_lecture_materials_updated_at on public.lecture_materials;
create trigger set_lecture_materials_updated_at
  before update on public.lecture_materials
  for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lectures enable row level security;
alter table public.lecture_objectives enable row level security;
alter table public.lecture_concepts enable row level security;
alter table public.lecture_examples enable row level security;
alter table public.lecture_timestamps enable row level security;
alter table public.lecture_questions enable row level security;
alter table public.lecture_materials enable row level security;
alter table public.tasks enable row level security;
alter table public.lecture_relations enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "courses_manage_own" on public.courses;
create policy "courses_manage_own"
  on public.courses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lectures_manage_own" on public.lectures;
create policy "lectures_manage_own"
  on public.lectures
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lecture_objectives_manage_own" on public.lecture_objectives;
create policy "lecture_objectives_manage_own"
  on public.lecture_objectives
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lecture_concepts_manage_own" on public.lecture_concepts;
create policy "lecture_concepts_manage_own"
  on public.lecture_concepts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lecture_examples_manage_own" on public.lecture_examples;
create policy "lecture_examples_manage_own"
  on public.lecture_examples
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lecture_timestamps_manage_own" on public.lecture_timestamps;
create policy "lecture_timestamps_manage_own"
  on public.lecture_timestamps
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lecture_questions_manage_own" on public.lecture_questions;
create policy "lecture_questions_manage_own"
  on public.lecture_questions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lecture_materials_manage_own" on public.lecture_materials;
create policy "lecture_materials_manage_own"
  on public.lecture_materials
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tasks_manage_own" on public.tasks;
create policy "tasks_manage_own"
  on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lecture_relations_manage_own" on public.lecture_relations;
create policy "lecture_relations_manage_own"
  on public.lecture_relations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit)
values ('lecture-materials', 'lecture-materials', false, 104857600)
on conflict (id) do nothing;

drop policy if exists "lecture_materials_storage_select_own" on storage.objects;
create policy "lecture_materials_storage_select_own"
  on storage.objects
  for select
  using (
    bucket_id = 'lecture-materials'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "lecture_materials_storage_insert_own" on storage.objects;
create policy "lecture_materials_storage_insert_own"
  on storage.objects
  for insert
  with check (
    bucket_id = 'lecture-materials'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "lecture_materials_storage_update_own" on storage.objects;
create policy "lecture_materials_storage_update_own"
  on storage.objects
  for update
  using (
    bucket_id = 'lecture-materials'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'lecture-materials'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "lecture_materials_storage_delete_own" on storage.objects;
create policy "lecture_materials_storage_delete_own"
  on storage.objects
  for delete
  using (
    bucket_id = 'lecture-materials'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
