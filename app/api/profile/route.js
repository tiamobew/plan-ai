import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/serverAuth";
import { getSupabase } from "@/lib/supabase";

const PROFILE_FIELDS = ["teacher", "subject", "director", "school", "grade"];

function cleanProfile(input = {}) {
  return Object.fromEntries(PROFILE_FIELDS.map((key) => [key, String(input[key] || "").trim()]));
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ profile: null, supabase: false });

  const { data, error } = await supabase
    .from("school_profile")
    .select("teacher, subject, director, school, grade")
    .eq("id", 1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data || null, supabase: true });
}

export async function PUT(request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 400 });

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const profile = cleanProfile(body.profile);
  const { data, error } = await supabase
    .from("school_profile")
    .upsert({ id: 1, ...profile }, { onConflict: "id" })
    .select("teacher, subject, director, school, grade")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
