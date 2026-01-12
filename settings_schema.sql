-- Run this in Supabase SQL Editor

-- 5. SITE SETTINGS TABLE
-- A flexible key-value store for global website configuration
create table if not exists site_settings (
  key text primary key,
  value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Security
alter table site_settings enable row level security;

-- Policies
-- Public can READ everything (needed for the website to show the content)
create policy "Public can view settings" on site_settings for select using (true);

-- Authenticated (Admin) can UPDATE/INSERT
create policy "Authenticated users can manage settings" on site_settings for all using (auth.role() = 'authenticated');

-- TEMPORARY: Allow public write access for demo purposes (so the mock admin login works)
-- You should remove this and use proper Auth later.
create policy "Public can manage settings" on site_settings for all using (true);


-- SEED INITIAL DATA
insert into site_settings (key, value) values
('principal_welcome', 'We are delighted to welcome you to St Mary''s English Medium Primary School. Our school is dedicated to nurturing young minds in a vibrant and culturally grounded environment.\n\nAs we embark on the 2026 academic year, we renew our commitment to excellence ("ONWARD FOREVER ONWARD") and to fostering a community where every child feels valued and inspired to learn.'),
('portal_url', 'https://signalhands.co.bw/myschoolst/site/login')
on conflict (key) do nothing;
