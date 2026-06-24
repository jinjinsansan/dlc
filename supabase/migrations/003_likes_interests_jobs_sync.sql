-- ═══════════════════════════════════════════════════════════════════════
-- Migration 003: コミュニティ「いいね」・受発注「興味あり」テーブルと
--                jobs カラムをアプリ実装に同期
--
-- 背景:
--   アプリ (community/page.tsx, PostItem.tsx, jobs/page.tsx, JobForm.tsx) は
--     - public.post_likes
--     - public.job_interests
--     - jobs.description / jobs.budget / jobs.duration
--   を参照しているが、schema.sql に未定義だった。
--   これを補完し、新規 Supabase プロジェクトでも再現可能にする。
--
-- 適用方法: Supabase Dashboard > SQL Editor で全文貼り付けて Run
-- 何度実行しても安全 (IF NOT EXISTS / OR REPLACE)
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. post_likes (投稿への「いいね」)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

create index if not exists post_likes_post_idx on public.post_likes (post_id);
create index if not exists post_likes_user_idx on public.post_likes (user_id);

alter table public.post_likes enable row level security;

-- 認証済みなら全件閲覧可（like数集計のため）、自分のいいねのみ追加/削除可
drop policy if exists post_likes_authenticated_select on public.post_likes;
create policy post_likes_authenticated_select on public.post_likes
  for select using (auth.role() = 'authenticated');

drop policy if exists post_likes_self_insert on public.post_likes;
create policy post_likes_self_insert on public.post_likes
  for insert with check (auth.uid() = user_id);

drop policy if exists post_likes_self_delete on public.post_likes;
create policy post_likes_self_delete on public.post_likes
  for delete using (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────────────────
-- 2. job_interests (案件への「興味あり」)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.job_interests (
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (job_id, user_id)
);

create index if not exists job_interests_job_idx on public.job_interests (job_id);
create index if not exists job_interests_user_idx on public.job_interests (user_id);

alter table public.job_interests enable row level security;

drop policy if exists job_interests_authenticated_select on public.job_interests;
create policy job_interests_authenticated_select on public.job_interests
  for select using (auth.role() = 'authenticated');

drop policy if exists job_interests_self_insert on public.job_interests;
create policy job_interests_self_insert on public.job_interests
  for insert with check (auth.uid() = user_id);

drop policy if exists job_interests_self_delete on public.job_interests;
create policy job_interests_self_delete on public.job_interests
  for delete using (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────────────────
-- 3. jobs テーブルのカラムをアプリ実装に同期
--    アプリは description / budget(text) / duration(text) を使用。
--    旧カラム (body / budget_min / budget_max / deadline) は残置 (nullable)。
-- ───────────────────────────────────────────────────────────────────────
alter table public.jobs add column if not exists description text;
alter table public.jobs add column if not exists budget text;
alter table public.jobs add column if not exists duration text;

-- 旧 body カラムが not null 制約付きで残っていると insert が失敗するため緩和。
-- 新規DBには body カラムが無いので、存在する場合のみ実行する。
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'body'
  ) then
    alter table public.jobs alter column body drop not null;
  end if;
end $$;
