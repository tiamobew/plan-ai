# 📚 ผู้ช่วยเขียนแผนการจัดการเรียนรู้ด้วย AI

โปรแกรมเว็บช่วยครูร่าง **แผนการจัดการเรียนรู้ (Lesson Plan)** ครบทั้ง 11 หัวข้อ
ด้วย **Google Gemini AI** — กรอกข้อมูลไม่กี่ช่อง AI ร่างแผนให้ทั้งฉบับ
แก้ไขได้ทุกช่อง บันทึกเก็บไว้ ดาวน์โหลดเป็น Word หรือสั่งพิมพ์เป็น PDF ได้ทันที

> **เทคโนโลยี:** Next.js (App Router) · Supabase (ฐานข้อมูล) · Vercel (โฮสต์) · Gemini API

รหัสเข้าใช้งานเริ่มต้น: **`044357246`** (เปลี่ยนได้ที่ตัวแปร `APP_ACCESS_CODE`)

---

## 🧩 โครงสร้างแผนที่ระบบสร้างให้ (ตามตัวอย่าง)

1. มาตรฐานการเรียนรู้ / ตัวชี้วัด
2. ผลลัพธ์การเรียนรู้ (หลักสูตรใหม่ 2568)
3. สมรรถนะที่มุ่งพัฒนา
4. สาระสำคัญ / ความคิดรวบยอด
5. จุดประสงค์การเรียนรู้ (K / P / A)
6. สาระการเรียนรู้
7. ตัวอย่างสถานการณ์ปัญหา (พร้อมแนวคิด/บาร์โมเดล และวิธีทำ)
8. กิจกรรมการเรียนรู้ (ตารางตามรูปแบบการสอน เช่น WAT + PDCA)
9. สื่อและแหล่งการเรียนรู้
10. การวัดและประเมินผล (ตาราง)
11. บันทึกหลังการจัดการเรียนรู้

---

## 🚀 ติดตั้งและนำขึ้นออนไลน์ (สำหรับผู้มีบัญชี Supabase + Vercel แล้ว)

### ขั้นที่ 1 — เตรียมฐานข้อมูล Supabase
1. เข้า [supabase.com](https://supabase.com) → เปิดโปรเจกต์ (หรือสร้างใหม่)
2. เมนูซ้าย → **SQL Editor** → **New query**
3. คัดลอกทั้งหมดจากไฟล์ [`supabase/schema.sql`](supabase/schema.sql) ไปวาง แล้วกด **Run**
4. ไปที่ **Project Settings → API** จดค่า 2 อย่างไว้:
   - **Project URL** → ใช้เป็น `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (กดปุ่ม *reveal*) → ใช้เป็น `SUPABASE_SERVICE_ROLE_KEY`
     > ⚠️ service_role เป็นคีย์ลับ ห้ามเผยแพร่ ใช้เฉพาะฝั่งเซิร์ฟเวอร์เท่านั้น

### ขั้นที่ 2 — ขอ API Key ของ Gemini
1. เข้า [Google AI Studio](https://aistudio.google.com/app/apikey) → **Create API key**
2. คัดลอกคีย์ไว้ใช้เป็น `GEMINI_API_KEY`

### ขั้นที่ 3 — นำโค้ดขึ้น Vercel
1. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub (หรือใช้ Vercel CLI)
2. เข้า [vercel.com](https://vercel.com) → **Add New… → Project** → เลือก repo นี้
3. หน้า **Environment Variables** ใส่ค่าต่อไปนี้ (ดูตัวอย่างใน [`.env.example`](.env.example)):

   | ชื่อตัวแปร | ค่า |
   |---|---|
   | `APP_ACCESS_CODE` | `044357246` (หรือรหัสที่ต้องการ) |
   | `GEMINI_API_KEY` | API key จาก Google AI Studio |
   | `GEMINI_MODEL` | `gemini-3.1-flash-lite` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` |

4. กด **Deploy** — เสร็จแล้วจะได้ลิงก์เว็บใช้งานได้ทันที

---

## 💻 ทดลองรันในเครื่อง (ถ้าต้องการ)

ต้องมี **Node.js 18 ขึ้นไป** ก่อน

```bash
# 1) คัดลอกค่าตัวอย่างแล้วแก้เป็นค่าจริง
cp .env.example .env.local

# 2) ติดตั้งแพ็กเกจ
npm install

# 3) รัน
npm run dev
```

เปิด http://localhost:3000 → กรอกรหัสเข้าใช้งาน

---

## 🖨️ การดาวน์โหลด/พิมพ์
- **ดาวน์โหลด Word** — ได้ไฟล์ `.doc` เปิดแก้ไขต่อใน Microsoft Word ได้
- **พิมพ์ / PDF** — กดปุ่มพิมพ์ แล้วเลือกปลายทางเป็น "Save as PDF" (ระบบซ่อนปุ่มต่าง ๆ ให้อัตโนมัติเวลาพิมพ์)

---

## ❓ ปัญหาที่พบบ่อย
- **กดสร้างแผนแล้วขึ้นว่ายังไม่ได้ตั้งค่า API key** → ตรวจว่าใส่ `GEMINI_API_KEY` ใน Vercel แล้ว และกด **Redeploy**
- **บันทึกแผนไม่ได้ / ขึ้นเตือน Supabase** → ตรวจ `NEXT_PUBLIC_SUPABASE_URL` และ `SUPABASE_SERVICE_ROLE_KEY` และรัน `schema.sql` แล้วหรือยัง
- **อยากได้แผนละเอียดขึ้น** → เปลี่ยน `GEMINI_MODEL` เป็นรุ่น Gemini Flash ที่บัญชีรองรับ
- **ลืมรหัสเข้าใช้งาน** → ดู/เปลี่ยนที่ตัวแปร `APP_ACCESS_CODE` ใน Vercel

---

*หมายเหตุ: เมื่อเปลี่ยนค่า Environment Variables ใน Vercel ทุกครั้ง ต้องกด Redeploy จึงจะมีผล*

