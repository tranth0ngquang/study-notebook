alter table public.lectures
  add column if not exists topic text,
  add column if not exists lecture_number integer,
  add column if not exists lecturer text,
  add column if not exists duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  add column if not exists local_video_label text,
  add column if not exists record_link text,
  add column if not exists slides_link text;

create index if not exists lectures_course_lecture_number_idx
  on public.lectures (course_id, lecture_number);

create index if not exists lectures_course_lecture_date_idx
  on public.lectures (course_id, lecture_date);
