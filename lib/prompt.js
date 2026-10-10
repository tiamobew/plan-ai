const COMMON_SHAPE = `
  "planNumber": "เลขที่แผน", "school": "ชื่อโรงเรียน", "teacher": "ชื่อผู้สอน", "director": "ชื่อผู้อำนวยการ",
  "subject": "กลุ่มสาระ", "grade": "ระดับชั้น", "teachingDate": "YYYY-MM-DD", "timeText": "เวลา",
  "unit": "หน่วย", "topic": "เรื่อง", "teachingModel": "รูปแบบการสอน",
  "keyConcept": "สาระสำคัญ/ความคิดรวบยอด",
  "objectives": { "knowledge": "K", "skill": "P หรือ S", "attitude": "A" },
  "activities": [{ "phase": "ชื่อขั้น", "time": "เวลา", "detail": "บทบาทครู ผู้เรียน คำถาม และหลักฐาน" }],
  "media": ["สื่อและแหล่งเรียนรู้"],
  "evaluation": [{ "dimension": "K/P/A หรือ K/S/A", "indicator": "สิ่งที่ประเมิน", "source": "ที่มา", "method": "วิธี", "tool": "เครื่องมือ", "evidence": "หลักฐาน", "criteria": "เกณฑ์" }],
  "worksheet": { "title": "ชื่อใบงาน", "instructions": "คำชี้แจง", "questions": [{ "question": "โจทย์", "answer": "เฉลยพร้อมวิธีคิด" }] },
  "postTeaching": { "knowledge": "ผล K", "skill": "ผล P/S", "attitude": "ผล A", "problems": "ปัญหา", "solutions": "แนวทางแก้ไข", "success": "ผลสำเร็จ" }
`;

const SHAPE_2560 = `{ "curriculumVersion": "2560", ${COMMON_SHAPE},
  "standards": { "standard": "มาตรฐาน", "indicatorMid": "ตัวชี้วัดระหว่างทาง", "indicatorFinal": "ตัวชี้วัดปลายทาง", "codes": "รหัส" },
  "learningContent": "สาระการเรียนรู้",
  "competencies": [{ "name": "สมรรถนะสำคัญ", "detail": "พฤติกรรม" }],
  "desiredCharacteristics": [{ "name": "คุณลักษณะอันพึงประสงค์", "behavior": "พฤติกรรมบ่งชี้" }],
  "tasks": ["ชิ้นงาน/ภาระงาน"] }`;

const SHAPE_2568 = `{ "curriculumVersion": "2568", ${COMMON_SHAPE},
  "learningOutcome": "ผลลัพธ์การเรียนรู้ที่ประเมินได้",
  "competencies": [{ "type": "สมรรถนะหลักหรือเฉพาะ", "name": "ชื่อ", "detail": "พฤติกรรม" }],
  "pisa": { "enabled": true, "process": ["Formulate/Employ/Interpret and Evaluate"], "content": ["เนื้อหา"], "context": ["บริบท"], "detail": "การนำไปใช้" },
  "desiredCharacteristics": [{ "name": "คุณลักษณะที่เลือก", "behavior": "พฤติกรรม" }],
  "rubric": [{ "level": 4, "label": "เหนือความคาดหวัง", "descriptor": "เกณฑ์เฉพาะงาน" }, { "level": 3, "label": "ตามความคาดหวัง", "descriptor": "เกณฑ์เฉพาะงาน" }, { "level": 2, "label": "กำลังพัฒนา", "descriptor": "เกณฑ์เฉพาะงาน" }, { "level": 1, "label": "ต้องได้รับการส่งเสริม", "descriptor": "เกณฑ์เฉพาะงาน" }] }`;

