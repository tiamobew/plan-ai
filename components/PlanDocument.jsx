"use client";
import { formatThaiDate } from "@/lib/thaiDate";

function Section({ no, title, children }) { return <section className="doc-section"><h2 className="doc-section-title">{no}. {title}</h2><div className="doc-section-body">{children}</div></section>; }
function List({ items = [], render }) { const rows = items.filter(Boolean); return rows.length ? <ul className="doc-list">{rows.map((x,i)=><li key={i}>{render ? render(x) : String(x)}</li>)}</ul> : <p>-</p>; }
function Objectives({ p, is2568 }) { const o=p.objectives||{}; return <ul className="doc-list"><li><strong>K — Knowledge:</strong> {o.knowledge||'-'}</li><li><strong>{is2568?'S — Skills':'P — Process'}:</strong> {o.skill||o.process||'-'}</li><li><strong>A — Attitude/Attribute:</strong> {o.attitude||'-'}</li></ul>; }
function Activities({ items=[] }) { return <table className="doc-table"><thead><tr><th>ขั้น</th><th>เวลา</th><th>กิจกรรมการเรียนรู้</th></tr></thead><tbody>{items.map((x,i)=><tr key={i}><td>{x.phase}</td><td>{x.time}</td><td>{x.detail}</td></tr>)}</tbody></table>; }
function Evaluation({ items=[] }) { return <div className="overflow-x-auto"><table className="doc-table"><thead><tr><th>ด้าน</th><th>สิ่งที่ประเมิน</th><th>ที่มา</th><th>วิธี/เครื่องมือ</th><th>หลักฐาน</th><th>เกณฑ์</th></tr></thead><tbody>{items.map((x,i)=><tr key={i}><td>{x.dimension}</td><td>{x.indicator||x.aspect}</td><td>{x.source}</td><td>{x.method}<br/>{x.tool}</td><td>{x.evidence}</td><td>{x.criteria}</td></tr>)}</tbody></table></div>; }

