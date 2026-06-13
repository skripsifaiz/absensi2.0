"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HistoryLog {
  date: string;
  status: "Hadir" | "Terlambat" | "Izin" | "Alpa";
  checkIn: string;
  checkOut: string;
  hours: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [checkedOutTime, setCheckedOutTime] = useState("--:--");
  const [witnessPending, setWitnessPending] = useState(true);
  const [hasResolvedMissed, setHasResolvedMissed] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setCurrentTime(`${String(hours).padStart(2, "0")}:${minutes} ${ampm}`);
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

  const [history, setHistory] = useState<HistoryLog[]>([
    { date: "23 Okt 2023", status: "Hadir", checkIn: "08:05 AM", checkOut: "04:30 PM", hours: "8j 25m" },
    { date: "22 Okt 2023", status: "Hadir", checkIn: "08:12 AM", checkOut: "05:00 PM", hours: "8j 48m" },
    { date: "21 Okt 2023", status: "Terlambat", checkIn: "08:45 AM", checkOut: "04:30 PM", hours: "7j 45m" },
    { date: "20 Okt 2023", status: "Hadir", checkIn: "08:00 AM", checkOut: "04:30 PM", hours: "8j 30m" },
  ]);

  const handleCheckOut = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formatted = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

    setCheckedOutTime(formatted);
    showToast(`Berhasil melakukan Check-Out pada pukul ${formatted}`);

    const newLog: HistoryLog = {
      date: "Hari Ini",
      status: "Hadir",
      checkIn: "08:15 AM",
      checkOut: formatted,
      hours: "7j 45m",
    };
    setHistory((prev) => [newLog, ...prev]);
  };

  const handleApproveWitness = () => {
    setWitnessPending(false);
    showToast("Anda menyetujui klaim persetujuan saksi dari Prof. Mark.");
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full animate-pulse">
        <div className="h-16 bg-slate-200/50 rounded-xl mb-md"></div>
        <div className="grid grid-cols-12 gap-lg h-80">
          <div className="col-span-12 lg:col-span-7 bg-slate-200/50 rounded-xl"></div>
          <div className="col-span-12 lg:col-span-5 bg-slate-200/50 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md h-24 mt-md">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-200/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">Selamat Pagi, Profesor</h2>
          <p className="text-xs text-on-surface-variant font-medium">Hari ini adalah hari kuliah aktif. Semoga hari mengajar Anda menyenangkan.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="font-headline-lg text-2xl font-extrabold text-primary">{currentTime || "08:42 AM"}</p>
          <p className="text-[10px] text-on-surface-variant flex items-center md:justify-end gap-xs font-bold">
            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
            <span>Geofence Kampus Utama Aktif</span>
          </p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Today's Attendance Card */}
        <div className="col-span-12 lg:col-span-7 rounded-xl bg-white border border-outline-variant p-lg shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-md">
            <div>
              <span className="px-3 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-full text-[10px] font-bold mb-md inline-block uppercase tracking-wider">
                Shift Pagi Aktif
              </span>
              <h3 className="text-sm font-bold text-on-surface mb-xs">Status Absensi Hari Ini</h3>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-xs text-primary font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span>Terverifikasi GPS</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-xl items-center flex-grow">
            <div className="flex-1 w-full space-y-md">
              <div className="flex items-center justify-between p-md bg-slate-50 rounded-lg border border-outline-variant">
                <div className="flex items-center gap-md">
                  <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-base">login</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold">Waktu Masuk (Check-In)</p>
                    <p className="text-lg font-bold text-on-surface">08:15 AM</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Tepat Waktu
                </span>
              </div>

              <div className="flex items-center justify-between p-md bg-slate-50/50 rounded-lg border border-outline-variant border-dashed">
                <div className="flex items-center gap-md">
                  <div className="w-9 h-9 rounded-full bg-outline-variant flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-base">logout</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold">Waktu Keluar (Check-Out)</p>
                    <p className="text-lg font-bold text-on-surface">{checkedOutTime}</p>
                  </div>
                </div>
                {checkedOutTime === "--:--" ? (
                  <button
                    onClick={handleCheckOut}
                    className="px-md py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:shadow active:scale-95 transition-all"
                  >
                    Check Out
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-on-surface-variant bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase">
                    Selesai
                  </span>
                )}
              </div>
            </div>

            {/* Static Simulated map preview */}
            <div className="w-full md:w-40 aspect-square relative rounded-xl overflow-hidden border border-outline-variant shrink-0">
              <img
                className="w-full h-full object-cover opacity-60"
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=300"
                alt="Peta Radius Geofence"
              />
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="p-sm bg-white/95 backdrop-blur rounded-lg shadow-md border border-primary/20">
                  <p className="text-[9px] text-primary font-bold flex items-center gap-xs">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>Radius Sesuai</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-md">
          <button
            onClick={() => router.push("/teacher/check-in")}
            className="flex flex-col items-center justify-center p-lg rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all group shadow-xs hover:shadow-md active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-3xl">fingerprint</span>
            </div>
            <span className="text-xs font-bold">Check In / Out</span>
          </button>
          <button
            onClick={() => router.push("/teacher/correction")}
            className="flex flex-col items-center justify-center p-lg rounded-xl bg-white border border-outline-variant hover:border-primary transition-all group shadow-xs hover:shadow-md active:scale-95 text-on-surface"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">edit_square</span>
            </div>
            <span className="text-xs font-bold">Ajukan Koreksi</span>
          </button>
          <button
            onClick={() => showToast("Fitur pengajuan cuti sedang dalam proses integrasi database.", "info")}
            className="flex flex-col items-center justify-center p-lg rounded-xl bg-white border border-outline-variant hover:border-primary transition-all group shadow-xs hover:shadow-md active:scale-95 text-on-surface"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">event_busy</span>
            </div>
            <span className="text-xs font-bold">Ajukan Cuti</span>
          </button>
          <button
            onClick={() => router.push("/teacher/history")}
            className="flex flex-col items-center justify-center p-lg rounded-xl bg-white border border-outline-variant hover:border-primary transition-all group shadow-xs hover:shadow-md active:scale-95 text-on-surface"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">history</span>
            </div>
            <span className="text-xs font-bold">Riwayat Absen</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col gap-sm justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Tingkat Kehadiran</span>
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined text-base">how_to_reg</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">96%</p>
            <p className="text-[10px] text-on-surface-variant font-bold mt-1">22 dari 23 Hari Kerja</p>
          </div>
        </div>

        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col gap-sm justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Rata Check-in</span>
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-base">schedule</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">08:08</p>
            <p className="text-[10px] text-primary font-extrabold mt-1">Lebih Cepat (+12m rata-rata)</p>
          </div>
        </div>

        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col gap-sm justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Sisa Jatah Cuti</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-on-surface shrink-0">
              <span className="material-symbols-outlined text-base">beach_access</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">14.5 Hari</p>
            <p className="text-[10px] text-on-surface-variant font-bold mt-1">Jatah tahunan berjalan</p>
          </div>
        </div>

        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col gap-sm justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Kelebihan Jam Kerja</span>
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-base">add_alarm</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">12 Jam</p>
            <p className="text-[10px] text-on-surface-variant font-bold mt-1">Akumulasi lembur bulan ini</p>
          </div>
        </div>
      </div>

      {/* Row: Recent Logs & Pending Actions */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Recent logs */}
        <div className="col-span-12 lg:col-span-8 rounded-xl bg-white border border-outline-variant shadow-xs overflow-hidden flex flex-col">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold text-on-surface">Log Absensi Terbaru</h3>
            <button
              onClick={() => showToast("Mengunduh laporan riwayat absensi format CSV...", "info")}
              className="text-primary font-bold text-xs hover:underline"
            >
              Unduh CSV
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-outline-variant">
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Tanggal</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Status</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Check-In</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Check-Out</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Jam Kerja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((log, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-lg py-md text-xs font-bold text-on-surface">{log.date}</td>
                    <td className="px-lg py-md">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          log.status === "Hadir"
                            ? "badge-success"
                            : log.status === "Terlambat"
                            ? "badge-warning"
                            : log.status === "Izin"
                            ? "badge-info"
                            : "badge-error"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-lg py-md text-xs font-semibold text-on-surface">{log.checkIn}</td>
                    <td className="px-lg py-md text-xs font-semibold text-on-surface">{log.checkOut}</td>
                    <td className="px-lg py-md text-xs font-semibold text-on-surface">{log.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions Column */}
        <div className="col-span-12 lg:col-span-4 space-y-lg flex flex-col justify-between min-h-[300px]">
          <div className="rounded-xl bg-white border border-outline-variant shadow-xs flex-grow">
            <div className="p-lg border-b border-outline-variant bg-slate-50">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Tindakan Tertunda</h3>
            </div>
            <div className="p-md space-y-md">
              {witnessPending && (
                <div className="p-md rounded-lg bg-slate-50 border border-slate-200 flex gap-md items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface mb-xs">Permintaan Saksi</p>
                    <p className="text-[10px] text-on-surface-variant mb-md font-semibold">
                      Profesor Mark membutuhkan Anda sebagai saksi check-in 08:30 AM kemarin.
                    </p>
                    <div className="flex gap-sm">
                      <button
                        onClick={handleApproveWitness}
                        className="px-3 py-1 bg-primary text-on-primary rounded-lg text-[10px] font-bold hover:shadow"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => alert("Membuka detail persetujuan saksi...")}
                        className="px-3 py-1 bg-white border border-outline-variant rounded-lg text-[10px] font-bold"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!hasResolvedMissed && (
                <div className="p-md rounded-lg bg-slate-50 border border-slate-200 flex gap-md items-start">
                  <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0 text-error">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface mb-xs">Lupa Check-out</p>
                    <p className="text-[10px] text-on-surface-variant mb-md font-semibold">
                      Anda melewatkan check-out pada 18 Okt. Silakan ajukan koreksi absen.
                    </p>
                    <button
                      onClick={() => {
                        setHasResolvedMissed(true);
                        router.push("/teacher/correction");
                      }}
                      className="px-3 py-1 bg-error text-on-error rounded-lg text-[10px] font-bold hover:shadow"
                    >
                      Ajukan Koreksi
                    </button>
                  </div>
                </div>
              )}

              {!witnessPending && hasResolvedMissed && (
                <div className="py-xl text-center text-on-surface-variant flex flex-col items-center justify-center gap-xs">
                  <span className="material-symbols-outlined text-[36px] text-primary/30">task_alt</span>
                  <p className="text-xs font-bold text-primary">Semua tindakan tertunda selesai!</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Punctuality Bonus Goal */}
          <div className="rounded-xl bg-primary-container p-lg text-on-primary-container shadow-xs relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-sm">Bonus Presensi Kerja</p>
              <h4 className="text-sm font-bold mb-md">Insentif Ketepatan Waktu Pendidik</h4>
              <div className="w-full h-2.5 bg-white/20 rounded-full mb-sm">
                <div className="h-full bg-secondary-fixed w-4/5 rounded-full shadow-[0_0_12px_rgba(111,251,190,0.5)]"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span>Target: 100% Tepat Waktu</span>
                <span>80% Tercapai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
