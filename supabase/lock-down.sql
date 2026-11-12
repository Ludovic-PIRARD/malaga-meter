-- Restrict Malaga Meter to signed-in trip members only.
-- Run once in Supabase → SQL Editor after creating the shared Auth user.

-- Drop open policies
drop policy if exists "people_public_all" on people;
drop policy if exists "stats_public_all" on daily_stats;
drop policy if exists "media_public_all" on media;

drop policy if exists "media_storage_public_read" on storage.objects;
drop policy if exists "media_storage_public_insert" on storage.objects;
drop policy if exists "media_storage_public_update" on storage.objects;
drop policy if exists "media_storage_public_delete" on storage.objects;

-- Authenticated-only table access
create policy "people_auth_select" on people
  for select to authenticated using (true);

create policy "people_auth_write" on people
  for all to authenticated using (true) with check (true);

create policy "stats_auth_all" on daily_stats
  for all to authenticated using (true) with check (true);

create policy "media_auth_all" on media
  for all to authenticated using (true) with check (true);

-- Authenticated-only storage
create policy "media_storage_auth_read"
  on storage.objects for select to authenticated
  using (bucket_id = 'media');

create policy "media_storage_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "media_storage_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "media_storage_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');
