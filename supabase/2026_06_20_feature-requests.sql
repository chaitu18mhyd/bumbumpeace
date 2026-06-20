-- Feature Requests table
create table if not exists public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feature_requests_created_at_idx on public.feature_requests (created_at desc);

create trigger feature_requests_set_updated_at
before update on public.feature_requests
for each row
execute function public.set_updated_at();

alter table public.feature_requests enable row level security;

revoke all on table public.feature_requests from anon;
revoke all on table public.feature_requests from authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.feature_requests to service_role;
