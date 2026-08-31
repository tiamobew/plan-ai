"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="app-gradient min-h-screen" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
        setLoading(false);
        return;
      }
      const next = params.get("next") || "/dashboard";
      router.push(next);
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
      setLoading(false);
    }
  }

  return (
    <main className="app-gradient min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* ฝั่งข้อความแนะนำ */}
        <div className="hidden md:block">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-brand-700 text-sm font-medium shadow-sm">
            ✨ ขับเคลื่อนด้วย Google Gemini AI
          </div>
          <h1 className="mt-5 font-head text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
            ผู้ช่วยเขียน
            <br />
            <span className="text-brand-600">แผนการจัดการเรียนรู้</span>
          </h1>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            กรอกข้อมูลรายวิชาและเรื่องที่จะสอน ระบบจะร่างแผนการสอนครบทั้ง 11 หัวข้อ
            ตั้งแต่มาตรฐาน/ตัวชี้วัด จุดประสงค์ K/P/A กิจกรรมการเรียนรู้
            ไปจนถึงการวัดประเมินผล พร้อมพิมพ์และดาวน์โหลดเป็น Word
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            {[
              "ครบทั้ง 11 หัวข้อ ตามรูปแบบแผนราชการ",
              "แก้ไขทุกช่องได้เองก่อนบันทึก",
              "บันทึกเก็บไว้ เปิดใช้ซ้ำได้ทุกเมื่อ",
              "ดาวน์โหลดเป็นไฟล์ Word / สั่งพิมพ์เป็น PDF",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 text-brand-500">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ฝั่งฟอร์มเข้าสู่ระบบ */}
        <div className="bg-white rounded-3xl shadow-soft p-8 md:p-10">
          <div className="md:hidden mb-6 text-center">
            <h1 className="font-head text-2xl font-bold text-slate-800">
              ผู้ช่วยเขียนแผนการสอน
            </h1>
            <p className="text-slate-500 text-sm mt-1">ขับเคลื่อนด้วย AI</p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-2xl">
            🔐
          </div>
          <h2 className="mt-4 font-head text-2xl font-semibold text-slate-800">
            เข้าสู่ระบบ
          </h2>
          <p className="text-slate-500 mt-1">กรอกรหัสเข้าใช้งานเพื่อเริ่มต้น</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                รหัสเข้าใช้งาน
              </label>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="กรอกรหัส..."
                autoFocus
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg tracking-wider focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 text-red-600 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 text-lg shadow-soft transition"
            >
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-400 text-center">
            ระบบนี้ใช้สำหรับครูผู้สอน · ข้อมูลแผนถูกเก็บอย่างปลอดภัย
          </p>
        </div>
      </div>
    </main>
  );
}
