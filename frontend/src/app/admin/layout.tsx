"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col min-h-screen flex-1">
        <Header role="admin" onMenuClick={() => setSidebarOpen(true)} />
        <main className="ml-0 lg:ml-[280px] p-md sm:p-lg flex-grow w-full lg:w-[calc(100%-280px)] max-w-container-max transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
