-- ═══════════════════════════════════════════════════════════════════════
-- AI Builders Lab — Supabase Schema
--
-- 適用方法: Supabase Dashboard > SQL Editor で全文貼り付けて Run
-- 既存環境への適用も IF NOT EXISTS / OR REPLACE で安全
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. users (会員プロフィール + プラン管理)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  plan text check (plan in ('video-only', 'video-email', 'zoom')),
  stripe_session_id text,
  stripe_customer_id text,
  community_free_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists users_email_idx on public.users (email);


-- ───────────────────────────────────────────────────────────────────────
-- 2. videos (講義動画 - Supabase Storage `videos` bucket を参照)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  week int not null check (week between 1 and 8),
  title text not null,
  description text,
  storage_path text,                       -- 例: 'week01/intro.mp4'
  cloudflare_video_id text,                -- 旧フィールド (互換維持・任意)
  duration_seconds int,                    -- 動画の長さ
  unlocked_at timestamptz,                 -- このタイムスタンプ以降に表示
  plan_required text check (plan_required in ('video-only', 'video-email', 'zoom')),
  sort_order int default 0,                -- 同一週内での並び順
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists videos_week_idx on public.videos (week, sort_order);


-- ───────────────────────────────────────────────────────────────────────
-- 3. video_watches (視聴済み記録)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.video_watches (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  watched_at timestamptz default now(),
  primary key (user_id, video_id)
);

create index if not exists video_watches_user_idx on public.video_watches (user_id);


-- ───────────────────────────────────────────────────────────────────────
-- 4. materials (教材PDF/資料 - Supabase Storage `materials` bucket を参照)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('week', 'phrase', 'reference', 'troubleshooting', 'roadmap', 'glossary', 'template', 'prompt')),
  week int check (week between 1 and 8),  -- category='week' の時に使用
  file_url text not null,                 -- Supabase Storage path 例: 'pdf/Week01.pdf'
  file_size_bytes bigint,
  file_type text default 'application/pdf',
  plan_required text check (plan_required in ('video-only', 'video-email', 'zoom')),
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists materials_category_idx on public.materials (category, sort_order);


-- ───────────────────────────────────────────────────────────────────────
-- 5. announcements (お知らせ)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  important boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists announcements_published_idx on public.announcements (published_at desc);


-- ───────────────────────────────────────────────────────────────────────
-- 6. tickets (サポートチケット)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  subject text not null,
  body text not null,
  status text default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists tickets_user_idx on public.tickets (user_id, created_at desc);
create index if not exists tickets_status_idx on public.tickets (status, created_at desc);


-- ───────────────────────────────────────────────────────────────────────
-- 7. posts / replies (コミュニティ掲示板)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text default 'general',
  title text not null,
  body text not null,
  pinned boolean default false,
  likes_count int default 0,
  created_at timestamptz default now()
);

create index if not exists posts_pinned_created_idx on public.posts (pinned desc, created_at desc);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists replies_post_idx on public.replies (post_id, created_at);


-- ───────────────────────────────────────────────────────────────────────
-- 8. jobs (受発注ボード)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type text check (type in ('request', 'offer')) not null,
  title text not null,
  description text,                         -- 概要・詳細 (アプリが使用)
  budget text,                             -- 予算 (自由入力テキスト 例: '¥50,000')
  duration text,                           -- 期間 (自由入力テキスト 例: '2週間')
  contact text,
  status text default 'open' check (status in ('open', 'closed')),
  created_at timestamptz default now()
);

create index if not exists jobs_status_idx on public.jobs (status, created_at desc);


-- ───────────────────────────────────────────────────────────────────────
-- 9. post_likes / job_interests (いいね / 興味あり)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

create index if not exists post_likes_post_idx on public.post_likes (post_id);

create table if not exists public.job_interests (
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (job_id, user_id)
);

create index if not exists job_interests_job_idx on public.job_interests (job_id);


-- ───────────────────────────────────────────────────────────────────────
-- 10. launch_emails (ローンチ通知の事前メール登録)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.launch_emails (
  email text primary key,
  created_at timestamptz default now()
);


-- ═══════════════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════════════

alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.video_watches enable row level security;
alter table public.materials enable row level security;
alter table public.announcements enable row level security;
alter table public.tickets enable row level security;
alter table public.posts enable row level security;
alter table public.replies enable row level security;
alter table public.jobs enable row level security;
alter table public.post_likes enable row level security;
alter table public.job_interests enable row level security;
alter table public.launch_emails enable row level security;


