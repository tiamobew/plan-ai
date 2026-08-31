"use client";

// แสดงแผนการสอนในรูปแบบเอกสารสวยงาม (ใช้พรีวิว + สั่งพิมพ์)

function Section({ no, title, children }) {
  return (
    <section className="mt-6">
      <h2 className="font-head text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1.5 mb-3">
        <span className="text-brand-600">{no}.</span> {title}
      </h2>
      <div className="text-[15px] leading-7 text-slate-700 space-y-2">{children}</div>
    </section>
  );
}

function Lines({ items, ordered }) {
  const arr = (items || []).filter((x) => String(x || "").trim());
  if (!arr.length) return <p className="text-slate-400">-</p>;
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={ordered ? "list-decimal pl-6 space-y-1" : "list-disc pl-6 space-y-1"}>
      {arr.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </Tag>
  );
}

export default function PlanDocument({ plan }) {
  const p = plan || {};
  const so = p.standardsOld || {};
  const ob = p.objectives || {};
  const ps = p.problemSituation || {};

  return (
    <article className="doc-sheet mx-auto max-w-[820px] rounded-2xl shadow-soft p-8 md:p-12">
      {/* หัวกระดาษ */}
      <header className="text-center">
        <h1 className="font-head text-2xl font-bold text-slate-900">
          แผนการจัดการเรียนรู้ที่ {p.planNumber || "1"}
        </h1>
      </header>
      <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-1 text-[15px] text-slate-700 border-y border-slate-200 py-3">
        <div><b>หน่วยการเรียนรู้:</b> {p.unit || "-"}</div>
        <div><b>เรื่อง:</b> {p.topic || "-"}</div>
        <div><b>กลุ่มสาระการเรียนรู้:</b> {p.subject || "-"}</div>
        <div><b>ชั้น:</b> {p.grade || "-"}</div>
        <div><b>เวลา:</b> {p.timeText || "-"}</div>
        <div><b>ผู้สอน:</b> {p.teacher || "-"}</div>
        <div className="sm:col-span-2"><b>โรงเรียน:</b> {p.school || "-"}</div>
      </div>

      <Section no="1" title="มาตรฐานการเรียนรู้ / ตัวชี้วัด">
        <p>{so.standard || "-"}</p>
        <p><b>ตัวชี้วัดระหว่างทาง:</b> {so.indicatorMid || "-"}</p>
        <p><b>ตัวชี้วัดปลายทาง:</b> {so.indicatorFinal || "-"}</p>
      </Section>

      <Section no="2" title="ผลลัพธ์การเรียนรู้ (หลักสูตรใหม่ 2568)">
        <p>{p.learningOutcomeNew || "-"}</p>
      </Section>

      <Section no="3" title="สมรรถนะที่มุ่งพัฒนา">
        {(p.competencies || []).length ? (
          <ul className="list-disc pl-6 space-y-1">
            {p.competencies.map((c, i) => (
              <li key={i}>
                <b>{c.name}</b>
                {c.detail ? ` — ${c.detail}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">-</p>
        )}
      </Section>

      <Section no="4" title="สาระสำคัญ / ความคิดรวบยอด">
        <p>{p.keyConcept || "-"}</p>
      </Section>

      <Section no="5" title="จุดประสงค์การเรียนรู้">
        <ul className="list-disc pl-6 space-y-1">
          <li><b>ด้านความรู้ (K):</b> {ob.knowledge || "-"}</li>
          <li><b>ด้านทักษะ (P):</b> {ob.process || "-"}</li>
          <li><b>ด้านเจตคติ (A):</b> {ob.attitude || "-"}</li>
        </ul>
      </Section>

      <Section no="6" title="สาระการเรียนรู้">
        <p>{p.content || "-"}</p>
      </Section>

      <Section no="7" title="ตัวอย่างสถานการณ์ปัญหา">
        <p><b>โจทย์:</b> {ps.problem || "-"}</p>
        <p className="font-medium mt-2">แนวคิด/แผนภาพช่วยคิด</p>
        <Lines items={ps.barModel} />
        <p className="font-medium mt-2">แนวคิดการหาคำตอบ</p>
        <Lines items={ps.solutionSteps} ordered />
        {ps.answer && <p className="mt-2 font-semibold">{ps.answer}</p>}
      </Section>

      <Section
        no="8"
        title={`กิจกรรมการเรียนรู้${p.teachingModel ? ` (${p.teachingModel})` : ""}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-brand-50">
                <th className="border border-slate-300 px-2 py-2 text-left w-[26%]">ขั้น</th>
                <th className="border border-slate-300 px-2 py-2 w-[14%]">เวลา</th>
                <th className="border border-slate-300 px-2 py-2 text-left">กิจกรรมการเรียนรู้</th>
              </tr>
            </thead>
            <tbody>
              {(p.activities || []).map((a, i) => (
                <tr key={i}>
                  <td className="border border-slate-300 px-2 py-2 align-top font-medium">{a.phase}</td>
                  <td className="border border-slate-300 px-2 py-2 align-top text-center whitespace-nowrap">{a.time}</td>
                  <td className="border border-slate-300 px-2 py-2 align-top">{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section no="9" title="สื่อและแหล่งการเรียนรู้">
        <Lines items={p.media} />
      </Section>

      <Section no="10" title="การวัดและประเมินผล">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-brand-50">
                <th className="border border-slate-300 px-2 py-2 text-left">สิ่งที่วัด</th>
                <th className="border border-slate-300 px-2 py-2 text-left">วิธีการวัด</th>
                <th className="border border-slate-300 px-2 py-2 text-left">เครื่องมือ</th>
                <th className="border border-slate-300 px-2 py-2 text-left">เกณฑ์การประเมิน</th>
              </tr>
            </thead>
            <tbody>
              {(p.evaluation || []).map((e, i) => (
                <tr key={i}>
                  <td className="border border-slate-300 px-2 py-2 align-top">{e.aspect}</td>
                  <td className="border border-slate-300 px-2 py-2 align-top">{e.method}</td>
                  <td className="border border-slate-300 px-2 py-2 align-top">{e.tool}</td>
                  <td className="border border-slate-300 px-2 py-2 align-top">{e.criteria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section no="11" title="บันทึกหลังการจัดการเรียนรู้">
        <p>ผลการจัดการเรียนรู้ ....................................................................................................</p>
        <p>ปัญหา/อุปสรรค ..........................................................................................................</p>
        <p>แนวทางแก้ไข/ข้อเสนอแนะ ..........................................................................................</p>
        <div className="mt-8 text-right">
          <p>ลงชื่อ .......................................................... ผู้สอน</p>
          <p>( {p.teacher || "........................."} )</p>
        </div>
      </Section>
    </article>
  );
}
