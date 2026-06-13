"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  role: "admin" | "teacher";
  onMenuClick?: () => void;
}

import { useState, useEffect } from "react";

export default function Header({ role, onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const [profileName, setProfileName] = useState(role === "admin" ? "Admin Jane" : "Dr. Sarah Jenkins");
  const [profileSub, setProfileSub] = useState(role === "admin" ? "Administrator Utama" : "Guru Senior / Dosen");

  const avatarUrl =
    role === "admin"
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
      : "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120";

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setProfileName(user.name);
        setProfileSub(user.position || (user.role === "ADMIN" ? "Administrator Utama" : "Guru"));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);


  return (
    <header className="sticky top-0 z-40 w-full h-16 px-md sm:px-lg bg-white/80 backdrop-blur-md flex justify-between items-center border-b border-outline-variant shadow-xs lg:ml-[280px] lg:w-[calc(100%-280px)]">
      {/* Mobile Hamburger Menu & Search */}
      <div className="flex items-center gap-sm sm:gap-md flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-on-surface-variant"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="hidden sm:flex items-center gap-md bg-slate-50 px-md py-[6px] rounded-full border border-outline-variant focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
          <span className="material-symbols-outlined text-on-surface-variant/60 text-lg">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-xs w-48 lg:w-64 outline-none placeholder:text-on-surface-variant/40 font-semibold"
            placeholder={role === "admin" ? "Cari guru, departemen..." : "Cari riwayat kehadiran..."}
            type="text"
          />
        </div>
      </div>

      {/* Tabs & Utilities */}
      <div className="flex items-center gap-md sm:gap-lg">
        {/* Navigation Tabs */}
        <nav className="hidden md:flex gap-md mr-lg">
          <Link
            href={role === "admin" ? "/admin" : "/teacher"}
            className={`pb-1 font-label-sm text-xs font-bold transition-all ${
              pathname === "/admin" || pathname === "/teacher"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Ringkasan
          </Link>
          <Link
            href={role === "admin" ? "/admin/corrections" : "/teacher/history"}
            className={`pb-1 font-label-sm text-xs font-bold transition-all ${
              pathname === "/admin/corrections" || pathname === "/teacher/history"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Riwayat
          </Link>
          <Link
            href={role === "admin" ? "/admin/reports" : "/teacher/correction"}
            className={`pb-1 font-label-sm text-xs font-bold transition-all ${
              pathname === "/admin/reports" || pathname === "/teacher/correction"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Analitik
          </Link>
        </nav>

        {/* Notifications & Help Buttons */}
        <div className="flex items-center gap-sm sm:gap-md">
          <button className="text-on-surface-variant hover:text-primary transition-colors relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
          
          <button className="hidden sm:flex text-on-surface-variant hover:text-primary transition-colors w-10 h-10 items-center justify-center rounded-full hover:bg-slate-50">
            <span className="material-symbols-outlined">help_outline</span>
          </button>

          <div className="h-6 w-px bg-outline-variant"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-xs sm:gap-sm cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="font-label-sm text-xs font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                {profileName}
              </p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">
                {profileSub}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-primary-fixed overflow-hidden ring-offset-2 group-hover:ring-2 group-hover:ring-primary transition-all">
              <img
                alt="Profile Avatar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                src={avatarUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
