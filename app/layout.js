import "./globals.css";

export const metadata = {
  title: "ผู้ช่วยเขียนแผนการจัดการเรียนรู้ด้วย AI",
  description:
    "ระบบสร้างแผนการจัดการเรียนรู้ด้วย AI รองรับหลักสูตร 2560 และ 2568 พัฒนาโดย ครูโสภิตรา จิตชู",
  authors: [{ name: "ครูโสภิตรา จิตชู" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
