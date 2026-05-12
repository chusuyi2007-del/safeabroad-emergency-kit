create table if not exists emergency_kits (
  token text primary key,
  kit jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table emergency_kits enable row level security;

create policy "temporary token read" on emergency_kits
  for select using (true);

create policy "temporary token insert" on emergency_kits
  for insert with check (true);

create policy "temporary token update" on emergency_kits
  for update using (true);

create policy "temporary token delete" on emergency_kits
  for delete using (true);
