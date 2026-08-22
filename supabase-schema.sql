-- Esquema sugerido para sincronizar BurgerShot entre iPhone, PC y otros dispositivos.
create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.worker_entries (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers(id) on delete cascade,
  entry_type text not null check (entry_type in ('invoice','tip')),
  amount numeric not null default 0,
  position integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.convenios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  benefit text not null,
  created_at timestamptz not null default now()
);

alter table public.workers enable row level security;
alter table public.worker_entries enable row level security;
alter table public.convenios enable row level security;

-- Para producción, sustituye estas políticas abiertas por autenticación de jefes.
create policy "authenticated workers read" on public.workers for select to authenticated using (true);
create policy "authenticated workers write" on public.workers for all to authenticated using (true) with check (true);
create policy "authenticated entries read" on public.worker_entries for select to authenticated using (true);
create policy "authenticated entries write" on public.worker_entries for all to authenticated using (true) with check (true);
create policy "authenticated convenios read" on public.convenios for select to authenticated using (true);
create policy "authenticated convenios write" on public.convenios for all to authenticated using (true) with check (true);
