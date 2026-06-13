"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface SidebarProps {
  role: "admin" | "teacher";
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Close sidebar on path changes (e.g. user clicks link on mobile)
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const adminLinks = [
    { href: "/admin", label: "Dashboard Ringkasan", icon: "dashboard" },
    { href: "/admin/corrections", label: "Koreksi Absensi", icon: "edit_square" },
    { href: "/admin/reports", label: "Laporan & Analitik", icon: "bar_chart" },
    { href: "/admin/settings", label: "Pengaturan Geofence", icon: "settings" },
  ];

  const teacherLinks = [
    { href: "/teacher", label: "Dashboard Anda", icon: "dashboard" },
    { href: "/teacher/check-in", label: "Check In / Check Out", icon: "fingerprint" },
    { href: "/teacher/history", label: "Riwayat Kehadiran", icon: "history" },
    { href: "/teacher/correction", label: "Ajukan Koreksi", icon: "edit_square" },
  ];

  const links = role === "admin" ? adminLinks : teacherLinks;
  const portalName = role === "admin" ? "Portal Admin" : "Portal Guru";

  return (
    <>
      {/* Drawer Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-outline-variant flex flex-col p-md z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Identity */}
        <div className="flex items-center justify-between mb-xl">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-sm shadow-primary/10">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">EduAttend</h1>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider opacity-80">{portalName}</p>
            </div>
          </div>
          {/* Close button for Mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-100 rounded-full text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-md px-md py-sm transition-all duration-200 rounded-xl font-label-md text-label-md font-semibold ${
                  isActive
                    ? "bg-primary/5 text-primary border-l-4 border-primary shadow-xs"
                    : "text-on-surface-variant hover:bg-slate-50 hover:text-on-surface"
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? "text-primary" : "text-on-surface-variant"}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="mt-auto flex flex-col gap-md pt-md border-t border-outline-variant">
          {role === "admin" && (
            <Link
              href="/admin/settings"
              className="bg-primary text-on-primary py-sm px-md rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm shadow-sm hover:bg-primary-container transition-all font-bold"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              <span>Konfigurasi Sistem</span>
            </Link>
          )}
          <div className="flex flex-col gap-1">
            <Link
              href="#"
              className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-slate-50 rounded-xl font-label-md text-label-md font-semibold"
            >
              <span className="material-symbols-outlined">help</span>
              <span>Pusat Bantuan</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-md px-md py-sm text-rose-600 hover:bg-rose-50 rounded-xl font-label-md text-label-md font-bold w-full text-left"
            >
              <span className="material-symbols-outlined text-rose-600">logout</span>
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
