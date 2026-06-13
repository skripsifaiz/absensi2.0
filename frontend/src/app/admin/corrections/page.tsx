"use client";

import { useState, useEffect } from "react";

interface CorrectionRequest {
  id: string;
  name: string;
  dept: string;
  date: string;
  type: string;
  method: string;
  status: "Pending Admin" | "Witness Approved" | "Approved" | "Rejected";
  reason: string;
  photoUrl: string;
  witnessName?: string;
  witnessTime?: string;
  avatarText: string;
}

export default function AdminCorrections() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<CorrectionRequest[]>([
    {
      id: "AC-99201",
      name: "Sarah Jenkins",
      dept: "Dept. Matematika",
      date: "24 Okt 2023",
      type: "Kesalahan Check-In",
      method: "Bukti Foto",
      status: "Pending Admin",
      reason: "Pemindai biometrik di Gerbang Utara tidak merespons saat kedatangan saya pukul 07:50. Saya harus pergi ke kantor utama untuk melaporkan secara manual, yang menunda check-in digital saya hingga pukul 08:15.",
      photoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
      witnessName: "Prof. Alan Grant (Kepala Departemen)",
      witnessTime: "24 Okt, 09:10 AM",
      avatarText: "SJ",
    },
    {
      id: "AC-99202",
      name: "David Chen",
      dept: "Dept. Sains & IPA",
      date: "23 Okt 2023",
      type: "Lupa Check-Out",
      method: "Persetujuan Saksi",
      status: "Witness Approved",
      reason: "Saya terburu-buru menghadiri rapat evaluasi kurikulum darurat setelah jam sekolah selesai dan lupa melakukan check-out digital di sistem.",
      photoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
      witnessName: "Prof. Marcus Brody",
      witnessTime: "23 Okt, 05:00 PM",
      avatarText: "DC",
    },
    {
      id: "AC-99203",
      name: "Elena Rodriguez",
      dept: "Seni Rupa & Desain",
      date: "22 Okt 2023",
      type: "Keterlambatan",
      method: "Bukti Foto",
      status: "Witness Approved",
      reason: "Terjadi kemacetan parah karena kecelakaan di persimpangan jalan utama menuju kampus. Saya melampirkan foto laporan berita kemacetan jalan.",
      photoUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600",
      witnessName: "Prof. Alan Grant",
      witnessTime: "22 Okt, 10:00 AM",
      avatarText: "ER",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<CorrectionRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("Pending");

  // Simulated mount loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const openDrawer = (req: CorrectionRequest) => {
    setSelectedRequest(req);
    setReviewNotes("");
  };

  const closeDrawer = () => {
    setSelectedRequest(null);
  };

  const handleAction = (status: "Approved" | "Rejected") => {
    if (!selectedRequest) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === selectedRequest.id ? { ...r, status } : r))
    );
    closeDrawer();
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === "Pending") return r.status === "Pending Admin" || r.status === "Witness Approved";
    if (filter === "Completed") return r.status === "Approved" || r.status === "Rejected";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full animate-pulse">
        <div className="h-16 bg-slate-200/50 rounded-xl mb-md"></div>
        <div className="h-[340px] bg-slate-200/50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full relative min-h-[calc(100vh-64px)] pb-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 className="text-xl font-bold text-on-background tracking-tight">Kelola Koreksi Absensi</h2>
          <p className="text-xs text-on-surface-variant font-medium">Setujui atau tolak pengajuan perubahan data absensi dari guru.</p>
        </div>
        <div className="flex gap-sm w-full sm:w-auto">
          {/* Tab Filter */}
          <div className="flex bg-slate-100 p-[3px] rounded-lg border border-slate-200">
            {(["All", "Pending", "Completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-md py-1 shadow-xs rounded-md text-[11px] font-bold transition-all ${
                  filter === tab ? "bg-white text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab === "All" ? "Semua" : tab === "Pending" ? "Tertunda" : "Selesai"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-xs">
        {filteredRequests.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-on-surface-variant gap-sm">
            <span className="material-symbols-outlined text-[56px] text-primary/20">inbox</span>
            <div>
              <p className="text-sm font-bold text-on-surface">Tidak Ada Pengajuan Koreksi</p>
              <p className="text-xs text-on-surface-variant/70 mt-1 font-medium">
                Semua daftar pengajuan dalam filter ini telah selesai ditinjau.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-55 border-b border-outline-variant">
                <tr>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nama Guru</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tanggal</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Jenis Kendala</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Metode Bukti</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status Alur</th>
                  <th className="px-lg py-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => openDrawer(req)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                          {req.avatarText}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-on-surface">{req.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-semibold">{req.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md text-xs font-semibold text-on-surface">{req.date}</td>
                    <td className="px-lg py-md">
                      <span className="px-2 py-0.5 bg-slate-100 text-on-surface text-[10px] font-bold rounded">
                        {req.type}
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs text-[11px] font-bold text-on-surface-variant">
                        <span className="material-symbols-outlined text-base">
                          {req.method === "Bukti Foto" ? "photo_camera" : "group"}
                        </span>
                        <span>{req.method}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span
                        className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          req.status === "Pending Admin"
                            ? "badge-warning"
                            : req.status === "Witness Approved"
                            ? "badge-info"
                            : req.status === "Approved"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {req.status === "Pending Admin"
                          ? "Menunggu Admin"
                          : req.status === "Witness Approved"
                          ? "Disetujui Saksi"
                          : req.status === "Approved"
                          ? "Disetujui"
                          : "Ditolak"}
                      </span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <button className="text-primary font-bold text-xs hover:underline">
                        Periksa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer Overlay */}
      {selectedRequest && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[55] transition-opacity"
        ></div>
      )}

      {/* Side Details Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white shadow-2xl z-[60] border-l border-outline-variant flex flex-col transition-transform duration-300 ease-in-out ${
          selectedRequest ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedRequest && (
          <>
            {/* Drawer Header */}
            <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-on-background">Detail Pengajuan Koreksi</h3>
                <p className="text-[10px] text-on-surface-variant font-bold">Request ID: #{selectedRequest.id}</p>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-lg space-y-xl no-scrollbar">
              {/* User Profile */}
              <div className="flex items-center gap-lg">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                  {selectedRequest.avatarText}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{selectedRequest.name}</h4>
                  <p className="text-xs text-on-surface-variant font-medium">{selectedRequest.dept}</p>
                </div>
              </div>

              {/* Workflow Stepper Progress */}
              <div className="p-md bg-slate-50 rounded-xl border border-slate-200/60 space-y-md">
                <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Visualisasi Alur Persetujuan
                </h5>
                <div className="flex justify-between items-center relative before:absolute before:left-0 before:right-0 before:top-2 before:h-0.5 before:bg-slate-200">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </div>
                    <span className="text-[9px] font-bold text-on-surface mt-1">Diajukan</span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      selectedRequest.status !== "Pending Admin" ? "bg-primary text-white" : "bg-blue-600 text-white"
                    }`}>
                      {selectedRequest.status !== "Pending Admin" ? "✓" : "2"}
                    </div>
                    <span className="text-[9px] font-bold text-on-surface mt-1">Saksi</span>
                  </div>
                  {/* Step 3 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      selectedRequest.status === "Approved" 
                        ? "bg-primary text-white" 
                        : selectedRequest.status === "Rejected"
                        ? "bg-error text-white"
                        : "bg-amber-500 text-white animate-pulse"
                    }`}>
                      {selectedRequest.status === "Approved" ? "✓" : selectedRequest.status === "Rejected" ? "✕" : "3"}
                    </div>
                    <span className="text-[9px] font-bold text-on-surface mt-1">Admin</span>
                  </div>
                </div>
                <p className="text-[10px] text-on-surface-variant font-medium text-center italic mt-2">
                  Status Saat Ini:{" "}
                  {selectedRequest.status === "Pending Admin"
                    ? "Menunggu Keputusan Anda"
                    : selectedRequest.status === "Witness Approved"
                    ? "Disetujui Saksi, Menunggu Keputusan Anda"
                    : selectedRequest.status === "Approved"
                    ? "Selesai Disetujui"
                    : "Selesai Ditolak"}
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-md">
                <div className="p-md bg-slate-50 rounded-lg border border-outline-variant">
                  <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Tanggal Absensi</p>
                  <p className="text-xs font-bold text-on-surface">{selectedRequest.date}</p>
                </div>
                <div className="p-md bg-slate-50 rounded-lg border border-outline-variant">
                  <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Laporan Isu</p>
                  <p className="text-xs font-bold text-on-surface">{selectedRequest.type}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface">Alasan Guru</label>
                <div className="p-md bg-slate-50 border border-outline-variant rounded-lg italic text-xs text-on-surface-variant">
                  "{selectedRequest.reason}"
                </div>
              </div>

              {/* Photo Evidence */}
              {selectedRequest.method === "Bukti Foto" && (
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-on-surface">Lampiran Bukti Foto</label>
                  <div className="relative group overflow-hidden rounded-xl border border-outline-variant">
                    <img className="w-full h-40 object-cover" src={selectedRequest.photoUrl} alt="Bukti Foto" />
                  </div>
                </div>
              )}

              {/* Verification Trail Timeline */}
              <div className="space-y-sm">
                <label className="text-xs font-bold text-on-surface">Riwayat Verifikasi Trail</label>
                <div className="space-y-sm pl-sm border-l border-slate-200">
                  {selectedRequest.witnessName && (
                    <div className="relative pl-md">
                      <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <p className="text-xs font-bold text-on-surface">Verifikasi Saksi Disetujui</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">Disetujui oleh {selectedRequest.witnessName}</p>
                      <p className="text-[8px] text-on-surface-variant/80 font-bold">{selectedRequest.witnessTime}</p>
                    </div>
                  )}
                  <div className="relative pl-md pt-xs">
                    <div className="absolute -left-[13px] top-3 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                    <p className="text-xs font-bold text-on-surface">Menunggu Review Anda</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Tulis catatan review dan tentukan keputusan di bawah.</p>
                  </div>
                </div>
              </div>

              {/* Admin Input Notes */}
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface" htmlFor="notes-area">
                  Catatan Review Admin
                </label>
                <textarea
                  id="notes-area"
                  className="w-full rounded-lg border border-outline-variant focus:ring-primary focus:border-transparent text-xs p-md outline-none focus:ring-2 font-medium"
                  placeholder="Ketik catatan evaluasi di sini (misal: Lokasi terverifikasi cocok)..."
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-lg bg-slate-50 border-t border-outline-variant flex gap-md">
              <button
                onClick={() => handleAction("Rejected")}
                className="flex-1 py-2 border border-error text-error hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
              >
                Tolak Pengajuan
              </button>
              <button
                onClick={() => handleAction("Approved")}
                className="flex-1 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-xs font-bold hover:shadow transition-all"
              >
                Setujui Koreksi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
