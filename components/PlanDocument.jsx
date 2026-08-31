"use client";

import { formatThaiDate } from "@/lib/thaiDate";

function Section({ no, title, children }) {
  return (
    <section className="doc-section">
      <h2 className="doc-section-title">{no}. {title}</h2>
      <div className="doc-section-body">{children}</div>
    </section>
  );
}

function Lines({ items, ordered }) {
  const arr = (items || []).filter((x) => String(x || "").trim());
  if (!arr.length) return <p className="doc-empty">-</p>;
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={ordered ? "doc-list doc-list-ordered" : "doc-list"}>
      {arr.map((text, index) => <li key={index}>{text}</li>)}
    </Tag>
  );
}

function MetaItem({ label, children }) {
  return <div className="doc-meta-item"><strong>{label}</strong> {children || "-"}</div>;
}

export default function PlanDocument({ plan }) {
  const p = plan || {};
  const standards = p.standardsOld || {};
  const objectives = p.objectives || {};
  const situation = p.problemSituation || {};

  return (
    <article className="doc-sheet formal-doc mx-auto max-w-[820px] rounded-2xl shadow-soft p-6 md:p-10">
      <header className="doc-header">
        <img className="doc-seal" src="/image1.png" alt="ตราโรงเรียนวัดทุ่งจาน" />
        <div className="doc-header-copy">
          <h1>แผนการจัดการเรียนรู้ที่ {p.planNumber || "1"}</h1>
          <p>โรงเรียน{p.school || "วัดทุ่งจาน"}</p>
        </div>
      </header>
      <div className="doc-header-rule" />

      <div className="doc-meta">
        <MetaItem label="หน่วยการเรียนรู้">{p.unit}</MetaItem>
        <MetaItem label="เรื่อง">{p.topic}</MetaItem>
        <MetaItem label="กลุ่มสาระการเรียนรู้">{p.subject}</MetaItem>
        <MetaItem label="ชั้น">{p.grade}</MetaItem>
        <MetaItem label="เวลา">{p.timeText}</MetaItem>
        <MetaItem label="ผู้สอน">{p.teacher}</MetaItem>
        <MetaItem label="วันที่สอน">{formatThaiDate(p.teachingDate)}</MetaItem>
        <MetaItem label="ผู้อำนวยการโรงเรียน">{p.director}</MetaItem>
      </div>

      <Section no="1" title="มาตรฐานการเรียนรู้ / ตัวชี้วัด">
        <p>{standards.standard || "-"}</p>
        <p><strong>ตัวชี้วัดระหว่างทาง:</strong> {standards.indicatorMid || "-"}</p>
        <p><strong>ตัวชี้วัดปลายทาง:</strong> {standards.indicatorFinal || "-"}</p>
      </Section>

      <Section no="2" title="ผลลัพธ์การเรียนรู้ (หลักสูตรใหม่ 2568)"><p>{p.learningOutcomeNew || "-"}</p></Section>

      <Section no="3" title="สมรรถนะที่มุ่งพัฒนา">
        {(p.competencies || []).length ? (
          <ul className="doc-list">
            {p.competencies.map((item, index) => (
              <li key={index}><strong>{item.name}</strong>{item.detail ? ` — ${item.detail}` : ""}</li>
            ))}
          </ul>
        ) : <p className="doc-empty">-</p>}
      </Section>

      <Section no="4" title="สาระสำคัญ / ความคิดรวบยอด"><p>{p.keyConcept || "-"}</p></Section>

      <Section no="5" title="จุดประสงค์การเรียนรู้">
        <ul className="doc-list">
          <li><strong>ด้านความรู้ (K):</strong> {objectives.knowledge || "-"}</li>
          <li><strong>ด้านทักษะ/กระบวนการ (P):</strong> {objectives.process || "-"}</li>
          <li><strong>ด้านเจตคติ (A):</strong> {objectives.attitude || "-"}</li>
        </ul>
      </Section>

      <Section no="6" title="สาระการเรียนรู้"><p>{p.content || "-"}</p></Section>

      <Section no="7" title="ตัวอย่างสถานการณ์ปัญหา">
        <p><strong>โจทย์:</strong> {situation.problem || "-"}</p>
        <p className="doc-subtitle">แนวคิด/แผนภาพช่วยคิด</p>
        <Lines items={situation.barModel} />
        <p className="doc-subtitle">แนวคิดการหาคำตอบ</p>
        <Lines items={situation.solutionSteps} ordered />
        {situation.answer && <p><strong>{situation.answer}</strong></p>}
      </Section>

      <Section no="8" title={`กิจกรรมการเรียนรู้${p.teachingModel ? ` (${p.teachingModel})` : ""}`}>
        <div className="overflow-x-auto">
          <table className="doc-table">
            <thead><tr><th className="w-[26%] text-left">ขั้น</th><th className="w-[14%]">เวลา</th><th className="text-left">กิจกรรมการเรียนรู้</th></tr></thead>
            <tbody>
              {(p.activities || []).map((activity, index) => (
                <tr key={index}>
                  <td><strong>{activity.phase}</strong></td>
                  <td className="text-center whitespace-nowrap">{activity.time}</td>
                  <td>{activity.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section no="9" title="สื่อและแหล่งการเรียนรู้"><Lines items={p.media} /></Section>

      <Section no="10" title="การวัดและประเมินผล">
        <div className="overflow-x-auto">
          <table className="doc-table doc-table-evaluation">
            <thead><tr><th>สิ่งที่วัด</th><th>วิธีการวัด</th><th>เครื่องมือ</th><th>เกณฑ์การประเมิน</th></tr></thead>
            <tbody>
              {(p.evaluation || []).map((item, index) => (
                <tr key={index}><td>{item.aspect}</td><td>{item.method}</td><td>{item.tool}</td><td>{item.criteria}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section no="11" title="บันทึกหลังการจัดการเรียนรู้">
        <p>ผลการจัดการเรียนรู้ ....................................................................................................</p>
        <p>....................................................................................................................................</p>
        <p>ปัญหา/อุปสรรค ..........................................................................................................</p>
        <p>....................................................................................................................................</p>
        <p>แนวทางแก้ไข/ข้อเสนอแนะ ..........................................................................................</p>
        <p>....................................................................................................................................</p>
        <div className="doc-signatures">
          <div><p>ลงชื่อ ...................................................... ผู้สอน</p><p>( {p.teacher || "................................"} )</p><p>ครูผู้สอน</p></div>
          <div><p>ลงชื่อ ......................................................</p><p>( {p.director || "................................"} )</p><p>ผู้อำนวยการโรงเรียน{p.school || ""}</p></div>
        </div>
      </Section>
    </article>
  );
}
