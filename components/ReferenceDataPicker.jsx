"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { REFERENCE_STORAGE_KEY, uniqueValues } from "@/lib/referenceData";

const cls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white";
export default function ReferenceDataPicker({ value, onChange }) {
  const [items, setItems] = useState([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(REFERENCE_STORAGE_KEY) || "[]")); } catch {} }, []);
  const filter = useMemo(() => ({ curriculum_version: value.curriculumVersion, subject_group: value.subjectGroup, course_name: value.subject, grade: value.grade }), [value]);
  const subjects = uniqueValues(items, "subject_group", { curriculum_version: value.curriculumVersion });
  const courses = uniqueValues(items, "course_name", { curriculum_version: value.curriculumVersion, subject_group: value.subjectGroup });
  const grades = uniqueValues(items, "grade", { curriculum_version: value.curriculumVersion, subject_group: value.subjectGroup, course_name: value.subject });
  const outcomes = items.filter((x) => x.active !== false && x.curriculum_version === filter.curriculum_version && x.subject_group === filter.subject_group && x.course_name === filter.course_name && x.grade === filter.grade);
  const schools = uniqueValues(items, "school_name");
  const teachers = uniqueValues(items, "teacher_name", { school_name: value.school });
  const update = (patch) => onChange({ ...value, ...patch });
  if (!items.length) return <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">ยังไม่มีข้อมูลอ้างอิง — <Link href="/data" className="font-semibold underline">นำเข้าไฟล์ CSV ที่หน้าข้อมูลพื้นฐาน</Link></div>;
  return <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4 space-y-3">
    <div className="flex justify-between gap-3"><div><h3 className="font-semibold text-slate-800">เลือกใช้ข้อมูลพื้นฐาน</h3><p className="text-xs text-slate-500">รายการจะกรองตามหลักสูตร กลุ่มสาระ รายวิชา และชั้น</p></div><Link href="/data" className="text-sm text-brand-700 underline">จัดการข้อมูล</Link></div>
    <div className="grid sm:grid-cols-2 gap-3">
      <select className={cls} value={value.subjectGroup || ""} onChange={(e) => update({ subjectGroup:e.target.value, subject:"", grade:"", standard:"" })}><option value="">เลือกกลุ่มสาระ</option>{subjects.map((x)=><option key={x}>{x}</option>)}</select>
      <select className={cls} value={value.subject || ""} onChange={(e) => update({ subject:e.target.value, grade:"", standard:"" })}><option value="">เลือกรายวิชา</option>{courses.map((x)=><option key={x}>{x}</option>)}</select>
      <select className={cls} value={value.grade || ""} onChange={(e) => update({ grade:e.target.value, standard:"" })}><option value="">เลือกชั้น</option>{grades.map((x)=><option key={x}>{x}</option>)}</select>
      <select className={cls} value={value.school || ""} onChange={(e) => { const school=e.target.value; const row=items.find((x)=>x.school_name===school); update({ school, director:row?.director_name||value.director }); }}><option value="">เลือกโรงเรียน</option>{schools.map((x)=><option key={x}>{x}</option>)}</select>
      <select className={cls} value={value.teacher || ""} onChange={(e) => update({ teacher:e.target.value })}><option value="">เลือกครูผู้สอน</option>{teachers.map((x)=><option key={x}>{x}</option>)}</select>
      <select className={cls} value="" onChange={(e) => { const row=outcomes.find((x)=>x.id===e.target.value); if(row) update({ standard:[value.standard, `${row.learning_code ? row.learning_code+" " : ""}${row.learning_text}`].filter(Boolean).join("\n") }); }}><option value="">เพิ่มตัวชี้วัด/ผลลัพธ์</option>{outcomes.map((x)=><option key={x.id} value={x.id}>{x.learning_code ? `${x.learning_code} — ` : ""}{x.learning_text}</option>)}</select>
    </div>
  </div>;
}

