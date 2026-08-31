import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client ฝั่งเซิร์ฟเวอร์ (ใช้ service_role key)
// คืนค่า null ถ้ายังไม่ได้ตั้งค่า env — เพื่อให้แอปยังใช้สร้าง/พิมพ์แผนได้แม้ไม่มีฐานข้อมูล
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
