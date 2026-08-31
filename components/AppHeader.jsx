"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  }

  return (
    <header className="no-print sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-head font-semibold text-slate-800">
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">แผ</span>
          <span className="hidden sm:inline">ผู้ช่วยเขียนแผนการสอน</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link href="/dashboard" className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100">
            แผนของฉัน
          </Link>
          <Link
            href="/create"
            className="px-3 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-medium"
          >
            + สร้างแผนใหม่
          </Link>
          <button onClick={logout} className="px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100">
            ออกจากระบบ
          </button>
        </nav>
      </div>
    </header>
  );
}
