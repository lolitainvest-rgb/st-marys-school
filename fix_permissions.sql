-- Run this in Supabase SQL Editor to allow the Admin Panel to read messages without full Auth setup.

-- 1. Drop the restrictive policy
drop policy if exists "Authenticated users can manage messages" on messages;

-- 2. Create a new open policy (Warning: This makes messages public to anyone with your API key)
create policy "Public can manage messages" on messages for all using (true);
