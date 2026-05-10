-- ═══════════════════════════════════════════════════════════════════════
-- Migration 001: videos / materials に sort_order と関連列を追加
--
-- 既存環境で schema.sql を初回適用後にカラムを追加した場合、
-- create table if not exists ではカラム差分が反映されないため
-- 明示的に ALTER TABLE で追加する。
--
-- 適用方法: Supabase Dashboard > SQL Editor で全文貼り付けて Run
-- 何度実行しても安全 (IF NOT EXISTS)
-- ═══════════════════════════════════════════════════════════════════════

-- videos テーブルに不足している可能性のあるカラム
alter table public.videos add column if not exists sort_order int default 0;
alter table public.videos add column if not exists cloudflare_video_id text;
alter table public.videos add column if not exists storage_path text;
alter table public.videos add column if not exists duration_seconds int;
alter table public.videos add column if not exists unlocked_at timestamptz;
alter table public.videos add column if not exists plan_required text;

-- materials テーブルに不足している可能性のあるカラム
alter table public.materials add column if not exists sort_order int default 0;
alter table public.materials add column if not exists file_size_bytes bigint;
alter table public.materials add column if not exists file_type text default 'application/pdf';
alter table public.materials add column if not exists plan_required text;

-- インデックス再作成 (sort_order 含む)
drop index if exists videos_week_idx;
create index if not exists videos_week_idx on public.videos (week, sort_order);

drop index if exists materials_category_idx;
create index if not exists materials_category_idx on public.materials (category, sort_order);
