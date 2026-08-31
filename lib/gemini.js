import { getModel } from "./config";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";

function extractJson(text) {
  const trimmed = (text || "").trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("ไม่พบ JSON ในคำตอบของ AI");
  return JSON.parse(candidate.slice(start, end + 1));
}

function ensureWorksheet(plan) {
  const p = plan || {};
  const worksheet = p.worksheet || {};
  const questions = (worksheet.questions || [])
    .filter((item) => String(item?.question || "").trim())
    .map((item) => ({
      question: String(item.question || "").trim(),
      answer: String(item.answer || "").trim() || "พิจารณาจากคำตอบและวิธีคิดของนักเรียน",
    }));

  const topic = p.topic || "เรื่องที่เรียน";
  const situation = p.problemSituation || {};
  const fallbacks = [
    {
      question: situation.problem || `อธิบายความรู้สำคัญจากเรื่อง ${topic}`,
      answer: situation.answer || p.keyConcept || "พิจารณาจากสาระสำคัญของบทเรียน",
    },
    {
      question: `สรุปสาระสำคัญของเรื่อง ${topic} ด้วยภาษาของตนเอง`,
      answer: p.keyConcept || p.content || "พิจารณาจากความถูกต้องและความครบถ้วนของคำตอบ",
    },
    {
      question: `ยกตัวอย่างการนำความรู้เรื่อง ${topic} ไปใช้ในสถานการณ์ใหม่ 1 ตัวอย่าง`,
      answer: "พิจารณาจากตัวอย่างที่สอดคล้องกับเนื้อหาและมีเหตุผลรองรับ",
    },
    {
      question: `อธิบายขั้นตอนหรือวิธีคิดในการแก้โจทย์เรื่อง ${topic}`,
      answer: (situation.solutionSteps || []).join(" ") || "พิจารณาจากลำดับขั้นที่ถูกต้องและตรวจสอบได้",
    },
    {
      question: `ตรวจสอบคำตอบของตนเองในเรื่อง ${topic} ได้อย่างไร พร้อมอธิบายเหตุผล`,
      answer: "ตรวจสอบความสอดคล้องของวิธีคิด คำตอบ และเงื่อนไขของโจทย์ พร้อมอธิบายเหตุผล",
    },
  ];

  for (const item of fallbacks) {
    if (questions.length >= 5) break;
    if (!questions.some((q) => q.question === item.question)) questions.push(item);
  }
  while (questions.length < 5) {
    const number = questions.length + 1;
    questions.push({
      question: `คำถามข้อที่ ${number} เรื่อง ${topic}: อธิบายแนวคิดและวิธีหาคำตอบ`,
      answer: "พิจารณาจากแนวคิด วิธีทำ และคำตอบที่สอดคล้องกับเนื้อหา",
    });
  }

  return {
    ...p,
    worksheet: {
      ...worksheet,
      title: worksheet.title || `แบบฝึกหัด เรื่อง ${topic}`,
      instructions: worksheet.instructions || "ให้นักเรียนตอบคำถามต่อไปนี้ พร้อมแสดงวิธีคิด",
      questions,
    },
  };
}

export async function generatePlan(form) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("ยังไม่ได้ตั้งค่า GEMINI_API_KEY");
    err.code = "NO_API_KEY";
    throw err;
  }

  const model = getModel();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: buildUserPrompt(form) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error?.message || `Gemini API ตอบกลับ ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("");
  if (!text) {
    const reason = data?.promptFeedback?.blockReason;
    throw new Error(reason ? `AI ปฏิเสธคำขอ: ${reason}` : "AI ไม่ได้ส่งข้อความกลับมา");
  }

  const plan = ensureWorksheet(extractJson(text));
  return {
    ...plan,
    planNumber: form.planNumber || plan.planNumber || "1",
    school: form.school || plan.school || "",
    teacher: form.teacher || plan.teacher || "",
    director: form.director || plan.director || "",
    subject: form.subject || plan.subject || "",
    grade: form.grade || plan.grade || "",
    teachingDate: form.teachingDate || plan.teachingDate || "",
    unit: form.unit || plan.unit || "",
    topic: form.topic || plan.topic || "",
    timeText: form.timeText || plan.timeText || "",
  };
}
