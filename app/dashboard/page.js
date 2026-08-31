"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

function fmtDate(s) {
  try {
    return new Date(s).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function DashboardPage() {
  const [plans, setPlans] = useState([]);
  const [supa, setSupa] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((d) => {
        setPlans(d.plans || []);
        setSupa(d.supabase !== false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-gradient min-h-screen">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-head text-3xl font-bold text-slate-800">แผนการสอนของฉัน</h1>
            <p className="text-slate-500 mt-1">รวมแผนการจัดการเรียนรู้ที่บันทึกไว้</p>
          </div>
          <Link href="/create" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold shadow-soft hover:bg-brand-700">
            + สร้างแผนใหม่
          </Link>
        </div>

        {!supa && (
          <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
            ยังไม่ได้เชื่อมต่อฐานข้อมูล Supabase — คุณยังสร้าง/พิมพ์/ดาวน์โหลดแผนได้ แต่จะบันทึกเก็บไว้ไม่ได้
            (ตั้งค่า <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> และ <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> ใน Vercel)
          </div>
        )}

        {loading ? (
          <div className="mt-10 text-center text-slate-400">กำลังโหลด...</div>
        ) : plans.length === 0 ? (
          <div className="mt-10 bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="text-5xl">📄</div>
            <h2 className="mt-3 font-head text-xl font-semibold text-slate-700">ยังไม่มีแผนที่บันทึกไว้</h2>
            <p className="text-slate-500 mt-1">เริ่มต้นสร้างแผนการสอนแรกของคุณด้วย AI ได้เลย</p>
            <Link href="/create" className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">
              ✨ สร้างแผนใหม่
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((p) => (
              <Link
                key={p.id}
                href={`/plan/${p.id}`}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-soft hover:border-brand-300 transition"
              >
                <div className="text-xs text-brand-600 font-medium">{p.subject || "รายวิชา"}</div>
                <h3 className="mt-1 font-head font-semibold text-slate-800 group-hover:text-brand-700 line-clamp-2">
                  {p.topic || "(ไม่มีชื่อเรื่อง)"}
                </h3>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{p.grade || ""}</span>
                  <span>{fmtDate(p.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
