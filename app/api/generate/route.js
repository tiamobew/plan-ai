import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/serverAuth";
import { generatePlan } from "@/lib/gemini";

export const maxDuration = 60; // ให้เวลาสร้างแผนได้นานขึ้น (Vercel)

export async function POST(request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
  }

  let form = {};
  try {
    form = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  if (!form.topic || !form.subject) {
    return NextResponse.json(
      { error: "กรุณากรอกอย่างน้อย: กลุ่มสาระ และ เรื่องที่จะสอน" },
      { status: 400 }
    );
  }

  try {
    const plan = await generatePlan(form);
    return NextResponse.json({ plan });
  } catch (err) {
    if (err.code === "NO_API_KEY") {
      return NextResponse.json(
        { error: "ระบบยังไม่ได้ตั้งค่า GEMINI_API_KEY — โปรดตั้งค่าใน Vercel ก่อนใช้งาน" },
        { status: 500 }
      );
    }
    const status = err?.status || 500;
    const msg =
      status === 401
        ? "API key ของ Gemini ไม่ถูกต้อง"
        : status === 429
        ? "เรียกใช้งาน AI บ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่"
        : "เกิดข้อผิดพลาดในการสร้างแผน: " + (err?.message || "ไม่ทราบสาเหตุ");
    return NextResponse.json({ error: msg }, { status: status === 401 ? 401 : 500 });
  }
}
