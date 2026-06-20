-- Add status column to feature_requests
alter table public.feature_requests
  add column if not exists status text not null default 'Requested';

-- Ensure the new column is queryable by service role
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.feature_requests to service_role;
