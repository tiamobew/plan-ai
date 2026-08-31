"use client";

import { formatThaiDate } from "@/lib/thaiDate";

// ฟอร์มแก้ไขแผนการสอนแบบมีโครงสร้าง — แก้ทุกช่องได้ก่อนบันทึก/ดาวน์โหลด

function Label({ children }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1">{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[15px] focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
    />
  );
}

function Area({ value, onChange, rows = 3, placeholder }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[15px] leading-6 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
    />
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-head font-semibold text-slate-800 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// แก้ไขลิสต์ข้อความ (สื่อ / บาร์โมเดล / ขั้นตอน)
function StringList({ items, onChange, placeholder }) {
  const arr = items || [];
  const set = (i, v) => onChange(arr.map((x, idx) => (idx === i ? v : x)));
  const add = () => onChange([...arr, ""]);
  const del = (i) => onChange(arr.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {arr.map((it, i) => (
        <div key={i} className="flex gap-2">
          <Input value={it} onChange={(v) => set(i, v)} placeholder={placeholder} />
          <button
            type="button"
            onClick={() => del(i)}
            className="shrink-0 px-3 rounded-lg text-red-500 hover:bg-red-50"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        + เพิ่มรายการ
      </button>
    </div>
  );
}

export default function PlanEditor({ plan, onChange }) {
  const p = plan || {};
  const set = (key, val) => onChange({ ...p, [key]: val });
  const setNested = (key, subkey, val) =>
    onChange({ ...p, [key]: { ...(p[key] || {}), [subkey]: val } });

  // ---- object arrays ----
  const comps = p.competencies || [];
  const acts = p.activities || [];
  const evals = p.evaluation || [];

  const setComp = (i, k, v) =>
    set("competencies", comps.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)));
  const setAct = (i, k, v) =>
    set("activities", acts.map((a, idx) => (idx === i ? { ...a, [k]: v } : a)));
  const setEval = (i, k, v) =>
    set("evaluation", evals.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));

  return (
    <div className="space-y-4">
      <Card title="ข้อมูลหัวกระดาษ">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>เลขที่แผน</Label><Input value={p.planNumber} onChange={(v) => set("planNumber", v)} /></div>
          <div><Label>เวลา</Label><Input value={p.timeText} onChange={(v) => set("timeText", v)} /></div>
          <div><Label>โรงเรียน</Label><Input value={p.school} onChange={(v) => set("school", v)} /></div>
          <div><Label>ผู้สอน</Label><Input value={p.teacher} onChange={(v) => set("teacher", v)} /></div>
          <div><Label>ผู้อำนวยการโรงเรียน</Label><Input value={p.director} onChange={(v) => set("director", v)} /></div>
          <div><Label>วันที่สอน</Label><Input type="date" value={p.teachingDate} onChange={(v) => set("teachingDate", v)} /><p className="text-xs text-slate-500 mt-1">{formatThaiDate(p.teachingDate)}</p></div>
          <div><Label>กลุ่มสาระการเรียนรู้</Label><Input value={p.subject} onChange={(v) => set("subject", v)} /></div>
          <div><Label>ระดับชั้น</Label><Input value={p.grade} onChange={(v) => set("grade", v)} /></div>
          <div><Label>หน่วยการเรียนรู้</Label><Input value={p.unit} onChange={(v) => set("unit", v)} /></div>
          <div><Label>เรื่อง</Label><Input value={p.topic} onChange={(v) => set("topic", v)} /></div>
          <div className="sm:col-span-2"><Label>รูปแบบ/เทคนิคการสอน</Label><Input value={p.teachingModel} onChange={(v) => set("teachingModel", v)} /></div>
        </div>
      </Card>

      <Card title="1. มาตรฐานการเรียนรู้ / ตัวชี้วัด">
        <div><Label>มาตรฐาน</Label><Area value={p.standardsOld?.standard} onChange={(v) => setNested("standardsOld", "standard", v)} /></div>
        <div><Label>ตัวชี้วัดระหว่างทาง</Label><Area rows={2} value={p.standardsOld?.indicatorMid} onChange={(v) => setNested("standardsOld", "indicatorMid", v)} /></div>
        <div><Label>ตัวชี้วัดปลายทาง</Label><Area rows={2} value={p.standardsOld?.indicatorFinal} onChange={(v) => setNested("standardsOld", "indicatorFinal", v)} /></div>
      </Card>

      <Card title="2. ผลลัพธ์การเรียนรู้ (หลักสูตรใหม่ 2568)">
        <Area value={p.learningOutcomeNew} onChange={(v) => set("learningOutcomeNew", v)} />
      </Card>

      <Card title="3. สมรรถนะที่มุ่งพัฒนา">
        {comps.map((c, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3 space-y-2">
            <div className="flex gap-2">
              <Input value={c.name} onChange={(v) => setComp(i, "name", v)} placeholder="ชื่อสมรรถนะ" />
              <button type="button" onClick={() => set("competencies", comps.filter((_, idx) => idx !== i))} className="shrink-0 px-3 rounded-lg text-red-500 hover:bg-red-100">✕</button>
            </div>
            <Area rows={2} value={c.detail} onChange={(v) => setComp(i, "detail", v)} placeholder="คำอธิบาย" />
          </div>
        ))}
        <button type="button" onClick={() => set("competencies", [...comps, { name: "", detail: "" }])} className="text-sm text-brand-600 font-medium">+ เพิ่มสมรรถนะ</button>
      </Card>

      <Card title="4. สาระสำคัญ / ความคิดรวบยอด">
        <Area value={p.keyConcept} onChange={(v) => set("keyConcept", v)} />
      </Card>

      <Card title="5. จุดประสงค์การเรียนรู้ (K / P / A)">
        <div><Label>ด้านความรู้ (K)</Label><Area rows={2} value={p.objectives?.knowledge} onChange={(v) => setNested("objectives", "knowledge", v)} /></div>
        <div><Label>ด้านทักษะ (P)</Label><Area rows={2} value={p.objectives?.process} onChange={(v) => setNested("objectives", "process", v)} /></div>
        <div><Label>ด้านเจตคติ (A)</Label><Area rows={2} value={p.objectives?.attitude} onChange={(v) => setNested("objectives", "attitude", v)} /></div>
      </Card>

      <Card title="6. สาระการเรียนรู้">
        <Area value={p.content} onChange={(v) => set("content", v)} />
      </Card>

      <Card title="7. ตัวอย่างสถานการณ์ปัญหา">
        <div><Label>โจทย์/สถานการณ์</Label><Area value={p.problemSituation?.problem} onChange={(v) => setNested("problemSituation", "problem", v)} /></div>
        <div><Label>แนวคิด/แผนภาพช่วยคิด (ทีละบรรทัด)</Label>
          <StringList items={p.problemSituation?.barModel} onChange={(v) => setNested("problemSituation", "barModel", v)} placeholder="เช่น ขวดที่ 1 = 4.2 กก." />
        </div>
        <div><Label>แนวคิดการหาคำตอบ (ทีละขั้น)</Label>
          <StringList items={p.problemSituation?.solutionSteps} onChange={(v) => setNested("problemSituation", "solutionSteps", v)} placeholder="เช่น ขั้นที่ 1 ..." />
        </div>
        <div><Label>คำตอบ/ข้อสรุป</Label><Input value={p.problemSituation?.answer} onChange={(v) => setNested("problemSituation", "answer", v)} /></div>
      </Card>

      <Card title="8. กิจกรรมการเรียนรู้">
        {acts.map((a, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3 space-y-2">
            <div className="flex gap-2">
              <Input value={a.phase} onChange={(v) => setAct(i, "phase", v)} placeholder="ชื่อขั้น" />
              <div className="w-32 shrink-0"><Input value={a.time} onChange={(v) => setAct(i, "time", v)} placeholder="เวลา" /></div>
              <button type="button" onClick={() => set("activities", acts.filter((_, idx) => idx !== i))} className="shrink-0 px-3 rounded-lg text-red-500 hover:bg-red-100">✕</button>
            </div>
            <Area value={a.detail} onChange={(v) => setAct(i, "detail", v)} placeholder="รายละเอียดกิจกรรม" />
          </div>
        ))}
        <button type="button" onClick={() => set("activities", [...acts, { phase: "", time: "", detail: "" }])} className="text-sm text-brand-600 font-medium">+ เพิ่มขั้นกิจกรรม</button>
      </Card>

      <Card title="9. สื่อและแหล่งการเรียนรู้">
        <StringList items={p.media} onChange={(v) => set("media", v)} placeholder="เช่น ใบกิจกรรม..." />
      </Card>

      <Card title="10. การวัดและประเมินผล">
        {evals.map((e, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">รายการที่ {i + 1}</span>
              <button type="button" onClick={() => set("evaluation", evals.filter((_, idx) => idx !== i))} className="px-2 rounded text-red-500 hover:bg-red-100">✕ ลบ</button>
            </div>
            <Input value={e.aspect} onChange={(v) => setEval(i, "aspect", v)} placeholder="สิ่งที่วัด" />
            <div className="grid sm:grid-cols-2 gap-2">
              <Input value={e.method} onChange={(v) => setEval(i, "method", v)} placeholder="วิธีการวัด" />
              <Input value={e.tool} onChange={(v) => setEval(i, "tool", v)} placeholder="เครื่องมือ" />
            </div>
            <Area rows={2} value={e.criteria} onChange={(v) => setEval(i, "criteria", v)} placeholder="เกณฑ์การประเมิน" />
          </div>
        ))}
        <button type="button" onClick={() => set("evaluation", [...evals, { aspect: "", method: "", tool: "", criteria: "" }])} className="text-sm text-brand-600 font-medium">+ เพิ่มรายการประเมิน</button>
      </Card>

      <Card title="11. บันทึกหลังการสอน (หน้าใหม่ในไฟล์ Word)">
        <p className="text-sm text-slate-500">
          หากเว้นช่อง K/P/A ระบบจะดึงจุดประสงค์จากแผนมาใช้ให้อัตโนมัติ
        </p>
        <div><Label>ผลด้านความรู้ (K)</Label><Area rows={3} value={p.postTeaching?.knowledge} onChange={(v) => setNested("postTeaching", "knowledge", v)} placeholder="เว้นว่างเพื่อใช้จุดประสงค์ด้านความรู้จากแผน" /></div>
        <div><Label>ผลด้านทักษะ/กระบวนการ (P)</Label><Area rows={3} value={p.postTeaching?.process} onChange={(v) => setNested("postTeaching", "process", v)} placeholder="เว้นว่างเพื่อใช้จุดประสงค์ด้านทักษะจากแผน" /></div>
        <div><Label>ผลด้านเจตคติ (A)</Label><Area rows={3} value={p.postTeaching?.attitude} onChange={(v) => setNested("postTeaching", "attitude", v)} placeholder="เว้นว่างเพื่อใช้จุดประสงค์ด้านเจตคติจากแผน" /></div>
        <div><Label>ปัญหาและอุปสรรค</Label><Area rows={3} value={p.postTeaching?.problems} onChange={(v) => setNested("postTeaching", "problems", v)} placeholder="บันทึกหลังสอน หรือเว้นว่างไว้เขียนภายหลัง" /></div>
        <div><Label>แนวทางแก้ไขและพัฒนา</Label><Area rows={3} value={p.postTeaching?.solutions} onChange={(v) => setNested("postTeaching", "solutions", v)} placeholder="แนวทางช่วยเหลือนักเรียนและปรับกิจกรรม" /></div>
        <div><Label>ผลสำเร็จของการจัดการเรียนรู้</Label><Area rows={3} value={p.postTeaching?.success} onChange={(v) => setNested("postTeaching", "success", v)} placeholder="เว้นว่างเพื่อให้ระบบสรุปจากเรื่องและจุดประสงค์ของแผน" /></div>
      </Card>
    </div>
  );
}
