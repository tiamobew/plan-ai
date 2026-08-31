"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import PlanEditor from "@/components/PlanEditor";
import PlanDocument from "@/components/PlanDocument";
import { downloadWord } from "@/lib/exportDoc";

export default function PlanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("preview");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/plans/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.plan) setPlan(d.plan);
        else setError(d.error || "ไม่พบแผนนี้");
      })
      .catch(() => setError("โหลดข้อมูลไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [id]);

  async function update() {
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "บันทึกไม่สำเร็จ");
      else {
        setStatus("บันทึกการแก้ไขแล้ว ✓");
        setTimeout(() => setStatus(""), 2500);
      }
    } catch {
      setError("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("ต้องการลบแผนนี้ใช่หรือไม่?")) return;
    const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard");
    else setError("ลบไม่สำเร็จ");
  }

  if (loading)
    return (
      <div className="app-gradient min-h-screen">
        <AppHeader />
        <div className="text-center text-slate-400 py-20">กำลังโหลด...</div>
      </div>
    );

  if (!plan)
    return (
      <div className="app-gradient min-h-screen">
        <AppHeader />
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-slate-500">{error || "ไม่พบแผนนี้"}</p>
        </div>
      </div>
    );

  return (
    <div className="app-gradient min-h-screen">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1">
            <button onClick={() => setTab("preview")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "preview" ? "bg-brand-600 text-white" : "text-slate-600"}`}>👁️ พรีวิว</button>
            <button onClick={() => setTab("edit")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "edit" ? "bg-brand-600 text-white" : "text-slate-600"}`}>✏️ แก้ไข</button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {status && <span className="text-sm text-green-600">{status}</span>}
            <button onClick={remove} className="px-3 py-2 rounded-lg border border-red-200 bg-white text-red-500 text-sm hover:bg-red-50">🗑️ ลบ</button>
            <button onClick={() => downloadWord(plan)} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50">⬇️ Word</button>
            <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50">🖨️ พิมพ์ / PDF</button>
            <button onClick={update} disabled={saving} className="px-5 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60">
              {saving ? "กำลังบันทึก..." : "💾 บันทึกการแก้ไข"}
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
      </main>
    </div>
  );
}
