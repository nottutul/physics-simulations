"use client";

import { BookOpen, HelpCircle } from "lucide-react";

export function DoubleInclineFormulas() {
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
          এখানে একটি দ্বিমুখী নততল (Double Incline Wedge)-এর শীর্ষবিন্দুতে একটি
          মসৃণ কপিকল সংযুক্ত রয়েছে। বাম পাশের নতি কোণ{" "}
          <strong>θ₁ = ৪৫°</strong> এবং ডান পাশের নতি কোণ{" "}
          <strong>θ₂ = ৬০°</strong>। উভয় তলের ওপর যথাক্রমে ভর{" "}
          <strong>m₁</strong> ও <strong>m₂</strong> একটি অবিভাজ্য হালকা সুতা
          দ্বারা পরস্পরের সাথে সংযুক্ত।
        </p>

        {/* Free body diagrams */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {/* m1 (45° incline) */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">
              বাম নততলে ভর m₁-এর বলের বিভাজন (θ₁ = ৪৫°):
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                অভিলম্ব প্রতিক্রিয়া:{" "}
                <code className="font-mono bg-blue-100/70 dark:bg-blue-900/40 px-1 py-0.5 rounded">
                  N₁ = m₁ · g · cos(45°)
                </code>
              </li>
              <li>
                নততল বরাবর নিচের দিকে বল:{" "}
                <code className="font-mono bg-blue-100/70 dark:bg-blue-900/40 px-1 py-0.5 rounded">
                  F₁ = m₁ · g · sin(45°)
                </code>
              </li>
              <li>সুতার টান T শীর্ষবিন্দুর (কপিকলের) দিকে ক্রিয়া করে।</li>
            </ul>
          </div>

          {/* m2 (60° incline) */}
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300">
              ডান নততলে ভর m₂-এর বলের বিভাজন (θ₂ = ৬০°):
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                অভিলম্ব প্রতিক্রিয়া:{" "}
                <code className="font-mono bg-purple-100/70 dark:bg-purple-900/40 px-1 py-0.5 rounded">
                  N₂ = m₂ · g · cos(60°)
                </code>
              </li>
              <li>
                নততল বরাবর নিচের দিকে বল:{" "}
                <code className="font-mono bg-purple-100/70 dark:bg-purple-900/40 px-1 py-0.5 rounded">
                  F₂ = m₂ · g · sin(60°)
                </code>
              </li>
              <li>সুতার টান T শীর্ষবিন্দুর (কপিকলের) দিকে ক্রিয়া করে।</li>
            </ul>
          </div>
        </div>

        {/* General equations */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            সাধারণ সমীকরণ (ঘর্ষণহীন অবস্থায় - Frictionless):
          </h4>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500">ত্বরণ (Acceleration):</span>
              <br />
              <strong className="text-blue-600 dark:text-blue-400 text-sm">
                a = g · [ m₂ · sin(60°) - m₁ · sin(45°) ] / (m₁ + m₂)
              </strong>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500">সুতার টান (Tension):</span>
              <br />
              <strong className="text-amber-600 dark:text-amber-400 text-sm">
                T = [ m₁ · m₂ · g · (sin(45°) + sin(60°)) ] / (m₁ + m₂)
              </strong>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 pt-1">
            <p>
              • যদি <strong>m₂ · sin(60°) &gt; m₁ · sin(45°)</strong> হয় (যেমন
              উভয় ভর ৫ কেজি হলে: 5 · 0.866 &gt; 5 · 0.707), তবে সিস্টেমটি ডান
              দিকে গতিশীল হবে (m₂ নিচে নামবে এবং m₁ উপরে উঠবে)।
            </p>
            <p>
              • যদি <strong>m₁ · sin(45°) &gt; m₂ · sin(60°)</strong> হয়, তবে
              সিস্টেমটি বাম দিকে গতিশীল হবে (m₁ নিচে নামবে এবং m₂ উপরে উঠবে)।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