export function buildSystemPrompt(form = {}) {
  const version = form.curriculumVersion === "2568" ? "2568" : "2560";
  const isNew = version === "2568";
  return `คุณเป็นผู้เชี่ยวชาญด้านการออกแบบแผนการจัดการเรียนรู้สำหรับครูไทย
สร้างแผนตามหลักสูตร ${version} เท่านั้น ห้ามนำหัวข้อของอีกหลักสูตรมาปะปน
- เขียนด้วยคุณภาพเทียบเท่าครูผู้มีประสบการณ์สอนรายวิชานั้นมากกว่า 10 ปี เข้าใจธรรมชาติรายวิชา พัฒนาการตามวัย และความเข้าใจคลาดเคลื่อนที่พบบ่อย
- ทุกส่วนต้องเชื่อมโยง ผลลัพธ์/มาตรฐาน → จุดประสงค์ → กิจกรรม → หลักฐาน → การประเมิน
- กิจกรรมใช้ PDCA แบบ ${form.pdcaSteps === "4" ? "4 ขั้น: Plan, Do, Check, Act" : "5 ขั้น: Plan, Do-Learn, Do-Practice, Check, Act"}
- ทุกขั้นระบุจุดประสงค์ เวลา บทบาทครู บทบาทผู้เรียน คำถามสำคัญ สื่อ วิธีตรวจความเข้าใจ หลักฐาน การช่วยผู้เรียนที่ต้องการความช่วยเหลือ และกิจกรรมต่อยอด เวลารวมต้องตรงกับเวลาสอน
- ขั้นสอนต้องมีสถานการณ์หรือตัวอย่างอย่างน้อย 1 ตัวอย่าง พร้อมข้อมูล สิ่งที่ต้องหา วิธีคิดทีละขั้น คำตอบ คำถามตรวจสอบ และข้อผิดพลาดที่นักเรียนอาจพบ
- ห้ามเขียนเพียงคำกว้าง ๆ เช่น "ครูอธิบาย" โดยไม่มีรายละเอียดที่ครูนำไปสอนได้จริง
- สร้างใบงานอย่างน้อย 5 ข้อ พร้อมเฉลยและวิธีคิด
- บันทึกหลังสอนต้องวิเคราะห์จุดเด่น จุดพัฒนา ปัญหา สาเหตุ แนวทางแก้ไข และข้อเสนอแนะครั้งต่อไปอย่างเป็นมืออาชีพ
- ห้ามแต่งจำนวนผู้เรียน คะแนน ร้อยละ หรือข้อเท็จจริงที่ไม่ได้รับจากผู้ใช้ หากไม่มีข้อมูลให้ใช้ช่องว่าง ........
- ใช้เลขอารบิก 0-9 ภาษาไทยทางการ และตอบเป็น JSON เท่านั้น
${isNew ? `- ใช้ K-S-A โดย S คือ Skills
- PISA ใช้เฉพาะคณิตศาสตร์ ป.4-6 นอกเงื่อนไขให้ enabled=false และรายการว่าง
- ประเมิน K จากผลลัพธ์/สาระสำคัญ, S จากสมรรถนะและ PISA, A จากคุณลักษณะที่เลือก
- rubric 4 ระดับต้องเป็นเกณฑ์เฉพาะงาน
- บันทึกหลังสอนใช้ K-S-A` : `- ใช้ K-P-A โดย P คือทักษะ/กระบวนการ
- ประเมิน K จากสาระการเรียนรู้, P จากสมรรถนะสำคัญ, A จากคุณลักษณะอันพึงประสงค์
- บันทึกหลังสอนใช้ K-P-A`}
JSON ต้องตรงตามโครงสร้างนี้: ${isNew ? SHAPE_2568 : SHAPE_2560}`;
}

export function buildUserPrompt(form) {
  return [
    `สร้างแผนหลักสูตร ${form.curriculumVersion || "2560"}`,
    `เลขที่แผน: ${form.planNumber || "1"}`, `โรงเรียน: ${form.school || "-"}`, `ผู้สอน: ${form.teacher || "-"}`,
    `ผู้อำนวยการ: ${form.director || "-"}`, `กลุ่มสาระ: ${form.subject || "-"}`, `ระดับชั้น: ${form.grade || "-"}`,
    `วันที่สอน: ${form.teachingDate || "-"}`, `หน่วย: ${form.unit || "-"}`, `เรื่อง: ${form.topic || "-"}`,
    `เวลา: ${form.timeText || "1 ชั่วโมง"}`, `รูปแบบการสอน: ${form.teachingModel || "ให้ AI เลือก"}`, `กระบวนการ PDCA: ${form.pdcaSteps || "5"} ขั้น`,
    form.standard ? `ข้อมูลอ้างอิง: ${form.standard}` : "", form.notes ? `บริบทเพิ่มเติม: ${form.notes}` : "",
    form.postTeachingNotes ? `ข้อมูลหลังสอน: ${form.postTeachingNotes}` : "", "ตอบเป็น JSON เท่านั้น",
  ].filter(Boolean).join("\n");
}
