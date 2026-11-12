create table if not exists people (
  id text primary key,
  name text not null,
  sort_order int not null default 0
);

create table if not exists daily_stats (
  person_id text not null references people(id) on delete cascade,
  day_key text not null,
  drunkness int not null default 0 check (drunkness between 0 and 10),
  drinks int not null default 0 check (drinks >= 0),
  updated_at timestamptz not null default now(),
  primary key (person_id, day_key)
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references people(id) on delete cascade,
  day_key text not null,
  kind text not null check (kind in ('image', 'video')),
  url text not null,
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists media_person_day_idx on media (person_id, day_key);
create index if not exists daily_stats_day_idx on daily_stats (day_key);

alter table people enable row level security;
alter table daily_stats enable row level security;
alter table media enable row level security;

create policy "people_public_all" on people for all using (true) with check (true);
create policy "stats_public_all" on daily_stats for all using (true) with check (true);
create policy "media_public_all" on media for all using (true) with check (true);

insert into people (id, name, sort_order) values
  ('antoine', 'Antoine', 1),
  ('arthur', 'Arthur', 2),
  ('sergent', 'Sergent', 3),
  ('bilal', 'Bilal', 4),
  ('bruno', 'Bruno', 5),
  ('charli', 'Charli', 6),
  ('mikus', 'Mikus', 7),
  ('jules', 'Jules', 8),
  ('ludo', 'Ludo', 9),
  ('max', 'Max', 10),
  ('ledoc', 'LeDoc', 11)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_storage_public_read"
  on storage.objects for select using (bucket_id = 'media');

create policy "media_storage_public_insert"
  on storage.objects for insert with check (bucket_id = 'media');

create policy "media_storage_public_update"
  on storage.objects for update using (bucket_id = 'media');

create policy "media_storage_public_delete"
  on storage.objects for delete using (bucket_id = 'media');

alter publication supabase_realtime add table daily_stats;
alter publication supabase_realtime add table media;
