import { formatThaiDate } from "./thaiDate";

// สร้างไฟล์ Word (.doc) จากข้อมูลแผน โดยไม่ต้องพึ่งไลบรารีภายนอก
// ใช้วิธีสร้าง HTML ที่ Word เปิดได้ แล้วดาวน์โหลดเป็น .doc

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function list(items, ordered) {
  const arr = (items || []).filter((x) => String(x || "").trim());
  if (!arr.length) return "<p>-</p>";
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${arr.map((i) => `<li>${esc(i)}</li>`).join("")}</${tag}>`;
}

export function planToWordHtml(plan) {
  const p = plan || {};
  const comp = (p.competencies || [])
    .map((c) => `<li><b>${esc(c.name)}</b> — ${esc(c.detail)}</li>`)
    .join("");
  const acts = (p.activities || [])
    .map(
      (a) => `<tr>
        <td style="width:26%;vertical-align:top"><b>${esc(a.phase)}</b></td>
        <td style="width:12%;vertical-align:top;text-align:center">${esc(a.time)}</td>
        <td style="vertical-align:top">${esc(a.detail)}</td>
      </tr>`
    )
    .join("");
  const evals = (p.evaluation || [])
    .map(
      (e) => `<tr>
        <td style="vertical-align:top">${esc(e.aspect)}</td>
        <td style="vertical-align:top">${esc(e.method)}</td>
        <td style="vertical-align:top">${esc(e.tool)}</td>
        <td style="vertical-align:top">${esc(e.criteria)}</td>
      </tr>`
    )
    .join("");
  const so = p.standardsOld || {};
  const ob = p.objectives || {};
  const ps = p.problemSituation || {};

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>แผนการจัดการเรียนรู้</title>
<style>
  body { font-family: "TH Sarabun New", "Sarabun", sans-serif; font-size: 16pt; color:#000; }
  h1 { font-size: 18pt; text-align:center; }
  h2 { font-size: 16pt; margin: 14pt 0 4pt; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #000; padding: 4pt 6pt; font-size: 15pt; vertical-align: top; }
  .head td { border: none; padding: 1pt 0; }
  ul, ol { margin: 2pt 0 2pt 18pt; }
  .muted { color:#333; }
</style>
</head>
<body>
  <h1>แผนการจัดการเรียนรู้ที่ ${esc(p.planNumber || "1")}</h1>
  <table class="head">
    <tr><td>หน่วยการเรียนรู้ ${esc(p.unit)}</td><td>เรื่อง ${esc(p.topic)}</td></tr>
    <tr><td>กลุ่มสาระการเรียนรู้${esc(p.subject)} ชั้น${esc(p.grade)}</td><td>เวลา ${esc(p.timeText)}</td></tr>
    <tr><td>โรงเรียน ${esc(p.school)}</td><td>ผู้สอน ${esc(p.teacher)}</td></tr>
    <tr><td>ผู้อำนวยการโรงเรียน ${esc(p.director)}</td><td>วันที่สอน ${esc(formatThaiDate(p.teachingDate))}</td></tr>
  </table>

  <h2>1. มาตรฐานการเรียนรู้ / ตัวชี้วัด</h2>
  <p>${esc(so.standard)}</p>
  <p><b>ตัวชี้วัดระหว่างทาง</b> ${esc(so.indicatorMid)}</p>
  <p><b>ตัวชี้วัดปลายทาง</b> ${esc(so.indicatorFinal)}</p>

  <h2>2. ผลลัพธ์การเรียนรู้ (หลักสูตรใหม่ 2568)</h2>
  <p>${esc(p.learningOutcomeNew)}</p>

  <h2>3. สมรรถนะที่มุ่งพัฒนา</h2>
  <ul>${comp || "<li>-</li>"}</ul>

  <h2>4. สาระสำคัญ / ความคิดรวบยอด</h2>
  <p>${esc(p.keyConcept)}</p>

  <h2>5. จุดประสงค์การเรียนรู้</h2>
  <ul>
    <li><b>ด้านความรู้ (K):</b> ${esc(ob.knowledge)}</li>
    <li><b>ด้านทักษะ (P):</b> ${esc(ob.process)}</li>
    <li><b>ด้านเจตคติ (A):</b> ${esc(ob.attitude)}</li>
  </ul>

  <h2>6. สาระการเรียนรู้</h2>
  <p>${esc(p.content)}</p>

  <h2>7. ตัวอย่างสถานการณ์ปัญหา</h2>
  <p><b>โจทย์:</b> ${esc(ps.problem)}</p>
  <p><b>แนวคิด/แผนภาพช่วยคิด</b></p>
  ${list(ps.barModel, false)}
  <p><b>แนวคิดการหาคำตอบ</b></p>
  ${list(ps.solutionSteps, true)}
  <p><b>${esc(ps.answer)}</b></p>

  <h2>8. กิจกรรมการเรียนรู้ ${p.teachingModel ? "(" + esc(p.teachingModel) + ")" : ""}</h2>
  <table>
    <tr><th style="width:26%">ขั้น</th><th style="width:12%">เวลา</th><th>กิจกรรมการเรียนรู้</th></tr>
    ${acts}
  </table>

  <h2>9. สื่อและแหล่งการเรียนรู้</h2>
  ${list(p.media, false)}

  <h2>10. การวัดและประเมินผล</h2>
  <table>
    <tr><th>สิ่งที่วัด</th><th>วิธีการวัด</th><th>เครื่องมือ</th><th>เกณฑ์การประเมิน</th></tr>
    ${evals}
  </table>

  <h2>11. บันทึกหลังการจัดการเรียนรู้</h2>
  <p>ผลการจัดการเรียนรู้ ..................................................................................................................</p>
  <p>ปัญหา/อุปสรรค ..........................................................................................................................</p>
  <p>แนวทางแก้ไข/ข้อเสนอแนะ ......................................................................................................</p>
  <br/>
  <table class="head">
    <tr>
      <td style="text-align:center">ลงชื่อ .......................................................... ผู้สอน<br/>( ${esc(p.teacher)} )</td>
      <td style="text-align:center">ลงชื่อ .......................................................... ผู้อำนวยการโรงเรียน<br/>( ${esc(p.director)} )</td>
    </tr>
  </table>
</body>
</html>`;
}

export function downloadWord(plan) {
  const html = planToWordHtml(plan);
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const name = (plan?.topic || "แผนการสอน").replace(/[\\/:*?"<>|]/g, "_").slice(0, 60);
  a.href = url;
  a.download = `${name}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
