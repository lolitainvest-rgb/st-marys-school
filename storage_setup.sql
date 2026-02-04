-- Create a new storage bucket for gallery images
insert into storage.buckets (id, name, public)
values ('gallery_images', 'gallery_images', true)
on conflict (id) do nothing;

-- Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'gallery_images' );

-- Allow authenticated users (admin) to upload images
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'gallery_images' and auth.role() = 'authenticated' );

-- Allow authenticated users (admin) to delete images
create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'gallery_images' and auth.role() = 'authenticated' );
