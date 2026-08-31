"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import PlanEditor from "@/components/PlanEditor";
import PlanDocument from "@/components/PlanDocument";
import ProfilePresetPicker from "@/components/ProfilePresetPicker";
import { downloadWord } from "@/lib/exportDoc";
import { formatThaiDate } from "@/lib/thaiDate";

const EMPTY_FORM = {
  planNumber: "1",
  school: "",
  teacher: "",
  director: "",
  subject: "",
  grade: "",
  teachingDate: new Date().toISOString().slice(0, 10),
  unit: "",
  topic: "",
  timeText: "1 ชั่วโมง",
  teachingModel: "",
  standard: "",
  notes: "",
};

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("edit");

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const input =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-[15px] focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none";

  async function generate(e) {
    e?.preventDefault();
    setError("");
    if (!form.subject || !form.topic) {
      setError("กรุณากรอกอย่างน้อย: กลุ่มสาระการเรียนรู้ และ เรื่องที่จะสอน");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "สร้างแผนไม่สำเร็จ");
      } else {
        setPlan(data.plan);
        setTab("edit");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "บันทึกไม่สำเร็จ");
        setSaving(false);
        return;
      }
      router.push(`/plan/${data.id}`);
    } catch {
      setError("บันทึกไม่สำเร็จ");
      setSaving(false);
    }
  }

  return (
    <div className="app-gradient min-h-screen">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {!plan ? (
          // ---------- ขั้นกรอกข้อมูล ----------
          <div className="max-w-3xl mx-auto">
            <h1 className="font-head text-2xl font-bold text-slate-800">สร้างแผนการสอนใหม่</h1>
            <p className="text-slate-500 mt-1">
              กรอกข้อมูลพื้นฐาน แล้วให้ AI ร่างแผนให้ครบทั้ง 11 หัวข้อ (แก้ไขได้ภายหลัง)
            </p>

            <form onSubmit={generate} className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <ProfilePresetPicker
                value={form}
                onApply={(profile) => setForm((current) => ({ ...current, ...profile }))}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="กลุ่มสาระการเรียนรู้" required>
                  <input className={input} value={form.subject} onChange={(e) => setF("subject", e.target.value)} placeholder="เช่น คณิตศาสตร์" />
                </Field>
                <Field label="ระดับชั้น">
                  <input className={input} value={form.grade} onChange={(e) => setF("grade", e.target.value)} placeholder="เช่น ประถมศึกษาปีที่ 6" />
                </Field>
                <Field label="หน่วยการเรียนรู้">
                  <input className={input} value={form.unit} onChange={(e) => setF("unit", e.target.value)} placeholder="เช่น ทศนิยม" />
                </Field>
                <Field label="เรื่องที่จะสอน" required>
                  <input className={input} value={form.topic} onChange={(e) => setF("topic", e.target.value)} placeholder="เช่น โจทย์ปัญหาทศนิยม 2-3 ขั้นตอน" />
                </Field>
                <Field label="เวลา">
                  <input className={input} value={form.timeText} onChange={(e) => setF("timeText", e.target.value)} placeholder="เช่น 1 ชั่วโมง" />
                </Field>
                <Field label="รูปแบบ/เทคนิคการสอน">
                  <input className={input} value={form.teachingModel} onChange={(e) => setF("teachingModel", e.target.value)} placeholder="เช่น WAT Model + PDCA (เว้นว่างให้ AI เลือก)" />
                </Field>
                <Field label="โรงเรียน">
                  <input className={input} value={form.school} onChange={(e) => setF("school", e.target.value)} placeholder="ชื่อโรงเรียน" />
                </Field>
                <Field label="ผู้สอน">
                  <input className={input} value={form.teacher} onChange={(e) => setF("teacher", e.target.value)} placeholder="ชื่อ-นามสกุลผู้สอน" />
                </Field>
                <Field label="ผู้อำนวยการโรงเรียน">
                  <input className={input} value={form.director} onChange={(e) => setF("director", e.target.value)} placeholder="ชื่อ-นามสกุลผู้อำนวยการ" />
                </Field>
                <Field label="วันที่สอน">
                  <input type="date" className={input} value={form.teachingDate} onChange={(e) => setF("teachingDate", e.target.value)} />
                  <p className="text-xs text-slate-500 mt-1">{formatThaiDate(form.teachingDate)}</p>
                </Field>
              </div>

              <Field label="มาตรฐาน/ตัวชี้วัดที่ต้องการอ้างอิง (ถ้ามี)">
                <textarea className={input} rows={2} value={form.standard} onChange={(e) => setF("standard", e.target.value)} placeholder="วางข้อความมาตรฐาน/ตัวชี้วัดที่ต้องการ หรือเว้นว่างให้ AI เสนอให้" />
              </Field>

              <Field label="ความต้องการเพิ่มเติม / บริบทห้องเรียน">
                <textarea className={input} rows={3} value={form.notes} onChange={(e) => setF("notes", e.target.value)} placeholder="เช่น เน้น Active Learning, นักเรียน 25 คน, ใช้บาร์โมเดล, สอดแทรกทักษะการทำงานเป็นทีม ฯลฯ" />
              </Field>

              {error && <div className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 text-lg shadow-soft transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    AI กำลังร่างแผน... (ราว 5–15 วินาที)
                  </>
                ) : (
                  "✨ สร้างแผนด้วย AI"
                )}
              </button>
            </form>
          </div>
        ) : (
          // ---------- ขั้นแก้ไข/พรีวิว ----------
          <div>
            <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                <button onClick={() => setTab("edit")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "edit" ? "bg-brand-600 text-white" : "text-slate-600"}`}>✏️ แก้ไข</button>
                <button onClick={() => setTab("preview")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "preview" ? "bg-brand-600 text-white" : "text-slate-600"}`}>👁️ พรีวิว</button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setPlan(null); setError(""); }} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50">← เริ่มใหม่</button>
                <button onClick={() => downloadWord(plan)} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50">⬇️ ดาวน์โหลด Word</button>
                <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50">🖨️ พิมพ์ / PDF</button>
                <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60">
                  {saving ? "กำลังบันทึก..." : "💾 บันทึกแผน"}
                </button>
              </div>
            </div>

            {error && <div className="no-print rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3 mb-4">{error}</div>}

            {tab === "edit" ? (
              <div className="no-print max-w-3xl mx-auto">
                <PlanEditor plan={plan} onChange={setPlan} />
              </div>
            ) : (
              <PlanDocument plan={plan} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
