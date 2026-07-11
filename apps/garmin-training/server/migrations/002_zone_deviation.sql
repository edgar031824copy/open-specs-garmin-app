alter table plan_sessions
  add column if not exists zone_deviation jsonb;
