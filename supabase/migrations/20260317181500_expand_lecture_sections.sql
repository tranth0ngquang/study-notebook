alter table public.lecture_concepts
  add column if not exists title text,
  add column if not exists definition text,
  add column if not exists formula text,
  add column if not exists example text,
  add column if not exists usage_note text;

alter table public.lecture_examples
  add column if not exists title text,
  add column if not exists description text;

alter table public.lecture_timestamps
  add column if not exists time_label text,
  add column if not exists title text;

create index if not exists lecture_concepts_lecture_title_idx
  on public.lecture_concepts (lecture_id, title);

create index if not exists lecture_examples_lecture_title_idx
  on public.lecture_examples (lecture_id, title);

create index if not exists lecture_timestamps_lecture_seconds_idx
  on public.lecture_timestamps (lecture_id, time_seconds);
