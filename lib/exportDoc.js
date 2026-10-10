import { formatThaiDate } from "./thaiDate";

function arabicDigits(value) {
  return String(value ?? "").replace(/[๐-๙]/g, (digit) =>
    String("๐๑๒๓๔๕๖๗๘๙".indexOf(digit))
  );
}

function esc(value) {
  return arabicDigits(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function list(items, ordered) {
  const values = (items || []).filter((item) => String(item || "").trim());
  if (!values.length) return "<p>-</p>";
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${values.map((item) => `<li>${esc(item)}</li>`).join("")}</${tag}>`;
}

function section(number, title, body) {
  return `<div class="section-title">${number}. ${title}</div><div class="section-body">${body}</div>`;
}

function recordResult(customValue, objective) {
  const custom = String(customValue || "").trim();
  if (custom) return custom;
  const source = String(objective || "").trim();
  if (!source) return "........................................................................................................................";
  return source.startsWith("นักเรียน") ? source : `นักเรียนสามารถ${source}`;
}

export function planToWordHtml(plan, logoDataUrl = "") {
  const p = plan || {};
  const is2568 = p.curriculumVersion === "2568";
  const standards = p.standards || p.standardsOld || {};
  const objectives = p.objectives || {};
  const situation = p.problemSituation || {};
  const record = p.postTeaching || {};

  const competencies = (p.competencies || [])
    .map((item) => `<li><b>${esc(item.name)}</b>${item.detail ? ` — ${esc(item.detail)}` : ""}</li>`)
    .join("");

  const activities = (p.activities || [])
    .map((item) => `<div class="activity-item">
      <p><b>ขั้น:</b> ${esc(item.phase)}<br><b>เวลา:</b> ${esc(item.time)}</p>
      <p><b>กิจกรรมการเรียนรู้:</b> ${esc(item.detail)}</p>
    </div>`)
    .join("");
  const evaluation = (p.evaluation || [])
    .map((item) => `<tr><td>${esc(item.dimension || "-")}</td><td>${esc(item.indicator || item.aspect)}</td><td>${esc(item.source || "-")}</td><td>${esc(item.method)}</td><td>${esc(item.tool)}</td><td>${esc(item.evidence || "-")}</td><td>${esc(item.criteria)}</td></tr>`)
    .join("");
  const characteristics = (p.desiredCharacteristics || []).map((x) => `<li><b>${esc(x.name)}</b>${x.behavior ? ` — ${esc(x.behavior)}` : ""}</li>`).join("");
  const tasks = list(p.tasks, false);
  const pisa = p.pisa?.enabled ? `<p><b>กระบวนการ:</b> ${esc((p.pisa.process || []).join(", "))}</p><p><b>เนื้อหา:</b> ${esc((p.pisa.content || []).join(", "))}</p><p><b>บริบท:</b> ${esc((p.pisa.context || []).join(", "))}</p><p>${esc(p.pisa.detail || "")}</p>` : "<p>ไม่ใช้ในแผนนี้</p>";
  const rubric = (p.rubric || []).map((x) => `<tr><td>${esc(x.level)}</td><td>${esc(x.label)}</td><td>${esc(x.descriptor)}</td></tr>`).join("");
  const worksheet = p.worksheet || {};
  const worksheetQuestions = (worksheet.questions || []).filter((item) => String(item?.question || "").trim());
  if (!worksheetQuestions.length) {
    worksheetQuestions.push({
      question: situation.problem || `อธิบายความรู้หรือวิธีคิดจากเรื่อง ${p.topic || "ที่เรียน"}`,
      answer: situation.answer || "พิจารณาจากคำตอบและวิธีคิดของนักเรียน",
    });
  }
  const worksheetItems = worksheetQuestions
    .map((item) => `<li><p>${esc(item.question)}</p><div class="answer-lines"><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span></div></li>`)
    .join("");
  const worksheetAnswers = worksheetQuestions
    .map((item) => `<li><p><b>โจทย์:</b> ${esc(item.question)}</p><p><b>เฉลย:</b> ${esc(item.answer || "พิจารณาจากคำตอบและวิธีคิดของนักเรียน")}</p></li>`)
    .join("");

  const logo = logoDataUrl
    ? `<img src="${logoDataUrl}" alt="ตราโรงเรียนวัดทุ่งจาน" width="78" height="78" />`
    : "";

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>แผนการจัดการเรียนรู้</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument>
</xml>
<![endif]-->
<style>
  @page Section1 { size: 595.3pt 841.9pt; margin: 72pt 72pt 72pt 72pt; mso-page-orientation: portrait; }
  div.Section1 { page: Section1; width: 100%; }
  html, body { margin: 0; padding: 0; }
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: "TH Sarabun New", "TH SarabunPSK", "Sarabun", sans-serif; font-size: 16pt; line-height: 1; color: #000; overflow-wrap: break-word; word-wrap: break-word; }
  p { margin: 0.5pt 0; }
  img { max-width: 100%; height: auto; }
  .masthead { margin-bottom: 3pt; text-align: center; }
  .masthead .seal { text-align: center; margin-bottom: 1pt; }
  .masthead-copy { margin: 0; padding: 0; text-align: center; }
  .masthead .seal img { width: 58pt; height: 58pt; }
  .title { text-align: center; font-size: 17pt; font-weight: bold; line-height: 1.1; }
  .school { text-align: center; font-size: 14pt; margin-top: 1pt; }
  .green-rule { border-top: 1.25pt solid #176b5a; margin: 3pt 0 4pt; }
  .plan-masthead .seal img { width: 54pt; height: 54pt; }
  .plan-masthead .title { font-size: 17pt; }
  .plan-masthead .school { font-size: 14pt; }
  .plan-header-meta { margin: 2pt 0 5pt; padding-bottom: 2pt; border-bottom: 0.75pt solid #777; font-size: 16pt; text-align: left; }
  .plan-header-meta p { margin: 0.5pt 0; }
  .section-title { border-left: 3pt solid #176b5a; background: #e8f0ec; padding: 1pt 4pt; margin: 4pt 0 1pt; font-size: 14pt; line-height: 1.1; font-weight: bold; page-break-after: avoid; }
  .section-body { padding: 0 1pt; line-height: 1.13; text-align: left; }
  .section-body ul, .section-body ol { margin: 1pt 0 1pt 16pt; padding-left: 8pt; }
  .section-body li { margin: 0; }
  .subtitle { font-weight: bold; margin-top: 2pt; }
  .data-list { margin: 2pt 0 3pt; }
  .activity-item, .evaluation-item { border-left: 1.5pt solid #777; padding: 1pt 4pt; margin: 2pt 0; }
  .activity-item p, .evaluation-item p { margin: 0.5pt 0; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 16pt; margin: 3pt 0; }
  th, td { border: 0.75pt solid #000; padding: 2pt 3pt; vertical-align: top; }
  th { background: #eee; font-weight: bold; text-align: center; }
  .signature { margin-top: 22pt; text-align: center; }
  .signature-person { display: block; width: 100%; margin-top: 8pt; text-align: center; font-size: 15pt; }
  .record-line { margin: 3pt 0; }
  .worksheet-page, .worksheet-page * { font-family: "TH SarabunPSK", "TH Sarabun New", "Sarabun", sans-serif; font-size: 16pt; }
  .worksheet-page { line-height: 1.3; }
  .worksheet-title { margin: 0 0 8pt; text-align: center; font-weight: bold; line-height: 1.2; }
  .worksheet-meta { width: 100%; border-bottom: 0.75pt solid #555; margin-bottom: 6pt; padding: 1pt 0 3pt; }
  .worksheet-list { margin: 5pt 0 0 22pt; padding: 0; }
  .worksheet-list li { margin: 0 0 8pt; padding-left: 3pt; }
  .worksheet-list p { margin: 1pt 0; }
  .answer-lines { width: 100%; line-height: 1.25; }
  .answer-lines span { display: block; width: 100%; height: 16pt; border-bottom: 0.5pt dotted #666; }
  .section-body, .post-block p, .record-line { overflow-wrap: anywhere; word-wrap: break-word; word-break: break-word; }
  .worksheet-answers li { margin-bottom: 6pt; }

  .post-page { font-size: 14pt; line-height: 1.18; }
  .post-page .seal img { width: 58pt; height: 58pt; }
  .post-page .title { font-size: 18pt; }
  .post-page .school { font-size: 15pt; }
  .post-page .green-rule { margin: 2pt 0 4pt; }
  .post-meta { margin-bottom: 4pt; padding: 2pt 0; border-top: 0.75pt solid #555; border-bottom: 0.75pt solid #555; font-size: 16pt; text-align: left; }
  .post-block { margin-top: 4pt; }
  .post-block-title { border-left: 4pt solid #176b5a; background: #e8f0ec; padding: 1.5pt 5pt; margin: 0 0 1pt; font-size: 14.5pt; font-weight: bold; page-break-after: avoid; }
  .post-block p { margin: 1pt 5pt; line-height: 1.15; text-align: left; }
  .post-page .signature { margin-top: 10pt; }
  .post-page .signature-person { padding: 0 7pt; font-size: 16pt; }
  .developer-footer { margin-top: 12pt; padding-top: 4pt; border-top: .5pt solid #aaa; text-align: center; font-size: 14pt; color: #555; }
  body, p, div, span, li { line-height: 1 !important; mso-line-height-rule: auto; }
</style>
</head>
<body>
<div class="Section1">
  <div class="masthead plan-masthead">
    <div class="seal">${logo}</div>
    <div class="masthead-copy">
      <div class="title">แผนการจัดการเรียนรู้ที่ ${esc(p.planNumber || "1")}</div>
      <div class="school">โรงเรียน${esc(p.school || "วัดทุ่งจาน")}</div>
    </div>
  </div>

  <div class="plan-header-meta">
    <p><b>หน่วยการเรียนรู้</b> ${esc(p.unit || "-")}</p>
    <p><b>เรื่อง</b> ${esc(p.topic || "-")}</p>
    <p><b>กลุ่มสาระการเรียนรู้</b> ${esc(p.subject || "-")}</p>
    <p><b>ชั้น</b> ${esc(p.grade || "-")}</p>
    <p><b>เวลา</b> ${esc(p.timeText || "-")}</p>
    <p><b>ผู้สอน</b> ${esc(p.teacher || "-")}</p>
    <p><b>วันที่สอน</b> ${esc(formatThaiDate(p.teachingDate))}</p>
  </div>

  ${!is2568 ? section(1, "มาตรฐานการเรียนรู้และตัวชี้วัด", `
    <p>${esc(standards.standard || "-")}</p>
    <p><b>ตัวชี้วัดระหว่างทาง:</b> ${esc(standards.indicatorMid || "-")}</p>
    <p><b>ตัวชี้วัดปลายทาง:</b> ${esc(standards.indicatorFinal || "-")}</p>
    <p><b>รหัส:</b> ${esc(standards.codes || "-")}</p>
  `) : section(1, "ผลลัพธ์การเรียนรู้ (หลักสูตร 2568)", `<p>${esc(p.learningOutcome || p.learningOutcomeNew || "-")}</p>`)}
  ${section(2, "สาระสำคัญ / ความคิดรวบยอด", `<p>${esc(p.keyConcept || "-")}</p>`)}
  ${section(3, `จุดประสงค์การเรียนรู้ (${is2568 ? "K-S-A" : "K-P-A"})`, `
    <ul>
      <li><b>ด้านความรู้ (K):</b> ${esc(objectives.knowledge || "-")}</li>
      <li><b>ด้าน${is2568 ? "ทักษะ (S)" : "ทักษะ/กระบวนการ (P)"}:</b> ${esc(objectives.skill || objectives.process || "-")}</li>
      <li><b>ด้านเจตคติ (A):</b> ${esc(objectives.attitude || "-")}</li>
    </ul>
  `)}
  ${!is2568 ? section(4, "สาระการเรียนรู้", `<p>${esc(p.learningContent || p.content || "-")}</p>`) : ""}
  ${section(is2568 ? 4 : 5, is2568 ? "สมรรถนะหลัก/สมรรถนะเฉพาะที่มุ่งพัฒนา" : "สมรรถนะสำคัญของผู้เรียน", `<ul>${competencies || "<li>-</li>"}</ul>`)}
  ${is2568 ? section(5, "สมรรถนะ PISA (Mathematical Literacy) ป.4-6", pisa) : ""}
  ${section(6, `คุณลักษณะอันพึงประสงค์${is2568 ? " (เลือกประเมิน)" : ""}`, `<ul>${characteristics || "<li>-</li>"}</ul>`)}
  ${section(7, `กิจกรรมการเรียนรู้${p.teachingModel ? ` (${esc(p.teachingModel)})` : ""}`, `
    <div class="data-list">${activities || "<p>-</p>"}</div>
  `)}
  ${section(8, "สื่อและแหล่งการเรียนรู้", list(p.media, false))}
  ${!is2568 ? section(9, "ชิ้นงาน/ภาระงาน", tasks) : ""}
  ${section(is2568 ? 9 : 10, "การวัดและประเมินผล", `
    <table><thead><tr><th>ด้าน</th><th>สิ่งที่ประเมิน</th><th>ที่มา</th><th>วิธี</th><th>เครื่องมือ</th><th>หลักฐาน</th><th>เกณฑ์</th></tr></thead><tbody>${evaluation || '<tr><td colspan="7">-</td></tr>'}</tbody></table>
  `)}
  ${is2568 ? section(10, "เกณฑ์การประเมินสมรรถนะ (4 ระดับ)", `<table><thead><tr><th>ระดับ</th><th>ชื่อระดับ</th><th>เกณฑ์เฉพาะงาน</th></tr></thead><tbody>${rubric || '<tr><td colspan="3">-</td></tr>'}</tbody></table>`) : ""}

  <div class="worksheet-page">
    <div class="worksheet-title">${esc(worksheet.title || `แบบฝึกหัด เรื่อง ${p.topic || "-"}`)}</div>
    <div class="worksheet-meta">
      <p>ชื่อ-สกุล .......................................................................</p>
      <p>ชั้น ${esc(p.grade || "...............")} เลขที่ ...............</p>
    </div>
    <p><b>คำชี้แจง:</b> ${esc(worksheet.instructions || "ให้นักเรียนตอบคำถามต่อไปนี้ พร้อมแสดงวิธีคิด")}</p>
    <ol class="worksheet-list">${worksheetItems}</ol>
  </div>

  <div class="worksheet-page">
    <div class="worksheet-title">เฉลย — ${esc(worksheet.title || `แบบฝึกหัด เรื่อง ${p.topic || "-"}`)}</div>
    <ol class="worksheet-list worksheet-answers">${worksheetAnswers}</ol>
  </div>

  <div class="post-page">
    <div class="masthead">
      <div class="seal">${logo}</div>
      <div class="masthead-copy">
        <div class="title">บันทึกหลังการจัดการเรียนรู้ (${is2568 ? "KSA" : "KPA"})</div>
        <div class="school">โรงเรียน${esc(p.school || "วัดทุ่งจาน")}</div>
      </div>
    </div>
    <div class="green-rule"></div>

    <div class="post-meta">
      <p><b>ครูผู้สอน</b> ${esc(p.teacher || "-")}</p>
      <p><b>รายวิชา</b> ${esc(p.subject || "-")}</p>
      <p><b>ชั้น</b> ${esc(p.grade || "-")}</p>
      <p><b>วันที่สอน</b> ${esc(formatThaiDate(p.teachingDate))}</p>
      <p><b>เรื่อง</b> ${esc(p.topic || "-")}</p>
    </div>

    <div class="post-block">
      <div class="post-block-title">K — ด้านความรู้ (Knowledge)</div>
      <p>${esc(recordResult(record.knowledge, objectives.knowledge))}</p>
    </div>
    <div class="post-block">
      <div class="post-block-title">${is2568 ? "S — ด้านทักษะ (Skills)" : "P — ด้านทักษะ/กระบวนการ (Process)"}</div>
      <p>${esc(recordResult(record.skill || record.process, objectives.skill || objectives.process))}</p>
    </div>
    <div class="post-block">
      <div class="post-block-title">A — ด้านเจตคติ (Attitude)</div>
      <p>${esc(recordResult(record.attitude, objectives.attitude))}</p>
    </div>
    <div class="post-block">
      <div class="post-block-title">ปัญหาและอุปสรรค</div>
      <p>${esc(record.problems || "........................................................................................................................")}</p>
    </div>
    <div class="post-block">
      <div class="post-block-title">แนวทางแก้ไขและพัฒนา</div>
      <p>${esc(record.solutions || "........................................................................................................................")}</p>
    </div>
    <div class="post-block">
      <div class="post-block-title">ผลสำเร็จของการจัดการเรียนรู้</div>
      <p>${esc(record.success || `การจัดการเรียนรู้เรื่อง ${p.topic || "ที่กำหนด"} สอดคล้องกับจุดประสงค์ด้านความรู้ ทักษะ/กระบวนการ และเจตคติ`)}</p>
    </div>

    <div class="signature">
      <div class="signature-person">ลงชื่อ ...................................................... ผู้สอน<br>( ${esc(p.teacher || "................................")} )<br>ครูผู้สอน</div>
      <div class="signature-person">ลงชื่อ ......................................................<br>( ${esc(p.director || "................................")} )<br>ผู้อำนวยการโรงเรียน${esc(p.school || "")}</div>
    </div>
  </div>
  <div class="developer-footer">สร้างโดยระบบผู้ช่วยเขียนแผนการจัดการเรียนรู้ด้วย AI · พัฒนาโดย ครูโสภิตรา จิตชู</div>
</div>
</body>
</html>`;
}

async function imageAsDataUrl(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) return "";
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

export async function downloadWord(plan) {
  const logoDataUrl = await imageAsDataUrl("/image1.png");
  const html = planToWordHtml(plan, logoDataUrl);
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const name = (plan?.topic || "แผนการสอน").replace(/[\\/:*?"<>|]/g, "_").slice(0, 60);
  link.href = url;
  link.download = `${name}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
