"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RecentLog {
  day: string;
  timeText: string;
  status: "Normal" | "Tepat Waktu" | "Toleransi";
  statusClass: string;
}

export default function TeacherCheckIn() {
  const [loading, setLoading] = useState(true);
  const [digitalTime, setDigitalTime] = useState("");
  const [dateString, setDateString] = useState("");
  const [checkInState, setCheckInState] = useState<"ready" | "loading" | "done">("ready");
  const [checkedInTime, setCheckedInTime] = useState("");
  const [checkoutActive, setCheckoutActive] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };
  
  // Real Geolocation values simulation
  const [lat] = useState("-6.2088");
  const [lng] = useState("106.8456");
  const [distance] = useState("12"); // 12 meters

  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([
    { day: "Kemarin", timeText: "Check-out sukses pada 03:32 PM", status: "Normal", statusClass: "badge-success" },
    { day: "Kemarin", timeText: "Check-in tercatat pada 08:28 AM", status: "Tepat Waktu", statusClass: "badge-success" },
    { day: "Sen, 23 Okt", timeText: "Check-in pada 08:42 AM (toleransi grace 12m digunakan)", status: "Toleransi", statusClass: "badge-warning" },
  ]);

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setDigitalTime(`${hours}:${minutes}:${seconds}`);

      const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
      setDateString(now.toLocaleDateString("id-ID", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated mount loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckIn = () => {
    if (checkInState !== "ready") return;
    setCheckInState("loading");

    setTimeout(() => {
      const now = new Date();
      const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      setCheckedInTime(formattedTime);
      setCheckInState("done");
      setCheckoutActive(true);

      // Prepend to logs
      setRecentLogs((prev) => [
        { day: "Hari Ini", timeText: `Check-in tercatat pada ${formattedTime}`, status: "Tepat Waktu", statusClass: "badge-success" },
        ...prev,
      ]);
    }, 1200);
  };

  const handleCheckOut = () => {
    if (!checkoutActive) return;
    const now = new Date();
    const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    setCheckoutActive(false);
    setCheckInState("ready");
    showToast(`Berhasil melakukan Check-Out pada ${formattedTime}. Selesai bertugas!`);

    // Prepend to logs
    setRecentLogs((prev) => [
      { day: "Hari Ini", timeText: `Check-out sukses pada ${formattedTime}`, status: "Normal", statusClass: "badge-neutral" },
      ...prev,
    ]);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full animate-pulse">
        <div className="h-16 bg-slate-200/50 rounded-xl mb-md"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg h-56">
          <div className="lg:col-span-2 bg-slate-200/50 rounded-xl"></div>
          <div className="bg-slate-200/50 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg h-48 mt-md">
          <div className="bg-slate-200/50 rounded-2xl"></div>
          <div className="bg-slate-200/50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-primary tracking-tight mb-xs">Check-In / Out Absensi</h2>
        <p className="text-xs text-on-surface-variant font-medium">
          Silakan verifikasi geofence GPS Anda untuk mencatat kehadiran masuk atau keluar shift mengajar Anda.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Real-time Clock & GPS Geofence */}
        <div className="flex-grow flex flex-col gap-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Real-time Clock */}
            <div className="bg-white rounded-xl border border-outline-variant p-xl flex flex-col justify-center items-center relative overflow-hidden shadow-xs group">
              <div className="absolute top-0 right-0 p-md">
                <span className="material-symbols-outlined text-primary-fixed-dim text-4xl opacity-20 group-hover:scale-110 transition-transform">
                  schedule
                </span>
              </div>
              <div className="font-display-lg text-[48px] leading-tight font-bold text-on-background tabular-nums">
                {digitalTime || "08:42:15"}
              </div>
              <div className="text-sm font-bold text-on-surface-variant mt-2">
                {dateString || "Selasa, 24 Okt 2023"}
              </div>
            </div>

            {/* GPS Live Geofence Status */}
            <div className="bg-white rounded-xl border border-outline-variant p-xl flex flex-col shadow-xs">
              <div className="flex items-center justify-between mb-sm">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-[10px] font-bold text-on-surface uppercase tracking-wider">Status Live GPS</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[10px]">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-slow"></div>
                  <span className="font-bold text-emerald-700">GPS Aktif</span>
                </div>
              </div>
              <div className="flex-grow flex flex-col justify-center gap-sm">
                <div className="flex items-center justify-between p-sm bg-slate-50 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-md">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Lokasi Kampus Sesuai</p>
                      <p className="text-[9px] text-on-surface-variant font-semibold">Kampus Utama Oakwood Academy</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                </div>

                <div className="flex items-center justify-between p-sm bg-white rounded-lg border border-outline-variant">
                  <div className="flex items-center gap-md">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-on-surface-variant shrink-0">
                      <span className="material-symbols-outlined text-base">radar</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Jarak ke Pusat Geofence</p>
                      <p className="text-[9px] text-on-surface-variant font-semibold">Koordinat Anda: {lat}, {lng}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">{distance} meter</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shift Details & Geofence Map */}
        <div className="w-full lg:w-[320px] flex flex-col gap-lg shrink-0">
          <div className="bg-primary text-on-primary rounded-xl p-md shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[80px]">badge</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-80 mb-sm">Detail Sesi Kerja</p>
            <h3 className="text-sm font-bold mb-md">Morning Shift (Pagi)</h3>
            <div className="space-y-sm text-xs font-semibold">
              <div className="flex justify-between">
                <span className="opacity-70">Jam Mulai Shift:</span>
                <span>07:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Jam Selesai Shift:</span>
                <span>03:30 PM</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-xs">
            <div className="p-sm bg-slate-50 border-b border-outline-variant flex items-center justify-between">
              <span className="text-[10px] font-bold text-on-surface uppercase tracking-wider">Simulasi Radar Geofence</span>
            </div>
            <div className="h-[100px] bg-slate-50 relative">
              <img
                alt="Peta Mini"
                className="w-full h-full object-cover opacity-50"
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="relative w-5 h-5 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Primary Buttons Check-in/out */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-stretch">
        {/* Check-In Button */}
        <button
          onClick={handleCheckIn}
          disabled={checkInState !== "ready"}
          className={`group relative flex flex-col items-center justify-center p-lg h-52 bg-white border-2 rounded-2xl shadow-xs transition-all duration-300 overflow-hidden outline-none ${
            checkInState === "ready"
              ? "border-emerald-500 hover:bg-emerald-50/20 cursor-pointer"
              : "border-outline-variant opacity-75 cursor-not-allowed"
          }`}
        >
          {checkInState === "ready" && (
            <>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
              <div className="mb-sm p-4 bg-emerald-50 rounded-full text-emerald-700 border border-emerald-100 group-hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  login
                </span>
              </div>
              <h3 className="text-base font-bold text-on-background mb-xs">Check In</h3>
              <p className="text-emerald-700 font-bold text-xs">Absen Masuk</p>
              <div className="mt-md flex items-center gap-xs px-3 py-0.5 bg-emerald-50/50 rounded-full border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase">
                <span className="material-symbols-outlined text-xs">lock_open</span>
                <span>Terverifikasi</span>
              </div>
            </>
          )}

          {checkInState === "loading" && (
            <div className="flex flex-col items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-[48px] text-emerald-500 animate-spin">sync</span>
              <h3 className="text-sm font-bold mt-4 text-on-surface">Memverifikasi Geofence...</h3>
              <p className="text-[10px] text-on-surface-variant mt-1 font-semibold">Menguji kesesuaian koordinat...</p>
            </div>
          )}

          {checkInState === "done" && (
            <>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-outline-variant"></div>
              <div className="mb-sm p-4 bg-slate-100 rounded-full text-on-surface-variant">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h3 className="text-base font-bold text-on-surface-variant mb-xs">Checked In</h3>
              <p className="text-on-surface-variant font-bold text-xs">Aktif sejak pukul {checkedInTime}</p>
            </>
          )}
        </button>

        {/* Check-Out Button */}
        <button
          onClick={handleCheckOut}
          disabled={!checkoutActive}
          className={`group relative flex flex-col items-center justify-center p-lg h-52 bg-white border-2 rounded-2xl shadow-xs transition-all duration-300 overflow-hidden outline-none ${
            checkoutActive
              ? "border-rose-500 hover:bg-rose-50/20 cursor-pointer"
              : "border-outline-variant opacity-60 cursor-not-allowed"
          }`}
        >
          {checkoutActive ? (
            <>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>
              <div className="mb-sm p-4 bg-rose-50 rounded-full text-rose-700 border border-rose-100 group-hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-[36px]">logout</span>
              </div>
              <h3 className="text-base font-bold text-on-background mb-xs">Check Out</h3>
              <p className="text-rose-700 font-bold text-xs">Sesi giliran kerja aktif</p>
              <div className="mt-md flex items-center gap-xs px-3 py-0.5 bg-rose-50/50 rounded-full border border-rose-100 text-[10px] font-bold text-rose-700 uppercase">
                <span className="material-symbols-outlined text-xs">alarm</span>
                <span>Shift Berjalan</span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-sm p-4 bg-slate-100 rounded-full text-on-surface-variant">
                <span className="material-symbols-outlined text-[36px]">lock</span>
              </div>
              <h3 className="text-base font-bold text-on-surface-variant mb-xs">Check Out</h3>
              <p className="text-on-surface-variant font-bold text-xs">Check-in terlebih dahulu</p>
              <div className="mt-md flex items-center gap-xs px-3 py-0.5 bg-slate-100 rounded-full border border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase">
                <span className="material-symbols-outlined text-xs">lock</span>
                <span>Terkunci</span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Recent Log Table */}
      <section className="bg-white rounded-xl border border-outline-variant p-lg shadow-xs">
        <div className="flex justify-between items-center mb-md">
          <h4 className="text-sm font-bold text-on-surface">Log Aktivitas Terbaru Anda</h4>
          <Link href="/teacher/history" className="text-primary font-bold text-xs hover:underline">
            Lihat Semua Riwayat
          </Link>
        </div>
        <div className="space-y-sm">
          {recentLogs.map((log, index) => (
            <div key={index} className="flex items-center gap-md p-sm hover:bg-slate-50/50 transition-colors rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"></span>
              <span className="text-xs font-bold w-24">{log.day}</span>
              <span className="text-xs text-on-surface-variant flex-grow font-medium">{log.timeText}</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${log.statusClass}`}>{log.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[999] bg-white border border-outline-variant rounded-xl p-md shadow-lg flex items-center gap-sm animate-[fadeIn_0.2s_ease-out] max-w-sm">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === "success" 
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
              : toast.type === "error" 
              ? "bg-rose-50 text-rose-600 border border-rose-100" 
              : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}>
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface">{toast.message}</p>
          <button 
            type="button" 
            onClick={() => setToast(null)}
            className="text-on-surface-variant hover:text-on-surface ml-auto shrink-0"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
