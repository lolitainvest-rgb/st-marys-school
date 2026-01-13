-- RUN THIS IN SUPABASE SQL EDITOR TO FIX "FAILED TO ADD" ERRORS

-- 1. DROP EXISTING POLICIES (Both Authenticated AND Public versions to avoid conflicts)

-- News
drop policy if exists "Authenticated users can manage news" on news;
drop policy if exists "Public can manage news" on news;

-- Events
drop policy if exists "Authenticated users can manage events" on events;
drop policy if exists "Public can manage events" on events;

-- Gallery
drop policy if exists "Authenticated users can manage gallery" on gallery;
drop policy if exists "Public can manage gallery" on gallery;

-- Messages
drop policy if exists "Authenticated users can manage messages" on messages;
drop policy if exists "Public can manage messages" on messages;
drop policy if exists "Public can insert messages" on messages; -- Drop the old specific one too if it exists

-- 2. CREATE OPEN POLICIES (FOR DEMO/MVP WITHOUT AUTH)
-- WARNING: This allows anyone with your API key to edit content. 
-- Since your Anon Key is public, this is only for testing/demo purposes.

-- News
create policy "Public can manage news" on news for all using (true);

-- Events
create policy "Public can manage events" on events for all using (true);

-- Gallery
create policy "Public can manage gallery" on gallery for all using (true);

-- Messages (Allow updating status/deleting)
create policy "Public can manage messages" on messages for all using (true);
