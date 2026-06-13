"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "teacher">("teacher");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/teacher");
      }
    }, 800);
  };

  const handleQuickLogin = (selectedRole: "admin" | "teacher") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/teacher");
      }
    }, 400);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-md py-xl">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[420px] z-10 flex flex-col gap-lg">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-sm">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-[28px]">school</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary tracking-tight">EduAttend</h2>
            <p className="text-xs text-on-surface-variant/70 font-semibold uppercase tracking-wider">
              Oakwood Academy • Absensi Presisi
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-outline-variant p-lg sm:p-xl shadow-md flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <h3 className="text-xl font-bold text-on-surface">Masuk ke Akun Anda</h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Masukkan kredensial NIP/Email untuk mengelola absensi.
            </p>
          </div>

          {/* Role Tab Selector */}
          <div className="flex bg-slate-100 p-[3px] rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-1.5 rounded-md font-bold text-xs transition-all ${
                role === "teacher"
                  ? "bg-white text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Guru / Dosen
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-1.5 rounded-md font-bold text-xs transition-all ${
                role === "admin"
                  ? "bg-white text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Administrator
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-md">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant" htmlFor="email-input">
                Email / Nomor Induk Pegawai (NIP)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
                  person
                </span>
                <input
                  id="email-input"
                  type="text"
                  required
                  placeholder={role === "teacher" ? "Masukkan NIP atau Email Guru..." : "admin@school.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white bg-slate-50/50 text-sm outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-on-surface-variant" htmlFor="password-input">
                  Kata Sandi
                </label>
                <Link href="#" className="text-xs text-primary hover:underline font-bold">
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
                  lock
                </span>
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white bg-slate-50/50 text-sm outline-none transition-all font-medium"
                />
              </div>
            </div>

            {error && <p className="text-xs text-error font-bold">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm py-2 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-sm disabled:opacity-75"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
              ) : (
                <>
                  <span>Masuk Sistem</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helpers */}
          <div className="pt-md border-t border-outline-variant flex flex-col gap-xs">
            <p className="text-[9px] text-center text-on-surface-variant/80 uppercase tracking-widest font-bold">
              Uji Coba Cepat (Quick Login)
            </p>
            <div className="grid grid-cols-2 gap-sm">
              <button
                onClick={() => handleQuickLogin("teacher")}
                disabled={isLoading}
                className="flex items-center justify-center gap-xs border border-outline-variant hover:border-primary px-sm py-2 rounded-lg text-xs font-bold bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-primary">fingerprint</span>
                <span>Masuk Guru</span>
              </button>
              <button
                onClick={() => handleQuickLogin("admin")}
                disabled={isLoading}
                className="flex items-center justify-center gap-xs border border-outline-variant hover:border-primary px-sm py-2 rounded-lg text-xs font-bold bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-primary">admin_panel_settings</span>
                <span>Masuk Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-center text-[10px] text-on-surface-variant/40 font-semibold">
          © 2026 EduAttend Pro. Hak Cipta Dilindungi.
        </p>
      </div>
    </main>
  );
}
