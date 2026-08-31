-- ============================================================
--  ตารางเก็บแผนการจัดการเรียนรู้
--  วิธีใช้: เปิด Supabase Dashboard > โปรเจกต์ของคุณ > SQL Editor
--           วางโค้ดนี้ทั้งหมด แล้วกด Run
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.plans (
  id          uuid primary key default gen_random_uuid(),
  topic       text,
  subject     text,
  grade       text,
  unit        text,
  data        jsonb not null,          -- เก็บข้อมูลแผนทั้งหมด (11 หัวข้อ)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- อัปเดตเวลา updated_at อัตโนมัติเมื่อมีการแก้ไข
create or replace function public.set_plans_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists trg_plans_updated on public.plans;
create trigger trg_plans_updated
  before update on public.plans
  for each row execute function public.set_plans_updated_at();

-- หมายเหตุด้านความปลอดภัย:
-- แอปนี้เข้าถึง Supabase จากฝั่งเซิร์ฟเวอร์ด้วย service_role key เท่านั้น
-- และมีรหัสเข้าใช้งาน (Access Code) เป็นด่านป้องกันหน้าเว็บอยู่แล้ว
-- จึงเปิด RLS ไว้เพื่อกันการเข้าถึงด้วย anon key จากภายนอก (service_role ข้าม RLS ได้เสมอ)
alter table public.plans enable row level security;

-- โปรเจกต์ Supabase รุ่นใหม่อาจไม่เปิดตารางให้ Data API อัตโนมัติ
-- อนุญาตเฉพาะ backend ที่ใช้ service_role/secret key และปิด client roles อย่างชัดเจน
revoke all on table public.plans from anon, authenticated;
grant select, insert, update, delete on table public.plans to service_role;
