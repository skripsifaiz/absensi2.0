"use client";

import { useState, useEffect } from "react";

interface HistoryRecord {
  date: string;
  status: "Hadir" | "Terlambat" | "Izin" | "Alpa";
  checkIn: string;
  checkOut: string;
  hours: string;
  details: string;
}

export default function TeacherHistory() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Hadir" | "Terlambat" | "Izin" | "Alpa">("Semua");
  const [startDate, setStartDate] = useState("2023-10-18");
  const [endDate, setEndDate] = useState("2023-10-24");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const [records] = useState<HistoryRecord[]>([
    { date: "24 Okt 2023", status: "Hadir", checkIn: "08:15 AM", checkOut: "03:30 PM", hours: "7j 15m", details: "Check-in Tepat Waktu" },
    { date: "23 Okt 2023", status: "Hadir", checkIn: "08:05 AM", checkOut: "04:30 PM", hours: "8j 25m", details: "Check-in Tepat Waktu" },
    { date: "22 Okt 2023", status: "Hadir", checkIn: "08:12 AM", checkOut: "05:00 PM", hours: "8j 48m", details: "Check-in Tepat Waktu" },
    { date: "21 Okt 2023", status: "Terlambat", checkIn: "08:45 AM", checkOut: "04:30 PM", hours: "7j 45m", details: "Terlambat 15 menit" },
    { date: "20 Okt 2023", status: "Hadir", checkIn: "08:00 AM", checkOut: "04:30 PM", hours: "8j 30m", details: "Check-in Tepat Waktu" },
    { date: "19 Okt 2023", status: "Izin", checkIn: "-- : --", checkOut: "-- : --", hours: "0j 0m", details: "Sakit (Surat Dokter Dilampirkan)" },
    { date: "18 Okt 2023", status: "Alpa", checkIn: "08:10 AM", checkOut: "-- : --", hours: "--", details: "Lupa melakukan Check-out" },
  ]);

  // Simulated mount loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredRecords = records.filter((rec) => {
    if (statusFilter !== "Semua" && rec.status !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full animate-pulse">
        <div className="h-16 bg-slate-200/50 rounded-xl mb-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md h-24">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-200/50 rounded-xl"></div>
          ))}
        </div>
        <div className="h-12 bg-slate-200/50 rounded-xl mt-md"></div>
        <div className="h-72 bg-slate-200/50 rounded-xl mt-md"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">Riwayat Absensi Anda</h2>
          <p className="text-xs text-on-surface-variant font-medium">Lacak dan filter log waktu masuk, jam pulang, dan status absensi bulanan Anda.</p>
        </div>
        <button
          onClick={() => showToast("Mengunduh berkas riwayat absen PDF...", "info")}
          className="flex items-center justify-center gap-xs px-md py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Unduh Rekap PDF</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Tingkat Kehadiran</p>
          <h3 className="text-2xl font-extrabold text-primary mt-1">94.3%</h3>
          <p className="text-[9px] text-on-surface-variant font-bold mt-1">Kategori: Sangat Baik</p>
        </div>

        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Rata Jam Check-In</p>
          <h3 className="text-2xl font-extrabold text-on-surface mt-1">08:08 AM</h3>
          <p className="text-[9px] text-primary font-bold mt-1">Konsisten Tepat Waktu</p>
        </div>

        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Total Keterlambatan</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">1 Kali</h3>
          <p className="text-[9px] text-on-surface-variant font-bold mt-1">Bulan berjalan</p>
        </div>

        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Jatah Sakit / Izin</p>
          <h3 className="text-2xl font-extrabold text-on-surface mt-1">1.5 Hari</h3>
          <p className="text-[9px] text-on-surface-variant font-bold mt-1">Semester berjalan</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-outline-variant p-md shadow-xs grid grid-cols-1 md:grid-cols-3 gap-md items-end">
        <div className="space-y-xs">
          <label className="text-xs font-bold text-on-surface-variant">Dari Tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary bg-white font-medium cursor-pointer"
          />
        </div>
        <div className="space-y-xs">
          <label className="text-xs font-bold text-on-surface-variant">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary bg-white font-medium cursor-pointer"
          />
        </div>
        <div className="space-y-xs">
          <label className="text-xs font-bold text-on-surface-variant">Status Absensi</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary bg-white font-bold cursor-pointer"
          >
            <option value="Semua">Semua Kehadiran</option>
            <option value="Hadir">Hadir</option>
            <option value="Terlambat">Terlambat</option>
            <option value="Izin">Izin / Sakit</option>
            <option value="Alpa">Absen / Alpa</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-xs">
        {filteredRecords.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-on-surface-variant gap-xs bg-white">
            <span className="material-symbols-outlined text-[48px] text-primary/20">search_off</span>
            <div>
              <p className="text-sm font-bold text-on-surface">Data Tidak Ditemukan</p>
              <p className="text-xs text-on-surface-variant/70 mt-1 font-semibold">
                Tidak ada log absensi dengan status "{statusFilter}" pada periode tersebut.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-outline-variant">
                <tr>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Tanggal</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Status</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Check-In</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Check-Out</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Total Jam</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase">Detail Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-lg py-md text-xs font-bold text-on-surface">{rec.date}</td>
                    <td className="px-lg py-md">
                      <span
                        className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          rec.status === "Hadir"
                            ? "badge-success"
                            : rec.status === "Terlambat"
                            ? "badge-warning"
                            : rec.status === "Izin"
                            ? "badge-info"
                            : "badge-error"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-lg py-md text-xs font-semibold text-on-surface">{rec.checkIn}</td>
                    <td className="px-lg py-md text-xs font-semibold text-on-surface">{rec.checkOut}</td>
                    <td className="px-lg py-md text-xs font-semibold text-on-surface">{rec.hours}</td>
                    <td className="px-lg py-md text-[11px] font-semibold text-on-surface-variant">{rec.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