-- ── users ── 自分のデータのみ閲覧/更新可。サービスロールは全権。
drop policy if exists users_self_select on public.users;
create policy users_self_select on public.users
  for select using (auth.email() = email);

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users
  for update using (auth.email() = email);


-- ── videos ── 認証済みユーザー(plan保有者)のみ閲覧可
drop policy if exists videos_authenticated_select on public.videos;
create policy videos_authenticated_select on public.videos
  for select using (auth.role() = 'authenticated');


-- ── video_watches ── 自分の視聴記録のみ
drop policy if exists video_watches_self on public.video_watches;
create policy video_watches_self on public.video_watches
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ── materials ── 認証済みユーザーは閲覧可、プラン制御はアプリ側で
drop policy if exists materials_authenticated_select on public.materials;
create policy materials_authenticated_select on public.materials
  for select using (auth.role() = 'authenticated');


-- ── announcements ── 全員閲覧可（公開情報）
drop policy if exists announcements_public_select on public.announcements;
create policy announcements_public_select on public.announcements
  for select using (true);


-- ── tickets ── 自分のチケットのみ
drop policy if exists tickets_self on public.tickets;
create policy tickets_self on public.tickets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ── posts / replies ── 認証済みなら全員閲覧/作成可、自分の投稿のみ削除可
drop policy if exists posts_authenticated_select on public.posts;
create policy posts_authenticated_select on public.posts
  for select using (auth.role() = 'authenticated');

drop policy if exists posts_self_insert on public.posts;
create policy posts_self_insert on public.posts
  for insert with check (auth.uid() = user_id);

drop policy if exists posts_self_update on public.posts;
create policy posts_self_update on public.posts
  for update using (auth.uid() = user_id);

drop policy if exists posts_self_delete on public.posts;
create policy posts_self_delete on public.posts
  for delete using (auth.uid() = user_id);

drop policy if exists replies_authenticated_select on public.replies;
create policy replies_authenticated_select on public.replies
  for select using (auth.role() = 'authenticated');

drop policy if exists replies_self_insert on public.replies;
create policy replies_self_insert on public.replies
  for insert with check (auth.uid() = user_id);

drop policy if exists replies_self_delete on public.replies;
create policy replies_self_delete on public.replies
  for delete using (auth.uid() = user_id);


-- ── jobs ── 認証済みなら全員閲覧/作成可、自分の投稿のみ更新/削除可
drop policy if exists jobs_authenticated_select on public.jobs;
create policy jobs_authenticated_select on public.jobs
  for select using (auth.role() = 'authenticated');

drop policy if exists jobs_self_insert on public.jobs;
create policy jobs_self_insert on public.jobs
  for insert with check (auth.uid() = user_id);

drop policy if exists jobs_self_update on public.jobs;
create policy jobs_self_update on public.jobs
  for update using (auth.uid() = user_id);


-- ── post_likes / job_interests ── 認証済みは閲覧可、自分の分のみ追加/削除
drop policy if exists post_likes_authenticated_select on public.post_likes;
create policy post_likes_authenticated_select on public.post_likes
  for select using (auth.role() = 'authenticated');

drop policy if exists post_likes_self_insert on public.post_likes;
create policy post_likes_self_insert on public.post_likes
  for insert with check (auth.uid() = user_id);

drop policy if exists post_likes_self_delete on public.post_likes;
create policy post_likes_self_delete on public.post_likes
  for delete using (auth.uid() = user_id);

drop policy if exists job_interests_authenticated_select on public.job_interests;
create policy job_interests_authenticated_select on public.job_interests
  for select using (auth.role() = 'authenticated');

drop policy if exists job_interests_self_insert on public.job_interests;
create policy job_interests_self_insert on public.job_interests
  for insert with check (auth.uid() = user_id);

drop policy if exists job_interests_self_delete on public.job_interests;
create policy job_interests_self_delete on public.job_interests
  for delete using (auth.uid() = user_id);


-- ── launch_emails ── 匿名含む誰でも事前登録(挿入)のみ可能、閲覧不可
drop policy if exists launch_emails_anon_insert on public.launch_emails;
create policy launch_emails_anon_insert on public.launch_emails
  for insert with check (true);


-- ═══════════════════════════════════════════════════════════════════════
-- Storage Buckets (UI で作成 or SQL で作成)
-- ═══════════════════════════════════════════════════════════════════════
-- 以下は UI から手動作成を推奨:
--
-- 1. Bucket: "videos"     - Private, file size limit 100MB
-- 2. Bucket: "materials"  - Private, file size limit 50MB
--
-- アクセス制御は API route 経由の signed URL のみ
-- (anon key からの直接アクセスはブロック)
-- ═══════════════════════════════════════════════════════════════════════
