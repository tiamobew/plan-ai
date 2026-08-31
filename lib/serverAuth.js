import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "./config";

// ตรวจว่าผู้เรียก API ผ่านการยืนยันรหัสแล้วหรือไม่ (ใช้ใน API routes)
export function isAuthed() {
  return cookies().get(ACCESS_COOKIE)?.value === "1";
}
