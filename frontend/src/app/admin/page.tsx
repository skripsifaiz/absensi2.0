"use client";

import { useState, useEffect } from "react";

interface RequestItem {
  id: string;
  name: string;
  avatar: string;
  type: string;
  detail: string;
  time: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: "req-1",
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
      type: "Koreksi",
      detail: "Koreksi: Absen Masuk 08:45 menjadi 08:00 (Saksi disetujui)",
      time: "2 jam lalu",
      status: "pending",
    },
    {
      id: "req-2",
      name: "Dr. Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      type: "Cuti",
      detail: "Pengajuan Cuti: Sakit (2 hari) • Surat dokter terlampir",
      time: "4 jam lalu",
      status: "pending",
    },
    {
      id: "req-3",
      name: "Robert Peterson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
      type: "Cuti",
      detail: "Pengajuan Cuti: Keperluan Pribadi (1 hari)",
      time: "Kemarin",
      status: "pending",
    },
  ]);

  const [presentToday, setPresentToday] = useState(132);
  const [lateCount, setLateCount] = useState(6);
  const [leaveCount, setLeaveCount] = useState(8);
  const [pendingCount, setPendingCount] = useState(14);
  const [viewMode, setViewMode] = useState<"table" | "visual">("table");

  // Simulated initial mount loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req))
    );

    setPendingCount((prev) => Math.max(0, prev - 1));
    if (action === "approve") {
      const target = requests.find((r) => r.id === id);
      if (target?.type === "Cuti") {
        setLeaveCount((prev) => prev + 1);
      } else {
        setPresentToday((prev) => prev + 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-end h-16 bg-slate-200/50 rounded-xl mb-md"></div>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-md h-28">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-200/50 rounded-xl"></div>
          ))}
        </div>
        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-12 gap-lg mt-md">
          <div className="col-span-12 lg:col-span-8 h-80 bg-slate-200/50 rounded-xl"></div>
          <div className="col-span-12 lg:col-span-4 h-80 bg-slate-200/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 className="text-xl font-bold text-on-background tracking-tight">Dashboard Ringkasan Absensi</h2>
          <p className="text-xs text-on-surface-variant font-medium">Panel pemantauan kehadiran dan persetujuan guru hari ini.</p>
        </div>
        <div className="flex gap-sm w-full sm:w-auto">
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-xs px-md py-2 bg-white border border-outline-variant rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filter Data</span>
          </button>
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-xs px-md py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Ekspor Harian</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
        {/* Total Faculty */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-sm text-on-surface-variant mb-xs">
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Guru</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface leading-none">148</div>
            <div className="text-[9px] text-primary flex items-center gap-xs mt-1.5 font-bold">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>+2 guru baru</span>
            </div>
          </div>
        </div>
        
        {/* Present Today */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-sm text-on-surface-variant mb-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Hadir Hari Ini</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface leading-none">{presentToday}</div>
            <span className="px-1.5 py-[2px] bg-secondary-container text-on-secondary-container rounded text-[9px] inline-block font-extrabold mt-1.5 uppercase">
              {((presentToday / 148) * 100).toFixed(1)}% Persentase
            </span>
          </div>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-sm text-on-surface-variant mb-xs">
            <span className="material-symbols-outlined text-[18px] text-amber-600">schedule</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Terlambat</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface leading-none">{lateCount}</div>
            <div className="text-[9px] text-on-surface-variant mt-1.5 font-bold">Rata-rata: 12 menit</div>
          </div>
        </div>

        {/* Approved Leaves */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-sm text-on-surface-variant mb-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">assignment_turned_in</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Cuti / Izin</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface leading-none">{leaveCount}</div>
            <div className="text-[9px] text-on-surface-variant mt-1.5 font-bold">Terencana hari ini</div>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-sm text-on-surface-variant mb-xs">
            <span className="material-symbols-outlined text-[18px] text-error">cancel</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Alpa / Absen</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface leading-none">2</div>
            <div className="text-[9px] text-error mt-1.5 font-extrabold uppercase">Tanpa Keterangan</div>
          </div>
        </div>

        {/* Pending Corrections */}
        <div className="bg-primary p-md rounded-xl shadow-xs text-on-primary flex flex-col justify-between">
          <div className="flex items-center gap-sm text-primary-fixed mb-xs">
            <span className="material-symbols-outlined text-[18px]">edit_square</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Persetujuan</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-primary leading-none">{pendingCount}</div>
            <div className="text-[9px] text-primary-fixed mt-1.5 font-bold">Perlu verifikasi</div>
          </div>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Main Chart: Attendance Trend */}
        <div className="col-span-12 lg:col-span-8 bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-on-surface">Tren Kehadiran Mingguan (Persentase)</h3>
            <div className="flex gap-sm items-center">
              <span className="flex items-center gap-xs text-[10px] font-bold text-on-surface-variant uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                <span>Hadir</span>
              </span>
              <span className="flex items-center gap-xs text-[10px] font-bold text-on-surface-variant uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim inline-block"></span>
                <span>Cuti</span>
              </span>
            </div>
          </div>
          <div className="h-[220px] w-full flex items-end gap-md relative pt-md">
            {/* Simulated Chart Guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              <div className="border-b border-slate-100 w-full h-px"></div>
              <div className="border-b border-slate-100 w-full h-px"></div>
              <div className="border-b border-slate-100 w-full h-px"></div>
              <div className="border-b border-slate-100 w-full h-px"></div>
            </div>
            
            {/* Bars */}
            {[
              { day: "Sen", presence: 80, leave: 10 },
              { day: "Sel", presence: 92, leave: 8 },
              { day: "Rab", presence: 88, leave: 10 },
              { day: "Kam", presence: 95, leave: 5 },
              { day: "Jum", presence: 78, leave: 15 },
              { day: "Sab", presence: 10, leave: 0 },
              { day: "Min", presence: 5, leave: 0 },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 h-full flex flex-col justify-end items-center gap-xs z-10">
                <div className="w-full flex justify-center items-end gap-[3px] h-[calc(100%-20px)]">
                  <div
                    style={{ height: `${bar.presence}%` }}
                    className="bg-primary w-4 sm:w-6 rounded-t transition-all duration-500 hover:bg-primary-container"
                  ></div>
                  {bar.leave > 0 && (
                    <div
                      style={{ height: `${bar.leave}%` }}
                      className="bg-secondary-fixed-dim w-2 sm:w-3 rounded-t transition-all duration-500"
                    ></div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals Widget */}
        <div className="col-span-12 lg:col-span-4 bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center mb-md">
              <h3 className="text-sm font-bold text-on-surface">Persetujuan Tertunda</h3>
              <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-secondary-container rounded-full">
                {requests.filter((r) => r.status === "pending").length} Tertunda
              </span>
            </div>
            <div className="flex flex-col gap-sm">
              {requests.filter((r) => r.status === "pending").length === 0 ? (
                <div className="py-xl text-center flex flex-col items-center justify-center text-on-surface-variant gap-xs">
                  <span className="material-symbols-outlined text-[36px] text-primary/30">verified</span>
                  <p className="text-xs font-bold text-primary">Semua pengajuan selesai diperiksa!</p>
                </div>
              ) : (
                requests
                  .filter((r) => r.status === "pending")
                  .map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-md p-2 rounded-lg hover:bg-slate-50 transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full border border-outline-variant overflow-hidden shrink-0">
                        <img className="w-full h-full object-cover" src={req.avatar} alt={req.name} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-on-surface truncate leading-tight">
                          {req.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          {req.detail}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-on-surface-variant font-bold whitespace-nowrap">
                          {req.time}
                        </span>
                        <div className="flex gap-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleAction(req.id, "approve")}
                            className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform"
                          >
                            <span className="material-symbols-outlined text-[10px]">check</span>
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "reject")}
                            className="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center hover:scale-105 transition-transform"
                          >
                            <span className="material-symbols-outlined text-[10px]">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
          {requests.filter((r) => r.status !== "pending").length > 0 && (
            <div className="mt-md pt-sm border-t border-outline-variant text-[10px] text-on-surface-variant flex flex-col gap-0.5">
              <span className="font-bold uppercase tracking-wider text-[8px] opacity-70">Aktivitas Terakhir:</span>
              {requests
                .filter((r) => r.status !== "pending")
                .map((req) => (
                  <div key={req.id} className="flex justify-between items-center font-medium">
                    <span>{req.name}</span>
                    <span className={`font-bold ${req.status === "approved" ? "text-primary" : "text-error"}`}>
                      {req.status === "approved" ? "Disetujui" : "Ditolak"}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Row Combined: Activities & Breakdown */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Left Column: Recent Activities */}
        <div className="col-span-12 lg:col-span-4 bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col">
          <h3 className="text-sm font-bold text-on-surface mb-md">Aktivitas Sistem</h3>
          <div className="relative flex flex-col gap-lg before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant flex-1 justify-center py-sm">
            <div className="relative flex items-start gap-md">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-primary z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">door_open</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface leading-tight">Autogate Utama Dibuka</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Gerbang #4 memulai pemindaian otomatis.</p>
                <span className="text-[8px] text-on-surface-variant font-bold">07:30 AM</span>
              </div>
            </div>
            <div className="relative flex items-start gap-md">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-secondary z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[18px]">mail</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface leading-tight">Laporan Harian Terkirim</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Laporan PDF dikirim ke email yayasan.</p>
                <span className="text-[8px] text-on-surface-variant font-bold">08:15 AM</span>
              </div>
            </div>
            <div className="relative flex items-start gap-md">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-amber-500 z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface leading-tight">Flag Peringatan Keterlambatan</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Departemen Matematika: 3 staf terdeteksi belum check-in.</p>
                <span className="text-[8px] text-on-surface-variant font-bold">08:45 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Faculty Table */}
        <div className="col-span-12 lg:col-span-8 bg-white p-lg rounded-xl border border-outline-variant shadow-xs">
          <div className="flex justify-between items-center mb-md">
            <h3 className="text-sm font-bold text-on-surface">Kepatuhan Kehadiran Guru</h3>
            <div className="flex items-center gap-xs bg-slate-100 p-[3px] rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`px-sm py-1 shadow-xs rounded-md text-[11px] font-bold transition-all ${
                  viewMode === "table" ? "bg-white text-primary" : "text-on-surface-variant"
                }`}
              >
                Tabel
              </button>
              <button
                onClick={() => setViewMode("visual")}
                className={`px-sm py-1 shadow-xs rounded-md text-[11px] font-bold transition-all ${
                  viewMode === "visual" ? "bg-white text-primary" : "text-on-surface-variant"
                }`}
              >
                Persentase
              </button>
            </div>
          </div>

          {viewMode === "table" ? (
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="pb-sm text-[10px] font-bold text-on-surface-variant uppercase">Nama Guru</th>
                    <th className="pb-sm text-[10px] font-bold text-on-surface-variant uppercase">Departemen</th>
                    <th className="pb-sm text-[10px] font-bold text-on-surface-variant uppercase text-center">Tingkat Kehadiran</th>
                    <th className="pb-sm text-[10px] font-bold text-on-surface-variant uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
                            alt="David Miller"
                          />
                        </div>
                        <span className="text-xs font-bold text-on-surface">David Miller</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-xs text-on-surface-variant font-medium">Sains & IPA</td>
                    <td className="py-2.5">
                      <div className="w-full max-w-[80px] mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[95%]"></div>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase badge-success">
                        Hadir
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                            alt="Elena Rodriguez"
                          />
                        </div>
                        <span className="text-xs font-bold text-on-surface">Elena Rodriguez</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-xs text-on-surface-variant font-medium">Matematika</td>
                    <td className="py-2.5">
                      <div className="w-full max-w-[80px] mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[78%]"></div>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase badge-warning">
                        Telat
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
                            alt="James Wilson"
                          />
                        </div>
                        <span className="text-xs font-bold text-on-surface">James Wilson</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-xs text-on-surface-variant font-medium">Sejarah & IPS</td>
                    <td className="py-2.5">
                      <div className="w-full max-w-[80px] mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full w-[0%]"></div>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase badge-error">
                        Alpa
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-2 flex flex-col gap-sm">
              {[
                { name: "Sains & IPA", rate: 95, color: "bg-primary" },
                { name: "Matematika", rate: 78, color: "bg-amber-500" },
                { name: "Sejarah & IPS", rate: 92, color: "bg-primary" },
                { name: "Bahasa Inggris", rate: 89, color: "bg-primary" },
              ].map((dept) => (
                <div key={dept.name} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{dept.name}</span>
                    <span className="text-primary">{dept.rate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${dept.color} h-full rounded-full`} style={{ width: `${dept.rate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto py-sm text-center text-on-surface-variant/40 text-[10px] font-semibold">
        © 2026 EduAttend Pro. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
