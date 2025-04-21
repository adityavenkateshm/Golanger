-- Create profiles table
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  full_name text,
  headline text,
  bio text,
  location text,
  website_url text,
  github_url text,
  linkedin_url text,
  resume_url text,
  experience_years integer,
  preferred_role_types text[] default '{}',
  preferred_locations text[] default '{}',
  skills text[] default '{}',
  golang_experience text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table profiles enable row level security;

-- Allow users to read all profiles
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Since we're using Clerk, we'll disable the auth.uid() check
create policy "Users can update own profile"
  on profiles for update
  using (true);

-- Since we're using Clerk, we'll disable the auth.uid() check
create policy "Users can insert own profile"
  on profiles for insert
  with check (true);

-- Create function to update updated_at timestamp
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();