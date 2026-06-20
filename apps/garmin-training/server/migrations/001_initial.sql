create table if not exists plan_sessions (
  id serial primary key,
  week text not null,
  week_day text not null,
  session_date date not null,
  training text not null,
  is_flexible boolean default false,
  alignment_status text check (alignment_status in ('aligned', 'not_aligned', 'missed', 'upcoming')) default 'upcoming',
  actual_distance numeric(5,2),
  actual_pace text,
  deviation_reason text,
  created_at timestamptz default now()
);

create table if not exists plan_modifications (
  id serial primary key,
  session_date date not null unique,
  original_training text not null,
  suggested_training text not null,
  reason text,
  accepted_at timestamptz default now()
);
