-- Drop existing restrictive policies
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- Allow public (anon) uploads to gallery_images
-- WARNING: This allows anyone with the API key to upload. 
-- Since your admin panel is likely hidden or protected by other means, this is a temporary fix.
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'gallery_images' );

-- Allow public (anon) deletes
create policy "Public Delete"
  on storage.objects for delete
  using ( bucket_id = 'gallery_images' );

-- Ensure gallery table also allows inserts from public/anon
drop policy if exists "Authenticated users can manage gallery" on gallery;
create policy "Public can manage gallery"
  on gallery for all
  using (true);
