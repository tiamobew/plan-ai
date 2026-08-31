// ค่าคงที่กลางของแอป

export const ACCESS_COOKIE = "plan_ai_auth";

// รหัสเข้าใช้งาน — อ่านจาก env ก่อน ถ้าไม่ตั้งใช้ค่าเริ่มต้น 044357246
export function getAccessCode() {
  return process.env.APP_ACCESS_CODE || "044357246";
}

// โมเดล Gemini ที่ใช้ (เปลี่ยนได้ผ่าน env GEMINI_MODEL)
// ค่าเริ่มต้น = Flash-Lite เพื่อให้ใช้งานผ่าน Free Tier ได้รวดเร็ว
export function getModel() {
  return process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
}

// ตรวจว่าตั้งค่า Supabase ครบหรือยัง
export function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
