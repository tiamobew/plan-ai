"use client";

import { formatThaiDate } from "@/lib/thaiDate";

const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2 text-[15px] focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none";
function Label({ children }) { return <label className="block text-sm font-medium text-slate-700 mb-1">{children}</label>; }
function Input({ value, onChange, placeholder, type = "text" }) { return <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />; }
function Area({ value, onChange, placeholder, rows = 3 }) { return <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${inputClass} leading-6`} />; }
function Card({ title, note, children }) { return <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><h3 className="font-head font-semibold text-slate-800">{title}</h3>{note && <p className="text-xs text-slate-500 mt-1 mb-3">{note}</p>}<div className="space-y-3 mt-3">{children}</div></section>; }

function StringList({ items = [], onChange, placeholder }) {
  return <div className="space-y-2">{items.map((item, i) => <div className="flex gap-2" key={i}><Input value={item} onChange={(v) => onChange(items.map((x, n) => n === i ? v : x))} placeholder={placeholder}/><button type="button" onClick={() => onChange(items.filter((_, n) => n !== i))} className="px-3 text-red-500">✕</button></div>)}<button type="button" onClick={() => onChange([...items, ""])} className="text-sm text-brand-600 font-medium">+ เพิ่มรายการ</button></div>;
}

export default function PlanEditor({ plan, onChange }) {
  const p = plan || {};
  const is2568 = p.curriculumVersion === "2568";
  const set = (key, value) => onChange({ ...p, [key]: value });
  const setNested = (key, subkey, value) => set(key, { ...(p[key] || {}), [subkey]: value });
  const setObjectItem = (key, i, field, value) => set(key, (p[key] || []).map((x, n) => n === i ? { ...x, [field]: value } : x));
  const remove = (key, i) => set(key, (p[key] || []).filter((_, n) => n !== i));
  const objectives = p.objectives || {};

  return <div className="space-y-4">
    <Card title={`ข้อมูลหัวกระดาษ — หลักสูตร ${p.curriculumVersion || "2560"}`}>
      <div className="grid sm:grid-cols-2 gap-3">
        {[['planNumber','เลขที่แผน'],['timeText','เวลา'],['school','โรงเรียน'],['teacher','ผู้สอน'],['director','ผู้อำนวยการ'],['subject','กลุ่มสาระ'],['grade','ระดับชั้น'],['unit','หน่วยการเรียนรู้'],['topic','เรื่อง'],['teachingModel','รูปแบบการสอน']].map(([key,label]) => <div key={key}><Label>{label}</Label><Input value={p[key]} onChange={(v) => set(key,v)}/></div>)}
        <div><Label>วันที่สอน</Label><Input type="date" value={p.teachingDate} onChange={(v) => set('teachingDate',v)}/><p className="text-xs text-slate-500 mt-1">{formatThaiDate(p.teachingDate)}</p></div>
      </div>
    </Card>

    {!is2568 ? <>
      <Card title="1. มาตรฐานการเรียนรู้และตัวชี้วัด"><Area value={p.standards?.standard || p.standardsOld?.standard} onChange={(v) => setNested('standards','standard',v)} placeholder="มาตรฐานการเรียนรู้"/><Area value={p.standards?.indicatorMid || p.standardsOld?.indicatorMid} onChange={(v) => setNested('standards','indicatorMid',v)} placeholder="ตัวชี้วัดระหว่างทาง"/><Area value={p.standards?.indicatorFinal || p.standardsOld?.indicatorFinal} onChange={(v) => setNested('standards','indicatorFinal',v)} placeholder="ตัวชี้วัดปลายทาง"/><Input value={p.standards?.codes} onChange={(v) => setNested('standards','codes',v)} placeholder="รหัสตัวชี้วัด"/></Card>
      <Card title="2. สาระสำคัญ/ความคิดรวบยอด"><Area value={p.keyConcept} onChange={(v) => set('keyConcept',v)}/></Card>
      <Card title="3. จุดประสงค์การเรียนรู้ (K-P-A)"><Area value={objectives.knowledge} onChange={(v) => setNested('objectives','knowledge',v)} placeholder="K — ความรู้"/><Area value={objectives.skill || objectives.process} onChange={(v) => setNested('objectives','skill',v)} placeholder="P — ทักษะ/กระบวนการ"/><Area value={objectives.attitude} onChange={(v) => setNested('objectives','attitude',v)} placeholder="A — เจตคติ"/></Card>
      <Card title="4. สาระการเรียนรู้"><Area value={p.learningContent || p.content} onChange={(v) => set('learningContent',v)}/></Card>
    </> : <>
      <Card title="1. ผลลัพธ์การเรียนรู้ (หลักสูตร 2568)"><Area value={p.learningOutcome || p.learningOutcomeNew} onChange={(v) => set('learningOutcome',v)}/></Card>
      <Card title="2. สาระสำคัญ/ความคิดรวบยอด"><Area value={p.keyConcept} onChange={(v) => set('keyConcept',v)}/></Card>
      <Card title="3. จุดประสงค์การเรียนรู้ (K-S-A)"><Area value={objectives.knowledge} onChange={(v) => setNested('objectives','knowledge',v)} placeholder="K — Knowledge"/><Area value={objectives.skill || objectives.process} onChange={(v) => setNested('objectives','skill',v)} placeholder="S — Skills"/><Area value={objectives.attitude} onChange={(v) => setNested('objectives','attitude',v)} placeholder="A — Attitude/Attribute"/></Card>
    </>}

    <Card title={`${is2568 ? '4' : '5'}. ${is2568 ? 'สมรรถนะหลัก/สมรรถนะเฉพาะที่มุ่งพัฒนา' : 'สมรรถนะสำคัญของผู้เรียน'}`}>
      {(p.competencies || []).map((item,i) => <div key={i} className="rounded-lg bg-slate-50 p-3 space-y-2">{is2568 && <Input value={item.type} onChange={(v) => setObjectItem('competencies',i,'type',v)} placeholder="ประเภท: สมรรถนะหลัก/สมรรถนะเฉพาะ"/>}<Input value={item.name} onChange={(v) => setObjectItem('competencies',i,'name',v)} placeholder="ชื่อสมรรถนะ"/><Area value={item.detail} onChange={(v) => setObjectItem('competencies',i,'detail',v)} placeholder="พฤติกรรมบ่งชี้"/><button type="button" onClick={() => remove('competencies',i)} className="text-sm text-red-500">ลบ</button></div>)}
      <button type="button" onClick={() => set('competencies',[...(p.competencies||[]),{type:'',name:'',detail:''}])} className="text-sm text-brand-600 font-medium">+ เพิ่มสมรรถนะ</button>
    </Card>

    {is2568 && <Card title="5. สมรรถนะ PISA (Mathematical Literacy) ป.4-6" note="ใช้เฉพาะวิชาคณิตศาสตร์ ระดับ ป.4-6"><label className="flex gap-2"><input type="checkbox" checked={!!p.pisa?.enabled} onChange={(e) => setNested('pisa','enabled',e.target.checked)}/> ใช้สมรรถนะ PISA ในแผนนี้</label><StringList items={p.pisa?.process || []} onChange={(v) => setNested('pisa','process',v)} placeholder="กระบวนการ: Formulate / Employ / Interpret and Evaluate"/><StringList items={p.pisa?.content || []} onChange={(v) => setNested('pisa','content',v)} placeholder="เนื้อหาทางคณิตศาสตร์"/><StringList items={p.pisa?.context || []} onChange={(v) => setNested('pisa','context',v)} placeholder="บริบทสถานการณ์"/><Area value={p.pisa?.detail} onChange={(v) => setNested('pisa','detail',v)} placeholder="การนำไปใช้ในกิจกรรม"/></Card>}

    <Card title={`${is2568 ? '6' : '6'}. คุณลักษณะอันพึงประสงค์${is2568 ? ' (เลือกประเมิน)' : ''}`}>
      {(p.desiredCharacteristics || []).map((item,i) => <div key={i} className="grid sm:grid-cols-[1fr_2fr_auto] gap-2"><Input value={item.name} onChange={(v) => setObjectItem('desiredCharacteristics',i,'name',v)} placeholder="คุณลักษณะ"/><Input value={item.behavior} onChange={(v) => setObjectItem('desiredCharacteristics',i,'behavior',v)} placeholder="พฤติกรรมบ่งชี้"/><button type="button" onClick={() => remove('desiredCharacteristics',i)} className="px-2 text-red-500">✕</button></div>)}
      <button type="button" onClick={() => set('desiredCharacteristics',[...(p.desiredCharacteristics||[]),{name:'',behavior:''}])} className="text-sm text-brand-600 font-medium">+ เพิ่มคุณลักษณะ</button>
    </Card>

    <Card title="7. กิจกรรมการเรียนรู้">{(p.activities||[]).map((item,i) => <div key={i} className="rounded-lg bg-slate-50 p-3 space-y-2"><div className="grid sm:grid-cols-[2fr_1fr_auto] gap-2"><Input value={item.phase} onChange={(v) => setObjectItem('activities',i,'phase',v)} placeholder="ชื่อขั้น"/><Input value={item.time} onChange={(v) => setObjectItem('activities',i,'time',v)} placeholder="เวลา"/><button type="button" onClick={() => remove('activities',i)} className="text-red-500">✕</button></div><Area value={item.detail} onChange={(v) => setObjectItem('activities',i,'detail',v)} placeholder="บทบาทครู ผู้เรียน คำถาม และหลักฐาน"/></div>)}<button type="button" onClick={() => set('activities',[...(p.activities||[]),{phase:'',time:'',detail:''}])} className="text-sm text-brand-600 font-medium">+ เพิ่มขั้นกิจกรรม</button></Card>
    <Card title="8. สื่อและแหล่งเรียนรู้"><StringList items={p.media||[]} onChange={(v) => set('media',v)} placeholder="สื่อหรือแหล่งเรียนรู้"/></Card>
    {!is2568 && <Card title="9. ชิ้นงาน/ภาระงาน"><StringList items={p.tasks||[]} onChange={(v) => set('tasks',v)} placeholder="ชิ้นงานหรือภาระงาน"/></Card>}
    <Card title={`${is2568 ? '9' : '10'}. การวัดและประเมินผล`} note={is2568 ? 'K จากผลลัพธ์/สาระสำคัญ, S จากสมรรถนะและ PISA, A จากคุณลักษณะ' : 'K จากสาระการเรียนรู้, P จากสมรรถนะสำคัญ, A จากคุณลักษณะ'}>{(p.evaluation||[]).map((item,i) => <div key={i} className="rounded-lg bg-slate-50 p-3 grid sm:grid-cols-2 gap-2">{['dimension','indicator','source','method','tool','evidence','criteria'].map((field) => <Input key={field} value={item[field] || (field==='indicator' ? item.aspect : '')} onChange={(v) => setObjectItem('evaluation',i,field,v)} placeholder={({dimension:'ด้าน K/P/S/A',indicator:'สิ่งที่ประเมิน',source:'ที่มาของการประเมิน',method:'วิธีประเมิน',tool:'เครื่องมือ',evidence:'หลักฐาน',criteria:'เกณฑ์ผ่าน'})[field]}/>)}<button type="button" onClick={() => remove('evaluation',i)} className="text-left text-sm text-red-500">ลบรายการ</button></div>)}<button type="button" onClick={() => set('evaluation',[...(p.evaluation||[]),{dimension:'',indicator:'',source:'',method:'',tool:'',evidence:'',criteria:''}])} className="text-sm text-brand-600 font-medium">+ เพิ่มรายการประเมิน</button></Card>
    {is2568 && <Card title="10. เกณฑ์การประเมินสมรรถนะ (4 ระดับ)">{(p.rubric||[]).map((item,i) => <div key={i} className="grid sm:grid-cols-[90px_1fr_2fr] gap-2"><Input value={item.level} onChange={(v) => setObjectItem('rubric',i,'level',v)} placeholder="ระดับ"/><Input value={item.label} onChange={(v) => setObjectItem('rubric',i,'label',v)} placeholder="ชื่อระดับ"/><Input value={item.descriptor} onChange={(v) => setObjectItem('rubric',i,'descriptor',v)} placeholder="เกณฑ์เฉพาะงาน"/></div>)}</Card>}
    <Card title={`11. บันทึกหลังการสอน (${is2568 ? 'K-S-A' : 'K-P-A'})`}><Area value={p.postTeaching?.knowledge} onChange={(v) => setNested('postTeaching','knowledge',v)} placeholder="ผลด้าน K"/><Area value={p.postTeaching?.skill || p.postTeaching?.process} onChange={(v) => setNested('postTeaching','skill',v)} placeholder={`ผลด้าน ${is2568 ? 'S' : 'P'}`}/><Area value={p.postTeaching?.attitude} onChange={(v) => setNested('postTeaching','attitude',v)} placeholder="ผลด้าน A"/><Area value={p.postTeaching?.problems} onChange={(v) => setNested('postTeaching','problems',v)} placeholder="ปัญหาและอุปสรรค"/><Area value={p.postTeaching?.solutions} onChange={(v) => setNested('postTeaching','solutions',v)} placeholder="แนวทางแก้ไข"/><Area value={p.postTeaching?.success} onChange={(v) => setNested('postTeaching','success',v)} placeholder="ผลสำเร็จ"/></Card>
    <Card title="12. ใบงานพร้อมเฉลย"><Input value={p.worksheet?.title} onChange={(v) => setNested('worksheet','title',v)} placeholder="ชื่อใบงาน"/><Area value={p.worksheet?.instructions} onChange={(v) => setNested('worksheet','instructions',v)} placeholder="คำชี้แจง"/>{(p.worksheet?.questions||[]).map((item,i) => <div key={i} className="rounded-lg bg-slate-50 p-3 space-y-2"><Area value={item.question} onChange={(v) => setNested('worksheet','questions',(p.worksheet.questions||[]).map((x,n)=>n===i?{...x,question:v}:x))} placeholder={`ข้อ ${i+1}`}/><Area value={item.answer} onChange={(v) => setNested('worksheet','questions',(p.worksheet.questions||[]).map((x,n)=>n===i?{...x,answer:v}:x))} placeholder="เฉลยและวิธีคิด"/></div>)}</Card>
  </div>;
}
