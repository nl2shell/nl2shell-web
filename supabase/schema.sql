-- NL2Shell Web — Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database.

-- Translations: every query → command pair
create table if not exists translations (
  id bigint generated always as identity primary key,
  query text not null,
  command text not null,
  duration_ms integer not null default 0,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

-- Feedback: thumbs up/down + optional corrections
create table if not exists feedback (
  id bigint generated always as identity primary key,
  query text not null,
  command text not null,
  rating text not null check (rating in ('up', 'down')),
  correction text,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

-- Indexes for analytics queries
create index if not exists idx_translations_created on translations (created_at desc);
create index if not exists idx_feedback_created on feedback (created_at desc);
create index if not exists idx_feedback_rating on feedback (rating);

-- Row Level Security (RLS)
alter table translations enable row level security;
alter table feedback enable row level security;

-- Allow inserts from anon key (the web app uses anon key)
create policy "Allow anonymous inserts on translations"
  on translations for insert
  to anon
  with check (true);

create policy "Allow anonymous inserts on feedback"
  on feedback for insert
  to anon
  with check (true);

-- No select/update/delete for anon — only service_role can read data.
-- Use Supabase dashboard or service_role key to query analytics.

-- ── Useful analytics queries ──

-- Daily translation count
-- select date_trunc('day', created_at) as day, count(*) from translations group by 1 order by 1 desc;

-- Feedback summary
-- select rating, count(*) from feedback group by rating;

-- Most common queries
-- select query, count(*) as cnt from translations group by query order by cnt desc limit 20;

-- Corrections for training data
-- select query, command, correction from feedback where rating = 'down' and correction is not null;