export default function PlanDocument({ plan }) {
  const p=plan||{}; const is2568=p.curriculumVersion==='2568'; const standards=p.standards||p.standardsOld||{}; const post=p.postTeaching||{}; const questions=p.worksheet?.questions||[];
  return <article className="plan-document bg-white mx-auto shadow-sm">
    <header className="doc-masthead"><img src="/image1.png" alt="ตราโรงเรียน"/><h1>แผนการจัดการเรียนรู้ที่ {p.planNumber||'1'}</h1><p>หลักสูตร {p.curriculumVersion||'2560'} · โรงเรียน{p.school||'วัดทุ่งจาน'}</p></header>
    <div className="doc-plan-meta"><div><strong>หน่วย:</strong> {p.unit||'-'} · <strong>เรื่อง:</strong> {p.topic||'-'} · <strong>กลุ่มสาระ:</strong> {p.subject||'-'}</div><div><strong>ชั้น:</strong> {p.grade||'-'} · <strong>เวลา:</strong> {p.timeText||'-'} · <strong>วันที่:</strong> {formatThaiDate(p.teachingDate)}</div></div>
    {!is2568 ? <>
      <Section no="1" title="มาตรฐานการเรียนรู้และตัวชี้วัด"><p>{standards.standard||'-'}</p><p><strong>ระหว่างทาง:</strong> {standards.indicatorMid||'-'}</p><p><strong>ปลายทาง:</strong> {standards.indicatorFinal||'-'}</p><p><strong>รหัส:</strong> {standards.codes||'-'}</p></Section>
      <Section no="2" title="สาระสำคัญ/ความคิดรวบยอด"><p>{p.keyConcept||'-'}</p></Section>
      <Section no="3" title="จุดประสงค์การเรียนรู้ (K-P-A)"><Objectives p={p} is2568={false}/></Section>
      <Section no="4" title="สาระการเรียนรู้"><p>{p.learningContent||p.content||'-'}</p></Section>
      <Section no="5" title="สมรรถนะสำคัญของผู้เรียน"><List items={p.competencies} render={(x)=><><strong>{x.name}</strong>{x.detail?` — ${x.detail}`:''}</>}/></Section>
      <Section no="6" title="คุณลักษณะอันพึงประสงค์"><List items={p.desiredCharacteristics} render={(x)=><><strong>{x.name}</strong>{x.behavior?` — ${x.behavior}`:''}</>}/></Section>
    </> : <>
      <Section no="1" title="ผลลัพธ์การเรียนรู้ (หลักสูตร 2568)"><p>{p.learningOutcome||p.learningOutcomeNew||'-'}</p></Section>
      <Section no="2" title="สาระสำคัญ/ความคิดรวบยอด"><p>{p.keyConcept||'-'}</p></Section>
      <Section no="3" title="จุดประสงค์การเรียนรู้ (K-S-A)"><Objectives p={p} is2568/></Section>
      <Section no="4" title="สมรรถนะหลัก/สมรรถนะเฉพาะที่มุ่งพัฒนา"><List items={p.competencies} render={(x)=><><strong>{x.type?`${x.type}: `:''}{x.name}</strong>{x.detail?` — ${x.detail}`:''}</>}/></Section>
      <Section no="5" title="สมรรถนะ PISA (Mathematical Literacy) ป.4-6">{p.pisa?.enabled?<><p><strong>กระบวนการ:</strong> {(p.pisa.process||[]).join(', ')||'-'}</p><p><strong>เนื้อหา:</strong> {(p.pisa.content||[]).join(', ')||'-'}</p><p><strong>บริบท:</strong> {(p.pisa.context||[]).join(', ')||'-'}</p><p>{p.pisa.detail}</p></>:<p>ไม่ใช้ในแผนนี้</p>}</Section>
      <Section no="6" title="คุณลักษณะอันพึงประสงค์ (เลือกประเมิน)"><List items={p.desiredCharacteristics} render={(x)=><><strong>{x.name}</strong>{x.behavior?` — ${x.behavior}`:''}</>}/></Section>
    </>}
    <Section no="7" title="กิจกรรมการเรียนรู้"><Activities items={p.activities}/></Section>
    <Section no="8" title="สื่อและแหล่งเรียนรู้"><List items={p.media}/></Section>
    {!is2568 && <Section no="9" title="ชิ้นงาน/ภาระงาน"><List items={p.tasks}/></Section>}
    <Section no={is2568?'9':'10'} title="การวัดและประเมินผล"><Evaluation items={p.evaluation}/></Section>
    {is2568 && <Section no="10" title="เกณฑ์การประเมินสมรรถนะ (4 ระดับ)"><table className="doc-table"><thead><tr><th>ระดับ</th><th>ชื่อระดับ</th><th>เกณฑ์เฉพาะงาน</th></tr></thead><tbody>{(p.rubric||[]).map((x,i)=><tr key={i}><td>{x.level}</td><td>{x.label}</td><td>{x.descriptor}</td></tr>)}</tbody></table></Section>}
    <Section no="11" title={`บันทึกหลังการสอน (${is2568?'K-S-A':'K-P-A'})`}><p><strong>K:</strong> {post.knowledge||'-'}</p><p><strong>{is2568?'S':'P'}:</strong> {post.skill||post.process||'-'}</p><p><strong>A:</strong> {post.attitude||'-'}</p><p><strong>ปัญหา:</strong> {post.problems||'-'}</p><p><strong>แนวทางแก้ไข:</strong> {post.solutions||'-'}</p><p><strong>ผลสำเร็จ:</strong> {post.success||'-'}</p></Section>
    <section className="doc-worksheet-page doc-page-break"><h1 className="doc-worksheet-title">12. {p.worksheet?.title||`ใบงาน เรื่อง ${p.topic||'-'}`}</h1><p><strong>คำชี้แจง:</strong> {p.worksheet?.instructions||'-'}</p><ol className="doc-list doc-list-ordered">{questions.map((x,i)=><li key={i}>{x.question}<div>....................................................................................................</div></li>)}</ol></section>
    <section className="doc-worksheet-page doc-page-break"><h1 className="doc-worksheet-title">เฉลย — {p.worksheet?.title||p.topic}</h1><ol className="doc-list doc-list-ordered">{questions.map((x,i)=><li key={i}><strong>{x.question}</strong><p>{x.answer}</p></li>)}</ol></section>
    <footer className="text-center text-sm text-slate-500 mt-8 border-t pt-3">สร้างโดยระบบผู้ช่วยเขียนแผนการจัดการเรียนรู้ด้วย AI · พัฒนาโดย ครูโสภิตรา จิตชู</footer>
  </article>;
}
