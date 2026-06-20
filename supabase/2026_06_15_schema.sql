create extension if not exists pgcrypto;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'private' and table_name = 'retirement_cities'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'retirement_cities'
  ) then
    alter table private.retirement_cities set schema public;
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'retirement_cities'
  ) then
    execute 'drop policy if exists "Public read retirement cities" on public.retirement_cities';
    revoke all on table public.retirement_cities from anon;
    revoke all on table public.retirement_cities from authenticated;
  end if;
end;
$$;

create table if not exists public.retirement_cities (
  id uuid primary key default gen_random_uuid(),
  source_id integer not null unique,
  city text not null,
  country text not null,
  region text not null,
  subregion text,
  latitude double precision,
  longitude double precision,
  monthly_cost_usd integer not null,
  lifestyle_label text not null,
  description text not null,
  tags text[] not null default '{}',
  visa_ease_score integer,
  healthcare_score integer,
  safety_score integer,
  climate_score integer,
  expat_community_score integer,
  internet_score integer,
  overall_retirement_score double precision,
  climate_type text,
  language text,
  currency text,
  time_zone text,
  popular_neighborhoods text[] not null default '{}',
  visa_notes text,
  healthcare_notes text,
  best_for text[] not null default '{}',
  avoid_if text[] not null default '{}',
  expense_shares jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint retirement_cities_visa_score_check check (
    visa_ease_score is null or (visa_ease_score between 1 and 10)
  ),
  constraint retirement_cities_healthcare_score_check check (
    healthcare_score is null or (healthcare_score between 1 and 10)
  ),
  constraint retirement_cities_safety_score_check check (
    safety_score is null or (safety_score between 1 and 10)
  ),
  constraint retirement_cities_climate_score_check check (
    climate_score is null or (climate_score between 1 and 10)
  ),
  constraint retirement_cities_expat_score_check check (
    expat_community_score is null or (expat_community_score between 1 and 10)
  ),
  constraint retirement_cities_internet_score_check check (
    internet_score is null or (internet_score between 1 and 10)
  )
);

create index if not exists retirement_cities_region_idx on public.retirement_cities (region);
create index if not exists retirement_cities_lifestyle_idx on public.retirement_cities (lifestyle_label);
create index if not exists retirement_cities_monthly_cost_idx on public.retirement_cities (monthly_cost_usd);
create index if not exists retirement_cities_overall_score_idx on public.retirement_cities (overall_retirement_score desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists retirement_cities_set_updated_at on public.retirement_cities;
create trigger retirement_cities_set_updated_at
before update on public.retirement_cities
for each row
execute function public.set_updated_at();

alter table public.retirement_cities enable row level security;

drop policy if exists "Public read retirement cities" on public.retirement_cities;

revoke all on table public.retirement_cities from anon;
revoke all on table public.retirement_cities from authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.retirement_cities to service_role;
