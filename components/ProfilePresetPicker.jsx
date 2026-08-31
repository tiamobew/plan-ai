"use client";

import { useEffect, useMemo, useState } from "react";

const PROFILE_KEYS = ["teacher", "subject", "director", "school", "grade"];

function profileValues(source = {}) {
  return Object.fromEntries(PROFILE_KEYS.map((key) => [key, source[key] || ""]));
}

export default function ProfilePresetPicker({ value, onApply }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  const selected = useMemo(
    () => profiles.find((profile) => profile.id === selectedId) || null,
    [profiles, selectedId]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();
        if (!cancelled && response.ok) setProfiles(data.profiles || []);
        if (!cancelled && !response.ok) setMessage(data.error || "ดึงชุดข้อมูลไม่สำเร็จ");
      } catch {
        if (!cancelled) setMessage("เชื่อมต่อเพื่อดึงชุดข้อมูลไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function choose(id) {
    setSelectedId(id);
    const profile = profiles.find((item) => item.id === id);
    if (!profile) {
      setName("");
      return;
    }
    setName(profile.name || "");
    onApply(profileValues(profile));
    setMessage(`นำ “${profile.name}” มาใช้แล้ว`);
  }

  async function saveAsNew() {
    setWorking(true);
    setMessage("");
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, profile: profileValues(value) }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "เพิ่มชุดข้อมูลไม่สำเร็จ");
        return;
      }
      setProfiles((current) => [data.profile, ...current]);
      setSelectedId(data.profile.id);
      setName(data.profile.name);
      setMessage("เพิ่มเป็นชุดข้อมูลใหม่แล้ว");
    } catch {
      setMessage("เชื่อมต่อเพื่อเพิ่มชุดข้อมูลไม่สำเร็จ");
    } finally {
      setWorking(false);
    }
  }

  async function updateSelected() {
    if (!selectedId) return;
    setWorking(true);
    setMessage("");
    try {
      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, name, profile: profileValues(value) }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "อัปเดตชุดข้อมูลไม่สำเร็จ");
        return;
      }
      setProfiles((current) =>
        current.map((item) => item.id === data.profile.id ? data.profile : item)
      );
      setName(data.profile.name);
      setMessage("อัปเดตชุดข้อมูลที่เลือกแล้ว");
    } catch {
      setMessage("เชื่อมต่อเพื่ออัปเดตชุดข้อมูลไม่สำเร็จ");
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="rounded-xl border border-brand-100 bg-brand-50 p-4 space-y-3">
      <div>
        <h2 className="font-semibold text-slate-800">ชุดข้อมูลพื้นฐานสำหรับใช้ซ้ำ</h2>
        <p className="text-sm text-slate-600">
          เลือกชุดที่เคยบันทึก หรือกรอกข้อมูลด้านล่างแล้วเพิ่มเป็นชุดใหม่
        </p>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-2">
        <select
          className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-100"
          value={selectedId}
          onChange={(event) => choose(event.target.value)}
          disabled={loading || working}
        >
          <option value="">{loading ? "กำลังดึงชุดข้อมูล..." : "-- เลือกชุดข้อมูล --"}</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>{profile.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => selected && choose(selected.id)}
          disabled={!selected || working}
          className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 disabled:opacity-50"
        >
          ใช้ชุดที่เลือก
        </button>
      </div>

      {selected && (
        <p className="text-xs text-slate-600">
          ครู: {selected.teacher || "-"} · รายวิชา: {selected.subject || "-"} · ชั้น: {selected.grade || "-"}
        </p>
      )}

      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2">
        <input
          className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-100"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="ชื่อชุดข้อมูล เช่น ครูโสภิตรา · คณิตศาสตร์ ป.6"
        />
        <button
          type="button"
          onClick={saveAsNew}
          disabled={working}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {working ? "กำลังบันทึก..." : "＋ เพิ่มเป็นชุดใหม่"}
        </button>
        <button
          type="button"
          onClick={updateSelected}
          disabled={!selectedId || working}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          อัปเดตชุดที่เลือก
        </button>
      </div>

      {message && <p className="text-sm text-brand-700">{message}</p>}
    </section>
  );
}
