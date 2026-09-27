-- Blog categories for bigbidai.com.
-- Existing listing guides land in Auction Tips.

alter table public.blog_posts
  add column if not exists category text;

alter table public.blog_posts drop constraint if exists blog_posts_category_check;

update public.blog_posts
set category = case
  when category in ('pricing', 'photos') then 'product-research'
  when category = 'product-updates' then 'automation-ai'
  when category is null or category in ('listing-workflow', 'auction-operations') then 'auction-tips'
  else category
end;

alter table public.blog_posts
  alter column category set default 'auction-tips';

update public.blog_posts
set category = 'auction-tips'
where category is null;

alter table public.blog_posts
  alter column category set not null;

alter table public.blog_posts
  add constraint blog_posts_category_check
  check (
    category in (
      'auction-tips',
      'product-research',
      'hibid-guides',
      'liquidation',
      'automation-ai'
    )
  );

create index if not exists blog_posts_category_published_at_idx
  on public.blog_posts (category, published_at desc);
