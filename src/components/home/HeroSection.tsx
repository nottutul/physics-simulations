import { Compass, Search, SlidersHorizontal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
          <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          ইন্টারেক্টিভ সিমুলেশন প্ল্যাটফর্ম
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          পদার্থবিজ্ঞানের রোমাঞ্চকর{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            সিমুলেশন ল্যাব
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          বিভিন্ন পদার্থবৈজ্ঞানিক সূত্র ও মেকানিজম সরাসরি পরীক্ষা ও পর্যবেক্ষণ করার জন্য আপনার পছন্দের সিমুলেশনটি নির্বাচন করুন।
        </p>
      </div>

      {/* Filter / Search placeholder row */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm max-w-3xl mx-auto">
        <div className="relative w-full sm:w-auto flex-1 flex items-center px-3">
          <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="সিমুলেশন খুঁজুন..."
            className="w-full bg-transparent text-sm focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 pt-2 sm:pt-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            সকল বিভাগ
          </span>
        </div>
      </div>
    </section>
  );
}
