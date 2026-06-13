"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";


export default function AdminSettings() {
  const [loading, setLoading] = useState(true);

  // GPS configuration state
  const [lat, setLat] = useState("-6.2088");
  const [lng, setLng] = useState("106.8456");
  const [radius, setRadius] = useState(150);
  const [radiusError, setRadiusError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Attendance Rules state
  const [geofencingActive, setGeofencingActive] = useState(true);
  const [lateThreshold, setLateThreshold] = useState(15);
  const [startTime, setStartTime] = useState("07:30");
  const [endTime, setEndTime] = useState("15:30");

  // Institution info state
  const [schoolName, setSchoolName] = useState("Sekolah Menengah Oakwood");
  const [contactEmail, setContactEmail] = useState("admin@oakwood.sch.id");
  const [lang, setLang] = useState("Indonesian");

  // Notifications state
  const [emailDaily, setEmailDaily] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotes, setPushNotes] = useState(true);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Teacher registration state
  const [teacherNip, setTeacherNip] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPosition, setTeacherPosition] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [registering, setRegistering] = useState(false);

  // Fetch configs from backend
  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const res = await api.get<any>("/settings");
        if (res && active) {
          setLat(String(res.latitude));
          setLng(String(res.longitude));
          setRadius(res.radius);
          setGeofencingActive(res.geofenceActive);
          setLateThreshold(res.lateThreshold);
          setStartTime(res.startTime);
          setEndTime(res.endTime);
          setSchoolName(res.schoolName || "Sekolah Menengah Oakwood");
          setContactEmail(res.contactEmail || "admin@oakwood.sch.id");
        }
      } catch (err: any) {
        console.error("Gagal memuat konfigurasi sekolah:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const triggerSaveStatus = (message: string) => {
    setSaveStatus(message);
    setTimeout(() => {
      setSaveStatus(null);
    }, 2000);
  };

  const handleRadiusChange = (val: number) => {
    setRadius(val);
    if (val < 10) {
      setRadiusError("Radius terlalu kecil (min. 10 meter)");
    } else if (val > 2000) {
      setRadiusError("Radius terlalu besar (max. 2000 meter)");
    } else {
      setRadiusError("");
    }
  };

  const saveGPS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (radiusError) {
      showToast("Harap perbaiki kesalahan input sebelum menyimpan!", "error");
      return;
    }
    try {
      await api.put("/settings", {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        radius: radius,
      });
      triggerSaveStatus("Pengaturan GPS & Geofence berhasil disimpan!");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan GPS", "error");
    }
  };

  const saveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/settings", {
        geofenceActive: geofencingActive,
        lateThreshold: lateThreshold,
        startTime: startTime,
        endTime: endTime,
      });
      triggerSaveStatus("Aturan kehadiran berhasil diperbarui!");
    } catch (err: any) {
      showToast(err.message || "Gagal memperbarui aturan", "error");
    }
  };

  const saveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/settings", {
        schoolName: schoolName,
        contactEmail: contactEmail,
      });
      triggerSaveStatus("Profil instansi berhasil diperbarui!");
    } catch (err: any) {
      showToast(err.message || "Gagal memperbarui info instansi", "error");
    }
  };

  const handleRegisterTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherPassword.length < 6) {
      showToast("Kata sandi minimal 6 karakter!", "error");
      return;
    }
    setRegistering(true);
    try {
      await api.post("/auth/register-teacher", {
        nip: teacherNip,
        name: teacherName,
        email: teacherEmail,
        position: teacherPosition,
        password: teacherPassword,
      });
      showToast("Guru berhasil didaftarkan!", "success");
      setTeacherNip("");
      setTeacherName("");
      setTeacherEmail("");
      setTeacherPosition("");
      setTeacherPassword("");
    } catch (err: any) {
      showToast(err.message || "Gagal mendaftarkan guru", "error");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full animate-pulse">
        <div className="h-16 bg-slate-200/50 rounded-xl mb-md"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg h-96">
          <div className="lg:col-span-8 bg-slate-200/50 rounded-xl"></div>
          <div className="lg:col-span-4 bg-slate-200/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full pb-xl">
      {/* Header */}
      <header className="mb-md">
        <h2 className="text-xl font-bold text-on-surface tracking-tight">Pengaturan & Kebijakan Sistem</h2>
        <p className="text-xs text-on-surface-variant font-medium">Atur parameter verifikasi lokasi GPS dan kebijakan absensi institusi.</p>
      </header>

      {/* Floating Save Alert */}
      {saveStatus && (
        <div className="fixed top-20 right-8 z-[100] bg-emerald-600 text-white px-lg py-3 rounded-xl shadow-lg flex items-center gap-sm animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-xs font-bold">{saveStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
        {/* Left Columns: GPS Config & Rules */}
        <div className="xl:col-span-8 space-y-lg">
          {/* GPS Config Card */}
          <form onSubmit={saveGPS} className="bg-white rounded-xl border border-outline-variant shadow-xs overflow-hidden">
            <div className="p-md border-b border-outline-variant bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h3 className="text-sm font-bold text-on-surface">Peta Geofence & Koordinat</h3>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Radius Aktif
              </span>
            </div>

            <div className="p-lg space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-on-surface-variant">Garis Lintang (Latitude)</label>
                  <input
                    className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-medium"
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-on-surface-variant">Garis Bujur (Longitude)</label>
                  <input
                    className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-medium"
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-on-surface-variant">Jangkauan Radius (Meter)</label>
                  <div className="relative">
                    <input
                      className="w-full border border-outline-variant rounded-lg p-2 pr-12 text-xs outline-none focus:ring-2 focus:ring-primary font-bold"
                      type="number"
                      value={radius}
                      onChange={(e) => handleRadiusChange(parseInt(e.target.value) || 0)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-bold">m</span>
                  </div>
                </div>
              </div>

              {radiusError && <p className="text-xs text-error font-bold">{radiusError}</p>}

              {/* Map Simulator */}
              <div className="relative h-[260px] rounded-xl border border-outline-variant overflow-hidden bg-slate-100">
                <img
                  alt="Peta Lokasi"
                  className="w-full h-full object-cover opacity-60"
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                />
                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

                {/* Geofence Ring Representation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    style={{ width: `${Math.min(220, Math.max(70, radius))}px`, height: `${Math.min(220, Math.max(70, radius))}px` }}
                    className="border-2 border-primary bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-primary text-4xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                      location_on
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-md left-md glass-panel p-sm rounded-lg flex items-center gap-xs border border-slate-200">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">info</span>
                  <p className="text-[10px] font-bold text-on-surface">Simulasi geofence aktif dalam radius {radius}m</p>
                </div>
              </div>
            </div>

            <div className="px-lg py-md bg-slate-50 border-t border-outline-variant flex justify-end">
              <button
                type="submit"
                className="bg-primary text-on-primary px-xl py-2 rounded-lg text-xs font-bold hover:shadow transition-all active:scale-95 flex items-center gap-sm"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                <span>Simpan Radius GPS</span>
              </button>
            </div>
          </form>

          {/* Attendance Rules Card */}
          <form onSubmit={saveRules} className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-md border-b border-outline-variant bg-slate-50 flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">history</span>
              <h3 className="text-sm font-bold text-on-surface">Aturan Toleransi & Jam Kerja</h3>
            </div>

            <div className="p-lg grid grid-cols-1 md:grid-cols-2 gap-xl">
              <div className="space-y-lg">
                {/* Geofence Checkbox Toggle */}
                <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-on-surface">Wajib Validasi Geofence</span>
                    <p className="text-[10px] text-on-surface-variant font-semibold">Batasi absensi hanya di area kampus.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={geofencingActive}
                      onChange={(e) => setGeofencingActive(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Range Threshold slider */}
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-on-surface-variant">Batas Toleransi Terlambat (Menit)</label>
                  <div className="flex items-center gap-md">
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={lateThreshold}
                      onChange={(e) => setLateThreshold(parseInt(e.target.value))}
                      className="flex-1 accent-primary cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                    />
                    <span className="w-12 text-center font-bold text-primary text-xs">{lateThreshold}m</span>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="space-y-md">
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-on-surface-variant">Jam Masuk Shift</label>
                    <div className="relative">
                      <input
                        className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-bold"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-on-surface-variant">Jam Pulang Shift</label>
                    <div className="relative">
                      <input
                        className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-bold"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Rule Preview Helper */}
                <div className="p-md bg-secondary-container/20 rounded-xl border border-secondary/20">
                  <div className="flex gap-sm">
                    <span className="material-symbols-outlined text-secondary text-lg">info</span>
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase">Ulasan Aturan Berlaku</span>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5 font-medium">
                        Check-in lewat dari jam {startTime} s.d. pukul {startTime.split(":")[0]}:
                        {String(parseInt(startTime.split(":")[1]) + lateThreshold).padStart(2, "0")} dianggap{" "}
                        <span className="text-amber-700 font-bold">Terlambat</span>. Setelah itu, akan otomatis ditandai sebagai{" "}
                        <span className="text-rose-700 font-bold">Alpa</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-lg py-md bg-slate-50 border-t border-outline-variant flex justify-end">
              <button
                type="submit"
                className="bg-primary text-on-primary px-xl py-2 rounded-lg text-xs font-bold hover:shadow transition-all active:scale-95"
              >
                Terapkan Aturan Baru
              </button>
            </div>
          </form>
        </div>

        {/* Right Section: System Settings Info & Notification Checkboxes */}
        <div className="xl:col-span-4 space-y-lg">
          {/* Institution Info Card */}
          <form onSubmit={saveGeneralSettings} className="bg-white rounded-xl border border-outline-variant shadow-xs overflow-hidden">
            <div className="p-md border-b border-outline-variant bg-slate-50 flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">school</span>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Informasi Umum</h3>
            </div>
            <div className="p-md space-y-md">
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">Nama Yayasan / Sekolah</label>
                <input
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-semibold"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">Email Hubungan Administrator</label>
                <input
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-semibold"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">Bahasa Default Sistem</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary cursor-pointer font-bold bg-white"
                >
                  <option value="Indonesian">Bahasa Indonesia</option>
                  <option value="English">English (US)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-slate-50 hover:bg-slate-100 border border-outline-variant text-on-surface text-[10px] font-bold py-2 rounded-lg transition-colors shadow-xs"
              >
                Simpan Info Institusi
              </button>
            </div>
          </form>

          {/* Notifications config */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-xs overflow-hidden">
            <div className="p-md border-b border-outline-variant bg-slate-50 flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Saluran Notifikasi</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-md flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                  <span className="text-xs font-bold">Email Laporan Harian</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailDaily}
                  onChange={(e) => setEmailDaily(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer"
                />
              </div>
              <div className="p-md flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">sms</span>
                  <span className="text-xs font-bold">SMS Alert Keterlambatan</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer"
                />
              </div>
              <div className="p-md flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">phonelink_ring</span>
                  <span className="text-xs font-bold">Push Notif Guru (Aplikasi)</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotes}
                  onChange={(e) => setPushNotes(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Register Teacher Form Card */}
          <form onSubmit={handleRegisterTeacher} className="bg-white rounded-xl border border-outline-variant shadow-xs overflow-hidden">
            <div className="p-md border-b border-outline-variant bg-slate-50 flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">person_add</span>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Tambah Guru Baru</h3>
            </div>
            <div className="p-md space-y-md bg-white">
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">NIP (Nomor Induk Pegawai)</label>
                <input
                  required
                  placeholder="Contoh: 222"
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-semibold"
                  type="text"
                  value={teacherNip}
                  onChange={(e) => setTeacherNip(e.target.value)}
                />
              </div>
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">Nama Lengkap & Gelar</label>
                <input
                  required
                  placeholder="Contoh: Dr. Sarah Jenkins"
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-semibold"
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </div>
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">Alamat Email</label>
                <input
                  required
                  placeholder="Contoh: sarah@oakwood.sch.id"
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-semibold"
                  type="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                />
              </div>
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">Jabatan / Bidang</label>
                <input
                  placeholder="Contoh: Bahasa Inggris"
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-semibold"
                  type="text"
                  value={teacherPosition}
                  onChange={(e) => setTeacherPosition(e.target.value)}
                />
              </div>
              <div className="space-y-xs">
                <label className="text-xs font-bold text-on-surface-variant">Kata Sandi Awal</label>
                <input
                  required
                  placeholder="Min. 6 karakter"
                  className="w-full border border-outline-variant rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-semibold"
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={registering}
                className="w-full bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold py-2 rounded-lg transition-colors shadow-xs active:scale-95 disabled:opacity-75"
              >
                {registering ? "Mendaftarkan..." : "Daftarkan Guru"}
              </button>
            </div>
          </form>

          {/* Support Info Card */}

          <div className="relative rounded-xl overflow-hidden bg-primary p-md text-on-primary shadow-xs">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[80px]">support_agent</span>
            </div>
            <div className="relative z-10 space-y-md">
              <h4 className="text-sm font-bold">Butuh Bantuan Teknis?</h4>
              <p className="text-[10px] opacity-90 leading-relaxed font-semibold">
                Tim dukungan IT kami siap membantu Anda mengonfigurasi pemetaan radius GPS, server SMTP, dan sinkronisasi data guru 24/7.
              </p>
              <button
                onClick={() => showToast("Menghubungkan ke bantuan teknis...", "info")}
                className="w-full bg-white text-primary font-bold py-2 rounded-lg hover:bg-emerald-50 transition-all text-xs"
              >
                Hubungi Support
              </button>
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
