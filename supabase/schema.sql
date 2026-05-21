-- Run in Supabase Dashboard → SQL Editor

create table if not exists echoes (
  id text primary key,
  user_id text not null,
  user_name text not null,
  user_avatar text not null,
  latitude double precision not null,
  longitude double precision not null,
  place_name text not null,
  description text not null,
  photos jsonb not null default '[]'::jsonb,
  timestamp bigint not null,
  created_at text not null
);

create table if not exists little_world_posts (
  id text primary key,
  text text not null,
  timestamp bigint not null,
  created_at text not null
);

create table if not exists bb_posts (
  id text primary key,
  user_id text not null,
  user_name text not null,
  user_avatar text not null,
  type text not null check (type in ('text', 'screenshot')),
  text text not null,
  screenshot text,
  timestamp bigint not null,
  created_at text not null
);

create index if not exists echoes_timestamp_idx on echoes (timestamp desc);
create index if not exists little_world_timestamp_idx on little_world_posts (timestamp desc);
create index if not exists bb_posts_timestamp_idx on bb_posts (timestamp desc);

-- Storage: create bucket "echo-media" in Dashboard → Storage → New bucket → Public bucket
