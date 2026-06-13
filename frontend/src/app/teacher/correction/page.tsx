"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";


export default function TeacherCorrection() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("2026-06-13");
  const [correctionType, setCorrectionType] = useState("Check-In");
  const [reason, setReason] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"photo" | "witness">("photo");
  const [selectedWitness, setSelectedWitness] = useState("");
  
  // Photo upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form submission states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [user, setUser] = useState<any>(null);
  const [filteredWitnesses, setFilteredWitnesses] = useState<any[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      
      // Load teachers list for witness selection
      api.get<any[]>("/auth/teachers")
        .then((teachers) => {
          setFilteredWitnesses(teachers.filter((t) => t.id !== u.id));
          setLoading(false);
        })
        .catch((e) => {
          console.error("Failed to load teachers", e);
          setLoading(false);
        });
    } else {
      router.push("/");
    }
  }, []);

  // Handle Photo selection and simulate upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate uploading state
    setIsUploadingPhoto(true);
    setUploadProgress(0);

    const previewUrl = URL.createObjectURL(file);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploadingPhoto(false);
        setPhotoFile(file);
        setPhotoPreview(previewUrl);
      }
    }, 150);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationMethod === "photo" && !photoPreview) {
      showToast("Harap pilih dan unggah foto bukti kehadiran terlebih dahulu!", "error");
      return;
    }
    if (verificationMethod === "witness" && !selectedWitness) {
      showToast("Harap pilih salah satu rekan guru sebagai saksi Anda!", "error");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/correction", {
        userId: user.id,
        date,
        correctionType,
        reason,
        verificationMethod,
        witnessId: verificationMethod === "witness" ? selectedWitness : undefined,
        photoUrl: verificationMethod === "photo" ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300" : undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/teacher");
      }, 2000);
    } catch (err: any) {
      showToast(err.message || "Gagal mengirimkan pengajuan koreksi.", "error");
    } finally {
      setSubmitting(false);
    }
  };


  // 1. Render Skeleton loading layout
  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full max-w-[700px] mx-auto pb-xl">
        {/* Header Skeleton */}
        <div className="space-y-sm">
          <div className="shimmer-box h-8 w-64"></div>
          <div className="shimmer-box h-4 w-full"></div>
          <div className="shimmer-box h-4 w-3/4"></div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-white rounded-xl border border-outline-variant p-lg md:p-xl shadow-sm space-y-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="space-y-xs">
              <div className="shimmer-box h-4 w-40"></div>
              <div className="shimmer-box h-10 w-full"></div>
            </div>
            <div className="space-y-xs">
              <div className="shimmer-box h-4 w-32"></div>
              <div className="shimmer-box h-10 w-full"></div>
            </div>
          </div>

          <div className="space-y-xs">
            <div className="shimmer-box h-4 w-48"></div>
            <div className="shimmer-box h-32 w-full"></div>
          </div>

          <div className="space-y-sm">
            <div className="shimmer-box h-4 w-36"></div>
            <div className="shimmer-box h-12 w-full"></div>
          </div>

          <div className="shimmer-box h-40 w-full"></div>

          <div className="pt-md border-t border-outline-variant flex justify-end gap-md">
            <div className="shimmer-box h-10 w-24"></div>
            <div className="shimmer-box h-10 w-36"></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Actual Page Content
  return (
    <div className="flex flex-col gap-lg w-full max-w-[700px] mx-auto pb-xl relative">
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-md">
          <div className="bg-white rounded-2xl border border-outline-variant p-xl shadow-2xl max-w-md w-full text-center flex flex-col items-center gap-md transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-emerald-100">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Pengajuan Berhasil Dikirim</h3>
              <p className="text-xs text-on-surface-variant/90 mt-2 font-medium">
                Permintaan koreksi absensi Anda telah sukses diajukan. Status dapat dipantau melalui dashboard Anda.
              </p>
            </div>
            <div className="w-full bg-slate-50 border border-slate-100 p-sm rounded-lg text-[10px] text-on-surface-variant/80 font-bold flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined animate-spin text-sm text-primary">sync</span>
              <span>Kembali ke dashboard dalam beberapa saat...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Ajukan Koreksi Kehadiran</h2>
        <p className="font-body-md text-on-surface-variant mt-xs">
          Gunakan formulir ini jika Anda lupa melakukan Check-In / Check-Out atau menghadapi kendala teknis dengan perangkat penentu geofence.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-outline-variant p-lg md:p-xl shadow-sm space-y-lg">
        {/* Date & Type Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className="font-label-sm text-xs font-bold text-on-surface-variant" htmlFor="attendance-date">
              Tanggal Absensi yang Bermasalah
            </label>
            <input
              id="attendance-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2 font-body-sm text-sm outline-none focus:ring-2 focus:ring-primary bg-white font-medium cursor-pointer"
              required
            />
          </div>

          <div className="space-y-xs">
            <label className="font-label-sm text-xs font-bold text-on-surface-variant" htmlFor="correction-type-select">
              Jenis Koreksi Kehadiran
            </label>
            <select
              id="correction-type-select"
              value={correctionType}
              onChange={(e) => setCorrectionType(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2 font-body-sm text-sm outline-none focus:ring-2 focus:ring-primary bg-white font-bold cursor-pointer"
            >
              <option value="Check-In">Check-In Terlewat / Gagal</option>
              <option value="Check-Out">Check-Out Terlewat / Gagal</option>
            </select>
          </div>
        </div>

        {/* Reason Textarea */}
        <div className="space-y-xs">
          <label className="font-label-sm text-xs font-bold text-on-surface-variant" htmlFor="reason-textarea">
            Alasan Pengajuan Koreksi (Wajib)
          </label>
          <textarea
            id="reason-textarea"
            required
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-md font-body-sm text-sm outline-none focus:ring-2 focus:ring-primary text-on-surface"
            placeholder="Tuliskan kendala secara detail (misal: GPS tidak merespons, pintu gerbang ditutup, rapat mendadak, dll...)"
          ></textarea>
        </div>

        {/* Verification Method Tabs */}
        <div className="space-y-sm">
          <label className="font-label-sm text-xs font-bold text-on-surface-variant">Metode Verifikasi Bukti</label>
          <div className="flex bg-surface-container-low p-xs rounded-lg border border-outline-variant">
            <button
              type="button"
              onClick={() => setVerificationMethod("photo")}
              className={`flex-1 py-sm rounded-md font-label-md text-label-md font-semibold transition-all ${
                verificationMethod === "photo"
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Unggah Bukti Foto
            </button>
            <button
              type="button"
              onClick={() => setVerificationMethod("witness")}
              className={`flex-1 py-sm rounded-md font-label-md text-label-md font-semibold transition-all ${
                verificationMethod === "witness"
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Persetujuan Rekan Guru (Saksi)
            </button>
          </div>
        </div>

        {/* Conditional Inputs */}
        {verificationMethod === "photo" ? (
          <div className="space-y-xs">
            <label className="font-label-sm text-xs font-bold text-on-surface-variant">Lampirkan Foto Bukti Kehadiran</label>
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Simulated uploading container */}
            {isUploadingPhoto && (
              <div className="border-2 border-dashed border-primary bg-primary/5 rounded-xl p-lg flex flex-col items-center justify-center text-center transition-colors">
                <span className="material-symbols-outlined text-[48px] text-primary animate-spin mb-sm">
                  sync
                </span>
                <p className="text-sm font-bold text-primary">Mengunggah Bukti Foto...</p>
                <div className="w-full max-w-[240px] bg-slate-200 h-2 rounded-full overflow-hidden mt-sm">
                  <div 
                    className="bg-primary h-full transition-all duration-200" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-primary font-semibold mt-1">{uploadProgress}%</p>
              </div>
            )}

            {/* Preview Selected Image */}
            {!isUploadingPhoto && photoPreview && (
              <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low">
                <div className="relative group aspect-video max-h-[220px] w-full flex items-center justify-center bg-black/5">
                  <img
                    src={photoPreview}
                    alt="Preview Bukti Foto"
                    className="h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-md transition-opacity">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-md py-1.5 bg-white text-on-surface rounded-lg text-xs font-bold hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Ganti</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-md py-1.5 bg-error text-on-error rounded-lg text-xs font-bold hover:bg-error/90 active:scale-95 transition-all flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
                <div className="p-md border-t border-outline-variant flex justify-between items-center bg-white">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface truncate max-w-[200px] sm:max-w-[300px]">
                        {photoFile?.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-semibold">
                        {(photoFile ? photoFile.size / 1024 : 0).toFixed(1)} KB • Terunggah
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[11px] text-error hover:underline font-bold sm:hidden"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )}

            {/* Standard Upload Trigger Box */}
            {!isUploadingPhoto && !photoPreview && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center bg-surface-container-low/50 hover:bg-surface-container-low hover:border-primary transition-colors cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40 group-hover:text-primary group-hover:scale-105 transition-all mb-sm">
                  cloud_upload
                </span>
                <div>
                  <p className="text-sm font-bold text-on-surface">Klik di sini untuk mengunggah bukti foto</p>
                  <p className="text-xs text-on-surface-variant/80 mt-1">Mendukung format PNG, JPG hingga 5MB</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-xs">
            <label className="font-label-sm text-xs font-bold text-on-surface-variant" htmlFor="witness-select">
              Pilih Saksi (Rekan Guru Pengawas / Kepala Departemen)
            </label>
            <select
              id="witness-select"
              value={selectedWitness}
              onChange={(e) => setSelectedWitness(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2 font-body-sm text-sm outline-none focus:ring-2 focus:ring-primary bg-white font-bold cursor-pointer"
            >
              <option value="">-- Pilih Rekan Guru --</option>
              {filteredWitnesses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.position || "Guru"})
                </option>
              ))}

            </select>
            <p className="text-[10px] text-on-surface-variant italic font-semibold">
              * Saksi terpilih akan menerima notifikasi untuk menyetujui klaim kehadiran Anda sebelum diteruskan ke Admin.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-md border-t border-outline-variant flex justify-end gap-md">
          <button
            type="button"
            onClick={() => router.push("/teacher")}
            className="px-xl py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-lg font-label-md font-bold transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-on-primary px-xl py-2 rounded-lg font-label-md font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center gap-sm"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                <span>Mengirimkan...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Kirim Pengajuan</span>
              </>
            )}
          </button>
        </div>
      </form>

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
