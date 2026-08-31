import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/serverAuth";
import { getSupabase } from "@/lib/supabase";

const PROFILE_FIELDS = ["teacher", "subject", "director", "school", "grade"];
const SELECT_FIELDS = "id, name, teacher, subject, director, school, grade, created_at, updated_at";

function cleanProfile(input = {}) {
  return Object.fromEntries(PROFILE_FIELDS.map((key) => [key, String(input[key] || "").trim()]));
}

function cleanName(value, profile) {
  const entered = String(value || "").trim();
  if (entered) return entered.slice(0, 100);
  return [profile.teacher, profile.subject, profile.grade].filter(Boolean).join(" · ").slice(0, 100) || "ชุดข้อมูลพื้นฐาน";
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAuthed()) return unauthorized();
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ profiles: [], supabase: false });

  const { data, error } = await supabase
    .from("school_profiles")
    .select(SELECT_FIELDS)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profiles: data || [], supabase: true });
}

export async function POST(request) {
  if (!isAuthed()) return unauthorized();
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 400 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 }); }

  const profile = cleanProfile(body.profile);
  const name = cleanName(body.name, profile);
  const { data, error } = await supabase
    .from("school_profiles")
    .insert({ name, ...profile })
    .select(SELECT_FIELDS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data }, { status: 201 });
}

export async function PUT(request) {
  if (!isAuthed()) return unauthorized();
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 400 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 }); }
  if (!body.id) return NextResponse.json({ error: "ไม่พบรหัสชุดข้อมูล" }, { status: 400 });

  const profile = cleanProfile(body.profile);
  const name = cleanName(body.name, profile);
  const { data, error } = await supabase
    .from("school_profiles")
    .update({ name, ...profile })
    .eq("id", body.id)
    .select(SELECT_FIELDS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

export async function DELETE(request) {
  if (!isAuthed()) return unauthorized();
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 400 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ไม่พบรหัสชุดข้อมูล" }, { status: 400 });

  const { error } = await supabase.from("school_profiles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
