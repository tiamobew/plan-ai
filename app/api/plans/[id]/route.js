import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/serverAuth";
import { getSupabase } from "@/lib/supabase";

export async function GET(_request, { params }) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 400 });

  const { data, error } = await supabase
    .from("plans")
    .select("id, data, created_at")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ plan: data.data, id: data.id, created_at: data.created_at });
}

export async function PUT(request, { params }) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 400 });

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  const plan = body.plan;
  if (!plan) return NextResponse.json({ error: "ไม่มีข้อมูลแผน" }, { status: 400 });

  const { error } = await supabase
    .from("plans")
    .update({
      topic: plan.topic || "",
      subject: plan.subject || "",
      grade: plan.grade || "",
      unit: plan.unit || "",
      data: plan,
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, { params }) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 400 });

  const { error } = await supabase.from("plans").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
