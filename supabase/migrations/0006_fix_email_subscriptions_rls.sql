-- Add missing RLS policies for email_subscriptions table
create policy "Anyone can view subscriptions"
  on email_subscriptions for select
  using (true);

create policy "Subscribers can delete their subscriptions"
  on email_subscriptions for delete
  using (true);

-- Enable security by default for new operations
alter table email_subscriptions force row level security;