import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/serverAuth";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ plans: [], supabase: false });

  const { data, error } = await supabase
    .from("plans")
    .select("id, topic, subject, grade, unit, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ plans: data || [], supabase: true });
}

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "ยังไม่ได้ตั้งค่า Supabase — ไม่สามารถบันทึกแผนได้ (แต่ยังพิมพ์/ดาวน์โหลดได้)" },
      { status: 400 }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const plan = body.plan;
  if (!plan) return NextResponse.json({ error: "ไม่มีข้อมูลแผน" }, { status: 400 });

  const { data, error } = await supabase
    .from("plans")
    .insert({
      topic: plan.topic || "",
      subject: plan.subject || "",
      grade: plan.grade || "",
      unit: plan.unit || "",
      data: plan,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
