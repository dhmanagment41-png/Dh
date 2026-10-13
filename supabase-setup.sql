create table if not exists public.site_content (
    id text primary key check (id = 'main'),
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
    on public.site_content for select
    using (true);

drop policy if exists "Authenticated users can manage site content" on public.site_content;
create policy "Authenticated users can manage site content"
    on public.site_content for all to authenticated
    using (auth.uid() is not null)
    with check (auth.uid() is not null);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 10485760, null)
on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view site images" on storage.objects;
create policy "Public can view site images"
    on storage.objects for select
    using (bucket_id = 'site-images');

drop policy if exists "Authenticated users can upload site images" on storage.objects;
create policy "Authenticated users can upload site images"
    on storage.objects for insert to authenticated
    with check (bucket_id = 'site-images' and auth.uid() is not null);

drop policy if exists "Authenticated users can update site images" on storage.objects;
create policy "Authenticated users can update site images"
    on storage.objects for update to authenticated
    using (bucket_id = 'site-images' and auth.uid() is not null)
    with check (bucket_id = 'site-images' and auth.uid() is not null);

drop policy if exists "Authenticated users can delete site images" on storage.objects;
create policy "Authenticated users can delete site images"
    on storage.objects for delete to authenticated
    using (bucket_id = 'site-images' and auth.uid() is not null);
