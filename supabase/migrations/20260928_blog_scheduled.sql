-- Allow admins to schedule a blog post. It stays hidden until published_at.

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'blog_posts'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
  loop
    execute format('alter table public.blog_posts drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.blog_posts
  add constraint blog_posts_status_check
  check (status in ('draft', 'scheduled', 'published'));

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    or (
      status = 'scheduled'
      and published_at is not null
      and published_at <= now()
    )
  );
