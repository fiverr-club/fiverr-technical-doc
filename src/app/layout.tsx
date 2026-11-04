import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIVERREX. DOCS — Tài liệu Kỹ thuật & Kiến trúc Hệ thống (fiverr-club)",
  description:
    "Interactive Technical Documentation Portal for FIVERREX (fiverr-club): Java 21, Spring Boot 3.3.4, DDD + Hexagonal Architecture, 9 Microservices, 28 REST APIs, Apache Kafka KRaft, PostgreSQL 16, Next.js 15, Kubernetes & Helm v3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
