-- ═══════════════════════════════════════════════════════════════════════
-- Migration 002: materials テーブルの欠損カラムを完全補完
--
-- 古いスキーマで作成された materials テーブルに不足しているカラムを追加。
-- 何度実行しても安全 (IF NOT EXISTS)。
-- ═══════════════════════════════════════════════════════════════════════

alter table public.materials add column if not exists description text;
alter table public.materials add column if not exists category text;
alter table public.materials add column if not exists week int;
alter table public.materials add column if not exists file_url text;
alter table public.materials add column if not exists file_size_bytes bigint;
alter table public.materials add column if not exists file_type text default 'application/pdf';
alter table public.materials add column if not exists plan_required text;
alter table public.materials add column if not exists sort_order int default 0;
