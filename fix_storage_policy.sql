-- 1. Storage Policies (Bucket)
-- Drop potential conflicting policies first
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;
drop policy if exists "Public Upload" on storage.objects;
drop policy if exists "Public Delete" on storage.objects;

-- Re-create Public Upload Policy
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'gallery_images' );

-- Re-create Public Delete Policy
create policy "Public Delete"
  on storage.objects for delete
  using ( bucket_id = 'gallery_images' );


-- 2. Database Policies (Gallery Table)
-- Drop potential conflicting policies first
drop policy if exists "Authenticated users can manage gallery" on gallery;
drop policy if exists "Public can manage gallery" on gallery;

-- Re-create Public Manage Policy
create policy "Public can manage gallery"
  on gallery for all
  using (true);
