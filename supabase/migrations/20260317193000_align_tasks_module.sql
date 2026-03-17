do $$
begin
  if exists (
    select 1
    from pg_enum
    where enumtypid = 'public.task_type'::regtype
      and enumlabel = 'action_item'
  ) then
    alter type public.task_type rename value 'action_item' to 'action';
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from pg_enum
    where enumtypid = 'public.task_status'::regtype
      and enumlabel = 'in_progress'
  ) then
    alter type public.task_status rename value 'in_progress' to 'doing';
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tasks'
      and column_name = 'due_at'
  ) then
    alter table public.tasks rename column due_at to due_date;
  end if;
end
$$;

alter table public.tasks
  alter column due_date type date
  using case
    when due_date is null then null
    else (due_date at time zone 'utc')::date
  end;

drop index if exists public.tasks_due_at_idx;
create index if not exists tasks_due_date_idx on public.tasks (due_date);
