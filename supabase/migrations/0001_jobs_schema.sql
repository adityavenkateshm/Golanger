-- Create jobs table
create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  company_logo text,
  location text not null,
  location_type text not null check (location_type in ('remote', 'onsite', 'hybrid')),
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  description text not null,
  requirements text[] default '{}',
  role_type text not null check (role_type in ('full-time', 'part-time', 'contract')),
  experience_level text not null check (experience_level in ('entry', 'mid', 'senior', 'lead')),
  posted_date timestamp with time zone default now(),
  application_url text,
  go_version text,
  tech_stack text[] default '{}',
  status text not null default 'active' check (status in ('active', 'filled', 'expired')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add a constraint to ensure salary_max is greater than salary_min if both are provided
alter table jobs
  add constraint salary_range_check
  check (
    (salary_min is null and salary_max is null) or
    (salary_min is not null and salary_max is not null and salary_max >= salary_min)
  );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_jobs_updated_at
  before update on jobs
  for each row
  execute function update_updated_at_column();

-- Add text search capabilities
alter table jobs
  add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(company, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;

create index jobs_search_idx on jobs using gin(search_vector);

-- Add RLS policies
alter table jobs enable row level security;

create policy "Jobs are viewable by everyone"
  on jobs for select
  using (true);

create policy "Anyone can create a job"
  on jobs for insert
  with check (true);

create policy "Only the system can update jobs"
  on jobs for update
  using (false);

-- Create API views
create view active_jobs as
select *
from jobs
where status = 'active'
order by posted_date desc;