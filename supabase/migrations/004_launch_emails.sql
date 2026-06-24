-- ═══════════════════════════════════════════════════════════════════════
-- Migration 004: launch_emails（ローンチ通知の事前メール登録）
--
-- 準備中ページ / launch ファネルの EmailForm が参照するテーブル。
-- 公開LP（匿名ユーザー / anon key）からの挿入を許可し、閲覧は
-- サービスロールのみに制限する。
--
-- 適用方法: Supabase Dashboard > SQL Editor で全文貼り付けて Run
-- 何度実行しても安全。
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.launch_emails (
  email text primary key,
  created_at timestamptz default now()
);

alter table public.launch_emails enable row level security;

-- 匿名含む誰でも事前登録（挿入）のみ可能。閲覧・更新・削除は不可
-- （サービスロールは RLS をバイパスするため管理側からは全件取得できる）。
drop policy if exists launch_emails_anon_insert on public.launch_emails;
create policy launch_emails_anon_insert on public.launch_emails
  for insert with check (true);
