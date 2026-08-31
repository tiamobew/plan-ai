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
  @page Section1 { size: 595.3pt 841.9pt; margin: 50pt 45pt 50pt 45pt; }
  div.Section1 { page: Section1; }
  body { font-family: "TH Sarabun New", "TH SarabunPSK", "Sarabun", sans-serif; font-size: 16pt; line-height: 1.35; color: #000; }
  p { margin: 2pt 0; }
  table { border-collapse: collapse; width: 100%; }
  .masthead td { border: 0; vertical-align: middle; padding: 0; }
  .masthead .seal { width: 82pt; text-align: center; }
  .masthead .spacer { width: 82pt; }
  .title { text-align: center; font-size: 20pt; font-weight: bold; line-height: 1.15; }
  .school { text-align: center; font-size: 17pt; margin-top: 2pt; }
  .green-rule { border-top: 1.5pt solid #176b5a; margin: 6pt 0 8pt; }
  .meta { border: 0.75pt solid #555; margin-bottom: 10pt; }
  .meta td { border: 0; width: 50%; padding: 1.5pt 7pt; font-size: 15pt; vertical-align: top; }
  .section-title { border-left: 4pt solid #176b5a; background: #e8f0ec; padding: 2.5pt 6pt; margin: 10pt 0 4pt; font-size: 16.5pt; font-weight: bold; page-break-after: avoid; }
  .section-body { padding: 0 3pt; text-align: justify; }
  .section-body ul, .section-body ol { margin: 2pt 0 2pt 20pt; padding-left: 10pt; }
  .section-body li { margin: 1pt 0; }
  .subtitle { font-weight: bold; margin-top: 5pt; }
  .data { margin: 4pt 0 8pt; }
  .data th, .data td { border: 0.75pt solid #777; padding: 4pt 5pt; font-size: 14pt; line-height: 1.25; vertical-align: top; }
  .data th { background: #e8f0ec; text-align: center; font-weight: bold; }
  .signature { margin-top: 22pt; page-break-inside: avoid; }
  .signature td { border: 0; width: 50%; text-align: center; padding: 0 10pt; font-size: 15pt; vertical-align: top; }
  .record-line { margin: 3pt 0; }
  .post-page { page-break-before: always; }
  .post-meta { border: 0.75pt solid #555; margin-bottom: 8pt; }
  .post-meta td { border: 0; width: 50%; padding: 1.5pt 7pt; font-size: 15pt; vertical-align: top; }
  .post-block { margin-top: 8pt; }
  .post-block-title { border-left: 4pt solid #176b5a; background: #e8f0ec; padding: 2.5pt 6pt; margin: 0 0 3pt; font-size: 16.5pt; font-weight: bold; page-break-after: avoid; }
  .post-block p { margin: 2pt 7pt; text-align: justify; }
</style>
</head>
<body>
<div class="Section1">
  <table class="masthead">
    <tr>
      <td class="seal">${logo}</td>
      <td>
        <div class="title">แผนการจัดการเรียนรู้ที่ ${esc(p.planNumber || "1")}</div>
        <div class="school">โรงเรียน${esc(p.school || "วัดทุ่งจาน")}</div>
      </td>
      <td class="spacer"></td>
    </tr>
  </table>
  <div class="green-rule"></div>

  <table class="meta">
    <tr><td><b>หน่วยการเรียนรู้</b> ${esc(p.unit || "-")}</td><td><b>เรื่อง</b> ${esc(p.topic || "-")}</td></tr>
    <tr><td><b>กลุ่มสาระการเรียนรู้</b> ${esc(p.subject || "-")}</td><td><b>ชั้น</b> ${esc(p.grade || "-")}</td></tr>
    <tr><td><b>เวลา</b> ${esc(p.timeText || "-")}</td><td><b>ผู้สอน</b> ${esc(p.teacher || "-")}</td></tr>
    <tr><td><b>วันที่สอน</b> ${esc(formatThaiDate(p.teachingDate))}</td><td><b>ผู้อำนวยการโรงเรียน</b> ${esc(p.director || "-")}</td></tr>
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
      ${record.problems ? "" : "<p>........................................................................................................................</p>"}
    </div>
    <div class="post-block">
      <div class="post-block-title">แนวทางแก้ไขและพัฒนา</div>
      <p>${esc(record.solutions || "........................................................................................................................")}</p>
      ${record.solutions ? "" : "<p>........................................................................................................................</p>"}
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
