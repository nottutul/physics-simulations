"use client";

import { BookOpen, HelpCircle } from "lucide-react";

export function InclineHangingFormulas() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
          পদার্থবিজ্ঞান ও গাণিতিক সূত্রাবলী (Physics & Formulas)
        </h3>
      </div>

      <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {/* Intro */}
        <p>
          এখানে একটি নততল (Incline Plane)-এর শীর্ষবিন্দুতে একটি মসৃণ কপিকল
          সংযুক্ত রয়েছে। নততলের ওপর ভর <strong>m₁</strong> অবস্থান করছে এবং
          উল্লম্বভাবে ভর <strong>m₂</strong> ঝুলছে। উভয় বস্তুকে একটি অপ্রসারণশীল
          হালকা সুতা দিয়ে কপি কলের ওপর দিয়ে সংযুক্ত করা হয়েছে।
        </p>

        {/* Free body diagrams */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {/* m1 */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">
              নততলে ভর m₁-এর বলের বিভাজন:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                অভিলম্ব প্রতিক্রিয়া:{" "}
                <code className="font-mono bg-blue-100/70 dark:bg-blue-900/40 px-1 py-0.5 rounded">
                  N₁ = m₁ · g · cos(θ)
                </code>
              </li>
              <li>
                নততল বরাবর অভিকর্ষের উপাংশ:{" "}
                <code className="font-mono bg-blue-100/70 dark:bg-blue-900/40 px-1 py-0.5 rounded">
                  F_parallel = m₁ · g · sin(θ)
                </code>
              </li>
              <li>সুতার টান T কপি কলের দিকে (নততলের উপরের দিকে) ক্রিয়া করে।</li>
            </ul>
          </div>

          {/* m2 */}
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300">
              উল্লম্ব ঝুলন্ত ভর m₂-এর বলের বিভাজন:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                নিম্নমুখী অভিকর্ষজ বল (ওজন):{" "}
                <code className="font-mono bg-purple-100/70 dark:bg-purple-900/40 px-1 py-0.5 rounded">
                  W₂ = m₂ · g
                </code>
              </li>
              <li>ঊর্ধ্বমুখী সুতার টান: T</li>
              <li>
                যদি m₂ নিচে নামে:{" "}
                <code className="font-mono bg-purple-100/70 dark:bg-purple-900/40 px-1 py-0.5 rounded">
                  m₂ · g - T = m₂ · a
                </code>
              </li>
            </ul>
          </div>
        </div>

        {/* Net acceleration & tension formula */}
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
                a = g · [ m₁ · sin(θ) - m₂ ] / (m₁ + m₂)
              </strong>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500">সুতার টান (Tension):</span>
              <br />
              <strong className="text-amber-600 dark:text-amber-400 text-sm">
                T = [ m₁ · m₂ · g · (1 + sin(θ)) ] / (m₁ + m₂)
              </strong>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 pt-1">
            <p>
              • যদি <strong>m₁ · sin(θ) &gt; m₂</strong> হয়, তবে ভর m₁ নততল
              বেয়ে নিচে নামবে এবং m₂ উপরে উঠবে।
            </p>
            <p>
              • যদি <strong>m₂ &gt; m₁ · sin(θ)</strong> হয়, তবে ভর m₂ নিচে
              নামবে এবং m₁ নততল বেয়ে উপরে উঠবে (যেমন বর্তমান চিত্রে: 5 · sin(38°)
              ≈ 3.08 kg &lt; 4 kg)।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
