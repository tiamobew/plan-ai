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
          maxOutputTokens: 6000,
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

  const plan = extractJson(text);
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
