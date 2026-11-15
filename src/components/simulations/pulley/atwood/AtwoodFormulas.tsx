"use client";

import { BookOpen, HelpCircle } from "lucide-react";

export function AtwoodFormulas() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
          পদার্থবিজ্ঞান ও গাণিতিক সূত্রাবলী (Physics & Formulas)
        </h3>
      </div>

      <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <p>
          <strong>অ্যাটউড মেশিন (Atwood Machine):</strong> এটি ১৭৮৪ সালে ইংরেজ
          গণিতবিদ জর্জ অ্যাটউড দ্বারা উদ্ভাবিত একটি চিরায়ত বলবিদ্যা যন্ত্র।
          এতে একটি মসৃণ ঘর্ষণহীন কপিকলের ওপর দিয়ে একটি হালকা অপ্রসারণশীল সুতার দুই
          প্রান্তে দুটি অসমান ভর <strong>m₁</strong> ও <strong>m₂</strong> ঝুলিয়ে
          অভিকর্ষজ ত্বরণ ও নিউটনের দ্বিতীয় গতিসূত্র যাচাই করা হয়।
        </p>

        {/* Free body diagrams */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {/* m1 (heavier) */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">
              ভারী ভর m₁-এর ক্ষেত্রে (নিচে নামছে):
            </h4>
            <p className="text-xs">
              যেহেতু ভর m₁ নিচের দিকে ত্বরণ <strong>a</strong> নিয়ে গতিশীল:
            </p>
            <div className="p-2 rounded bg-white dark:bg-zinc-900 font-mono text-xs border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
              m₁ · g - T = m₁ · a  — (১)
            </div>
          </div>

          {/* m2 (lighter) */}
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300">
              হালকা ভর m₂-এর ক্ষেত্রে (উপরে উঠছে):
            </h4>
            <p className="text-xs">
              যেহেতু ভর m₂ উপরের দিকে একই ত্বরণ <strong>a</strong> নিয়ে উঠছে:
            </p>
            <div className="p-2 rounded bg-white dark:bg-zinc-900 font-mono text-xs border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
              T - m₂ · g = m₂ · a  — (২)
            </div>
          </div>
        </div>

        {/* Acceleration & Tension */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            সাধারণ সমীকরণসমূহ (General Equations):
          </h4>

          <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500">ত্বরণ (Acceleration, a):</span>
              <br />
              <strong className="text-blue-600 dark:text-blue-400 text-sm">
                a = [ (m₁ - m₂) / (m₁ + m₂) ] · g
              </strong>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500">সুতার টান (Tension, T):</span>
              <br />
              <strong className="text-amber-600 dark:text-amber-400 text-sm">
                T = [ (2 · m₁ · m₂) / (m₁ + m₂) ] · g
              </strong>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500">ভূমিতে পৌঁছার সময় (Time, t):</span>
              <br />
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                t = √( 2h / a )
              </strong>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500">ভূমিতে আঘাতের বেগ (Impact v):</span>
              <br />
              <strong className="text-purple-600 dark:text-purple-400 text-sm">
                v = √( 2 · a · h )
              </strong>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">
              বর্তমান মানসমূহ (m₁ = ৫ কেজি, m₂ = ৩ কেজি, h = ৪০ মি, g = ৯.৮ মি/সে²):
            </p>
            <p>• ত্বরণ, a = (5 - 3)/(5 + 3) × 9.8 = <strong>2.45 m/s²</strong></p>
            <p>• সুতার টান, T = (2 × 5 × 3)/8 × 9.8 = <strong>36.75 N</strong></p>
            <p>• মাটিতে আঘাতের বেগ, v = √(2 × 2.45 × 40) = √196 = <strong>14.00 m/s</strong></p>
            <p>• মাটিতে পৌঁছাতে সময়, t = √(2 × 40 / 2.45) = √32.65 ≈ <strong>5.71 s</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
