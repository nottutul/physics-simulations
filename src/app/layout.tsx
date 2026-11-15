import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "পদার্থবিজ্ঞান সিমুলেশন | Physics Simulations",
  description: "ইন্টারেক্টিভ পদার্থবিজ্ঞান সিমুলেশন এবং ভার্চুয়াল ল্যাব প্ল্যাটফর্ম",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
