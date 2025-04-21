-- Create email subscriptions table
create table email_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table email_subscriptions enable row level security;

create policy "Anyone can subscribe"
  on email_subscriptions for insert
  with check (true);

create policy "Subscribers can manage their preferences"
  on email_subscriptions for update
  using (true)
  with check (true);

-- Create function to update updated_at timestamp
create trigger update_email_subscriptions_updated_at
  before update on email_subscriptions
  for each row
  execute function update_updated_at_column();

-- Create a function to notify about new jobs
create function notify_new_job()
returns trigger as $$
begin
  perform pg_notify(
    'new_job',
    json_build_object(
      'id', NEW.id,
      'title', NEW.title,
      'company', NEW.company,
      'location', NEW.location,
      'location_type', NEW.location_type
    )::text
  );
  return NEW;
end;
$$ language plpgsql;

-- Create trigger for new job notifications
create trigger notify_new_job_trigger
  after insert on jobs
  for each row
  execute function notify_new_job();