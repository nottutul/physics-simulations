import { Atom, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Atom className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              পদার্থবিজ্ঞান সিমুলেশন
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
            <Sparkles className="w-3.5 h-3.5" />
            ভার্চুয়াল ল্যাব
          </span>
        </div>
      </div>
    </header>
  );
}
