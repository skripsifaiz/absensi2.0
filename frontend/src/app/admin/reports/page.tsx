"use client";

import { useState, useEffect } from "react";

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"6m" | "1y">("6m");
  const [quarter, setQuarter] = useState("Q1 2024");
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Simulated chart data
  const chartData6m = [
    { label: "Jan", val: 65, active: false },
    { label: "Feb", val: 78, active: false },
    { label: "Mar", val: 94, active: true },
    { label: "Apr", val: 82, active: false },
    { label: "Mei", val: 88, active: false },
    { label: "Jun", val: 72, active: false },
  ];

  const chartData1y = [
    { label: "Jul 23", val: 80, active: false },
    { label: "Agu 23", val: 85, active: false },
    { label: "Sep 23", val: 90, active: false },
    { label: "Okt 23", val: 87, active: false },
    { label: "Nov 23", val: 93, active: false },
    { label: "Des 23", val: 75, active: false },
    { label: "Jan 24", val: 65, active: false },
    { label: "Feb 24", val: 78, active: false },
    { label: "Mar 24", val: 94, active: true },
    { label: "Apr 24", val: 82, active: false },
    { label: "Mei 24", val: 88, active: false },
    { label: "Jun 24", val: 72, active: false },
  ];

  const chartData = timePeriod === "6m" ? chartData6m : chartData1y;

  // Departmental breakdown data based on selected Quarter
  const deptDataQ1 = [
    { name: "Teknik Informatika & CS", enrolled: 450, att: "96.5%", tardy: "2.1%", status: "SANGAT BAIK" },
    { name: "Pendidikan Olahraga", enrolled: 380, att: "91.2%", tardy: "5.4%", status: "STABIL" },
    { name: "Seni Rupa & Desain", enrolled: 210, att: "82.8%", tardy: "12.1%", status: "PERINGATAN" },
    { name: "Ilmu Pengetahuan Alam", enrolled: 520, att: "94.1%", tardy: "3.2%", status: "SANGAT BAIK" },
  ];

  const deptDataQ4 = [
    { name: "Teknik Informatika & CS", enrolled: 442, att: "95.8%", tardy: "2.4%", status: "SANGAT BAIK" },
    { name: "Pendidikan Olahraga", enrolled: 375, att: "90.6%", tardy: "5.9%", status: "STABIL" },
    { name: "Seni Rupa & Desain", enrolled: 215, att: "80.4%", tardy: "14.5%", status: "PERINGATAN" },
    { name: "Ilmu Pengetahuan Alam", enrolled: 508, att: "92.3%", tardy: "4.1%", status: "STABIL" },
  ];

  const depts = quarter === "Q1 2024" ? deptDataQ1 : deptDataQ4;

  // Simulated mount loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = (format: "pdf" | "excel") => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      showToast(`Laporan absensi berhasil diekspor ke format ${format.toUpperCase()}`);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full animate-pulse">
        <div className="h-16 bg-slate-200/50 rounded-xl mb-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md h-24">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-200/50 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mt-md h-80">
          <div className="lg:col-span-2 bg-slate-200/50 rounded-xl"></div>
          <div className="bg-slate-200/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="text-xl font-bold text-on-background tracking-tight">Analisis Laporan & Kepatuhan</h2>
          <p className="text-xs text-on-surface-variant font-medium">Bagan statistik lengkap mengenai kepatuhan absensi guru sekolah.</p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => handleExport("excel")}
            disabled={exporting !== null}
            className="flex items-center gap-xs px-md py-2 bg-white border border-outline-variant text-on-surface rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">description</span>
            <span>{exporting === "excel" ? "Mengekspor..." : "Ekspor Excel"}</span>
          </button>
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="flex items-center gap-xs px-md py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:shadow-sm transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>{exporting === "pdf" ? "Mengekspor..." : "Ekspor PDF"}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 bg-primary-fixed rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">group</span>
            </div>
            <span className="text-primary font-bold text-[10px] bg-emerald-50 px-2 py-[2px] rounded-full border border-emerald-100">
              +2.4%
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Rata Absensi Harian</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">94.8%</h3>
          </div>
        </div>

        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-lg">timer</span>
            </div>
            <span className="text-error font-bold text-[10px] bg-rose-50 px-2 py-[2px] rounded-full border border-rose-100">
              -1.1%
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ketepatan Waktu</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">88.2%</h3>
          </div>
        </div>

        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 bg-tertiary-fixed rounded-lg flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-lg">person_cancel</span>
            </div>
            <span className="text-primary font-bold text-[10px] bg-emerald-50 px-2 py-[2px] rounded-full border border-emerald-100">
              +0.5%
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Jam Absen / Alpa</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">142 Jam</h3>
          </div>
        </div>

        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-lg">how_to_reg</span>
            </div>
            <span className="text-on-surface-variant font-bold text-[10px] bg-slate-50 px-2 py-[2px] rounded-full border border-slate-100">
              Stabil
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tingkat Kepatuhan</p>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">99.1%</h3>
          </div>
        </div>
      </div>

      {/* Graphs and Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Monthly Statistics Chart */}
        <div className="lg:col-span-2 bg-white p-lg rounded-xl border border-outline-variant shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="text-sm font-bold text-on-surface">Tren Persentase Kehadiran Bulanan</h3>
            <div className="flex bg-slate-100 p-[3px] rounded-lg border border-slate-200">
              <button
                onClick={() => setTimePeriod("6m")}
                className={`px-md py-1 shadow-xs rounded-md text-[11px] font-bold transition-all ${
                  timePeriod === "6m" ? "bg-white text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                6 Bulan
              </button>
              <button
                onClick={() => setTimePeriod("1y")}
                className={`px-md py-1 shadow-xs rounded-md text-[11px] font-bold transition-all ${
                  timePeriod === "1y" ? "bg-white text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                1 Tahun
              </button>
            </div>
          </div>
          <div className="flex-grow flex items-end justify-between gap-sm h-64 pt-md">
            {chartData.map((bar, index) => (
              <div key={index} className="flex-1 group relative flex flex-col justify-end items-center h-full">
                <div
                  style={{ height: `${bar.val}%` }}
                  className={`w-full rounded-t-lg cursor-pointer transition-all duration-700 ${
                    bar.active
                      ? "bg-primary opacity-100 shadow-[0_0_12px_rgba(0,105,72,0.2)]"
                      : "bg-primary-container opacity-40 hover:opacity-100"
                  }`}
                  title={`${bar.label}: ${bar.val}%`}
                ></div>
                <p
                  className={`mt-sm text-center text-[10px] font-bold ${
                    bar.active ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {bar.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Leaderboard */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="p-lg border-b border-outline-variant bg-slate-50/50">
            <h3 className="text-sm font-bold text-on-surface">Guru dengan Kinerja Terbaik</h3>
            <p className="text-[10px] text-on-surface-variant font-medium">Konsistensi kehadiran dan kedisiplinan tertinggi.</p>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar p-md space-y-md">
            {[
              {
                rank: 1,
                name: "Dr. Elena Rodriguez",
                dept: "Dept. Matematika",
                val: "100%",
                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
              },
              {
                rank: 2,
                name: "Mark Henderson",
                dept: "Dept. Sains & IPA",
                val: "99.2%",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
              },
              {
                rank: 3,
                name: "Sarah Jenkins",
                dept: "Dept. Literatur",
                val: "98.5%",
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120",
              },
              {
                rank: 4,
                name: "Julian Kwasi",
                dept: "Dept. Sejarah & IPS",
                val: "98.1%",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
              },
            ].map((f) => (
              <div key={f.rank} className="flex items-center gap-md p-sm hover:bg-slate-50/50 rounded-xl transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
                    <img className="w-full h-full object-cover" src={f.img} alt={f.name} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                    {f.rank}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-on-surface leading-tight">{f.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-semibold">{f.dept}</p>
                </div>
                <div className="text-right">
                  <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[9px] font-bold">
                    {f.val}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-md text-center border-t border-outline-variant bg-slate-55">
            <button className="text-primary font-bold text-xs hover:underline">
              Lihat Semua Peringkat
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <section className="bg-white rounded-xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="p-lg flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-outline-variant bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-on-surface">Laporan Kepatuhan per Departemen</h3>
            <p className="text-[10px] text-on-surface-variant font-semibold">Data kumulatif kehadiran selama kuartal berjalan.</p>
          </div>
          <div>
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="bg-white border border-outline-variant rounded-lg text-xs font-bold px-md py-2 focus:ring-primary focus:outline-none outline-none cursor-pointer"
            >
              <option value="Q1 2024">Kuartal Q1 2024</option>
              <option value="Q4 2023">Kuartal Q4 2023</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-55 border-b border-outline-variant">
              <tr>
                <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Departemen</th>
                <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Jumlah Anggota</th>
                <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Avg. Kehadiran</th>
                <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Keterlambatan</th>
                <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status Evaluasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {depts.map((dept) => (
                <tr key={dept.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-lg py-md text-xs font-bold text-on-surface">{dept.name}</td>
                  <td className="px-lg py-md text-center text-xs font-medium text-on-surface">{dept.enrolled}</td>
                  <td className="px-lg py-md text-center text-xs font-semibold text-primary">{dept.att}</td>
                  <td className="px-lg py-md text-center text-xs font-medium text-on-surface-variant">{dept.tardy}</td>
                  <td className="px-lg py-md">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[9px] font-bold ${
                        dept.status === "SANGAT BAIK"
                          ? "badge-success"
                          : dept.status === "STABIL"
                          ? "badge-info"
                          : "badge-warning"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-md bg-slate-50 flex items-center justify-between border-t border-outline-variant">
          <p className="text-[10px] text-on-surface-variant font-bold">Menampilkan 4 dari 12 departemen</p>
          <div className="flex gap-xs">
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-md bg-white hover:bg-slate-100 transition-all">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-md bg-white hover:bg-slate-100 transition-all">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
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
