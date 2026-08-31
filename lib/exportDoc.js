import { formatThaiDate } from "./thaiDate";

function esc(value) {
  return String(value ?? "")
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
  const standards = p.standardsOld || {};
  const objectives = p.objectives || {};
  const situation = p.problemSituation || {};
  const record = p.postTeaching || {};

  const competencies = (p.competencies || [])
    .map((item) => `<li><b>${esc(item.name)}</b>${item.detail ? ` — ${esc(item.detail)}` : ""}</li>`)
    .join("");

  const activities = (p.activities || [])
    .map((item) => `<tr>
      <td style="width:26%"><b>${esc(item.phase)}</b></td>
      <td style="width:13%;text-align:center">${esc(item.time)}</td>
      <td>${esc(item.detail)}</td>
    </tr>`)
    .join("");

  const evaluation = (p.evaluation || [])
    .map((item) => `<tr>
      <td>${esc(item.aspect)}</td>
      <td>${esc(item.method)}</td>
      <td>${esc(item.tool)}</td>
      <td>${esc(item.criteria)}</td>
    </tr>`)
    .join("");

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
  body { font-family: "TH Sarabun New", "TH SarabunPSK", "Sarabun", sans-serif; font-size: 13.5pt; line-height: 1.15; color: #000; overflow-wrap: break-word; word-wrap: break-word; }
  p { margin: 0.5pt 0; }
  table { border-collapse: collapse; width: 100%; max-width: 100%; table-layout: fixed; }
  td, th { overflow-wrap: anywhere; word-wrap: break-word; }
  img { max-width: 100%; height: auto; }
  .masthead td { border: 0; vertical-align: middle; padding: 0; }
  .masthead .seal { width: 62pt; text-align: center; }
  .masthead .spacer { width: 62pt; }
  .masthead .seal img { width: 58pt; height: 58pt; }
  .title { text-align: center; font-size: 17pt; font-weight: bold; line-height: 1.1; }
  .school { text-align: center; font-size: 14pt; margin-top: 1pt; }
  .green-rule { border-top: 1.25pt solid #176b5a; margin: 3pt 0 4pt; }
  .meta { border: 0.75pt solid #555; margin-bottom: 4pt; }
  .meta td { border: 0; width: 50%; padding: 1pt 5pt; font-size: 12.5pt; line-height: 1.1; vertical-align: top; }
  .plan-masthead { margin-bottom: 2pt; }
  .plan-masthead .seal { width: 62pt; }
  .plan-masthead .spacer { width: 62pt; }
  .plan-masthead .seal img { width: 54pt; height: 54pt; }
  .plan-masthead .title { font-size: 17pt; }
  .plan-masthead .school { font-size: 14pt; }
  .plan-header-meta { margin: 2pt 0 5pt; }
  .plan-header-meta td { border: 0; width: 50%; padding: 0; font-size: 13.5pt; line-height: 1.18; vertical-align: top; }
  .plan-header-meta td:first-child { padding-right: 22pt; }
  .plan-header-meta td:last-child { padding-left: 22pt; }
  .plan-header-meta p { margin: 0.5pt 0; }
  .section-title { border-left: 3pt solid #176b5a; background: #e8f0ec; padding: 1pt 4pt; margin: 4pt 0 1pt; font-size: 14pt; line-height: 1.1; font-weight: bold; page-break-after: avoid; }
  .section-body { padding: 0 1pt; line-height: 1.13; text-align: justify; }
  .section-body ul, .section-body ol { margin: 1pt 0 1pt 16pt; padding-left: 8pt; }
  .section-body li { margin: 0; }
  .subtitle { font-weight: bold; margin-top: 2pt; }
  .data { margin: 2pt 0 3pt; }
  .data th, .data td { border: 0.75pt solid #777; padding: 2pt 3pt; font-size: 11.5pt; line-height: 1.08; vertical-align: top; }
  .data th { background: #e8f0ec; text-align: center; font-weight: bold; }
  .signature { margin-top: 22pt; page-break-inside: avoid; }
  .signature td { border: 0; width: 50%; text-align: center; padding: 0 10pt; font-size: 15pt; vertical-align: top; }
  .record-line { margin: 3pt 0; }
  .worksheet-page, .worksheet-page * { font-family: "TH SarabunPSK", "TH Sarabun New", "Sarabun", sans-serif; font-size: 16pt; }
  .worksheet-page { page-break-before: always; line-height: 1.3; }
  .worksheet-title { margin: 0 0 8pt; text-align: center; font-weight: bold; line-height: 1.2; }
  .worksheet-meta { width: 100%; border-bottom: 0.75pt solid #555; margin-bottom: 6pt; }
  .worksheet-meta td { border: 0; padding: 1pt 0 3pt; width: 50%; }
  .worksheet-meta td:last-child { text-align: right; }
  .worksheet-list { margin: 5pt 0 0 22pt; padding: 0; }
  .worksheet-list li { margin: 0 0 8pt; padding-left: 3pt; page-break-inside: avoid; }
  .worksheet-list p { margin: 1pt 0; }
  .answer-lines { width: 100%; line-height: 1.25; }
  .answer-lines span { display: block; width: 100%; height: 16pt; border-bottom: 0.5pt dotted #666; }
  .section-body, .post-block p, .record-line { overflow-wrap: anywhere; word-wrap: break-word; word-break: break-word; }
  .worksheet-answers li { margin-bottom: 6pt; }

  .post-page { page-break-before: always; font-size: 14pt; line-height: 1.18; }
  .post-page .masthead { margin-bottom: 2pt; }
  .post-page .seal img { width: 58pt; height: 58pt; }
  .post-page .title { font-size: 18pt; }
  .post-page .school { font-size: 15pt; }
  .post-page .green-rule { margin: 2pt 0 4pt; }
  .post-meta { border: 0.75pt solid #555; margin-bottom: 4pt; }
  .post-meta td { border: 0; width: 50%; padding: 1pt 5pt; font-size: 13.5pt; vertical-align: top; }
  .post-block { margin-top: 4pt; }
  .post-block-title { border-left: 4pt solid #176b5a; background: #e8f0ec; padding: 1.5pt 5pt; margin: 0 0 1pt; font-size: 14.5pt; font-weight: bold; page-break-after: avoid; }
  .post-block p { margin: 1pt 5pt; line-height: 1.15; text-align: justify; }
  .post-page .signature { margin-top: 10pt; }
  .post-page .signature td { padding: 0 7pt; font-size: 13.5pt; }
</style>
</head>
<body>
<div class="Section1">
  <table class="masthead plan-masthead">
    <tr>
      <td class="seal">${logo}</td>
      <td>
        <div class="title">แผนการจัดการเรียนรู้ที่ ${esc(p.planNumber || "1")}</div>
        <div class="school">โรงเรียน${esc(p.school || "วัดทุ่งจาน")}</div>
      </td>
      <td class="spacer"></td>
    </tr>
  </table>

  <table class="plan-header-meta">
    <tr>
      <td>
        <p><b>หน่วยการเรียนรู้</b> ${esc(p.unit || "-")}</p>
        <p><b>กลุ่มสาระการเรียนรู้</b> ${esc(p.subject || "-")}</p>
        <p><b>เวลา</b> ${esc(p.timeText || "-")}</p>
        <p><b>วันที่สอน</b> ${esc(formatThaiDate(p.teachingDate))}</p>
      </td>
      <td>
        <p><b>เรื่อง</b> ${esc(p.topic || "-")}</p>
        <p><b>ชั้น</b> ${esc(p.grade || "-")}</p>
        <p><b>ผู้สอน</b> ${esc(p.teacher || "-")}</p>
      </td>
    </tr>
  </table>

  ${section(1, "มาตรฐานการเรียนรู้ / ตัวชี้วัด", `
    <p>${esc(standards.standard || "-")}</p>
    <p><b>ตัวชี้วัดระหว่างทาง:</b> ${esc(standards.indicatorMid || "-")}</p>
    <p><b>ตัวชี้วัดปลายทาง:</b> ${esc(standards.indicatorFinal || "-")}</p>
  `)}

  ${section(2, "ผลลัพธ์การเรียนรู้ (หลักสูตรใหม่ 2568)", `<p>${esc(p.learningOutcomeNew || "-")}</p>`)}

  ${section(3, "สมรรถนะที่มุ่งพัฒนา", `<ul>${competencies || "<li>-</li>"}</ul>`)}

  ${section(4, "สาระสำคัญ / ความคิดรวบยอด", `<p>${esc(p.keyConcept || "-")}</p>`)}

  ${section(5, "จุดประสงค์การเรียนรู้", `
    <ul>
      <li><b>ด้านความรู้ (K):</b> ${esc(objectives.knowledge || "-")}</li>
      <li><b>ด้านทักษะ/กระบวนการ (P):</b> ${esc(objectives.process || "-")}</li>
      <li><b>ด้านเจตคติ (A):</b> ${esc(objectives.attitude || "-")}</li>
    </ul>
  `)}

  ${section(6, "สาระการเรียนรู้", `<p>${esc(p.content || "-")}</p>`)}

  ${section(7, "ตัวอย่างสถานการณ์ปัญหา", `
    <p><b>โจทย์:</b> ${esc(situation.problem || "-")}</p>
    <p class="subtitle">แนวคิด/แผนภาพช่วยคิด</p>
    ${list(situation.barModel, false)}
    <p class="subtitle">แนวคิดการหาคำตอบ</p>
    ${list(situation.solutionSteps, true)}
    ${situation.answer ? `<p><b>${esc(situation.answer)}</b></p>` : ""}
  `)}

  ${section(8, `กิจกรรมการเรียนรู้${p.teachingModel ? ` (${esc(p.teachingModel)})` : ""}`, `
    <table class="data">
      <thead><tr><th style="width:26%">ขั้น</th><th style="width:13%">เวลา</th><th>กิจกรรมการเรียนรู้</th></tr></thead>
      <tbody>${activities}</tbody>
    </table>
  `)}

  ${section(9, "สื่อและแหล่งการเรียนรู้", list(p.media, false))}

  ${section(10, "การวัดและประเมินผล", `
    <table class="data">
      <thead><tr><th>สิ่งที่วัด</th><th>วิธีการวัด</th><th>เครื่องมือ</th><th>เกณฑ์การประเมิน</th></tr></thead>
      <tbody>${evaluation}</tbody>
    </table>
  `)}

  <div class="worksheet-page">
    <div class="worksheet-title">${esc(worksheet.title || `แบบฝึกหัด เรื่อง ${p.topic || "-"}`)}</div>
    <table class="worksheet-meta">
      <tr>
        <td>ชื่อ-สกุล .......................................................................</td>
        <td>ชั้น ${esc(p.grade || "...............")} เลขที่ ...............</td>
      </tr>
    </table>
    <p><b>คำชี้แจง:</b> ${esc(worksheet.instructions || "ให้นักเรียนตอบคำถามต่อไปนี้ พร้อมแสดงวิธีคิด")}</p>
    <ol class="worksheet-list">${worksheetItems}</ol>
  </div>

  <div class="worksheet-page">
    <div class="worksheet-title">เฉลย — ${esc(worksheet.title || `แบบฝึกหัด เรื่อง ${p.topic || "-"}`)}</div>
    <ol class="worksheet-list worksheet-answers">${worksheetAnswers}</ol>
  </div>

  <div class="post-page">
    <table class="masthead">
      <tr>
        <td class="seal">${logo}</td>
        <td>
          <div class="title">บันทึกหลังการจัดการเรียนรู้ (KPA)</div>
          <div class="school">โรงเรียน${esc(p.school || "วัดทุ่งจาน")}</div>
        </td>
        <td class="spacer"></td>
      </tr>
    </table>
    <div class="green-rule"></div>

    <table class="post-meta">
      <tr><td><b>ครูผู้สอน</b> ${esc(p.teacher || "-")}</td><td><b>รายวิชา</b> ${esc(p.subject || "-")}</td></tr>
      <tr><td><b>ชั้น</b> ${esc(p.grade || "-")}</td><td><b>วันที่สอน</b> ${esc(formatThaiDate(p.teachingDate))}</td></tr>
      <tr><td colspan="2"><b>เรื่อง</b> ${esc(p.topic || "-")}</td></tr>
    </table>

    <div class="post-block">
      <div class="post-block-title">K — ด้านความรู้ (Knowledge)</div>
      <p>${esc(recordResult(record.knowledge, objectives.knowledge))}</p>
    </div>
    <div class="post-block">
      <div class="post-block-title">P — ด้านทักษะ/กระบวนการ (Process)</div>
      <p>${esc(recordResult(record.process, objectives.process))}</p>
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

    <table class="signature">
      <tr>
        <td>ลงชื่อ ...................................................... ผู้สอน<br>( ${esc(p.teacher || "................................")} )<br>ครูผู้สอน</td>
        <td>ลงชื่อ ......................................................<br>( ${esc(p.director || "................................")} )<br>ผู้อำนวยการโรงเรียน${esc(p.school || "")}</td>
      </tr>
    </table>
  </div>
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
