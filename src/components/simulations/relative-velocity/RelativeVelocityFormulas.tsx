"use client";

import { BookOpen, Sparkles, HelpCircle } from "lucide-react";

export function RelativeVelocityFormulas() {
  return (
    <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-100 rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <h3 className="font-bold text-lg text-zinc-100">
          পদার্থবিজ্ঞান ও গাণিতিক সূত্রাবলী (Physics & Mathematical Derivations)
        </h3>
      </div>

      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        {/* Intro */}
        <p>
          গতিবিদ্যা (Kinematics)-র একটি অত্যন্ত গুরুত্বপূর্ণ ও আকর্ষণীয় বিষয় হলো
          <strong className="text-zinc-100"> আপেক্ষিক বেগ (Relative Velocity)</strong>। যখন কোনো চলমান
          বস্তুর (যেমন: বাস, গাড়ি) ওপর থেকে অপর কোনো গতিশীল বস্তুকে (যেমন: বৃষ্টি, বাতাস)
          পর্যবেক্ষণ করা হয়, তখন পর্যবেক্ষকের নিজস্ব গতির কারণে দ্বিতীয় বস্তুর বেগ
          প্রকৃত বেগ হতে ভিন্ন দেখায়।
        </p>

        {/* Fundamental Equations */}
        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-3">
          <h4 className="font-semibold text-blue-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>আপেক্ষিক বেগের মৌলিক ভেক্টর বিয়োগ নীতি:</span>
          </h4>
          <p className="text-xs text-zinc-300">
            যেকোনো বস্তু B-এর সাপেক্ষে বস্তু A-এর আপেক্ষিক বেগ:
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-blue-800/60 font-mono text-center text-sm font-bold text-blue-200">
            V<sub>A/B</sub> = V<sub>A</sub> - V<sub>B</sub> = V<sub>A</sub> + (-V<sub>B</sub>)
          </div>
          <p className="text-xs text-zinc-300">
            বাসের (V<sub>b</sub>) সাপেক্ষে বাতাসের প্রভাবে পতিত বৃষ্টির (V<sub>r</sub>) আপেক্ষিক বেগ:
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-purple-800/60 font-mono text-center text-sm font-bold text-purple-200">
            V<sub>rb</sub> = (V<sub>w</sub> - V<sub>b</sub>) + V<sub>r</sub> = V<sub>w</sub> + (-V<sub>b</sub>) + V<sub>r</sub>
          </div>
        </div>

        {/* Component Analysis Grid */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {/* Magnitudes and Angles */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 space-y-2">
            <h4 className="font-semibold text-purple-300">
              উপাংশ ও লব্ধির মান:
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300">
              <li>
                অনুভূমিক আপেক্ষিক বেগ উপাংশ:
                <code className="block mt-1 font-mono bg-purple-900/40 text-purple-200 px-2 py-1 rounded border border-purple-800/50">
                  v_rel,x = v_W - v_B = v_W + (-v_B)
                </code>
              </li>
              <li>
                উল্লম্ব বেগ উপাংশ (অধোমুখী):
                <code className="block mt-1 font-mono bg-purple-900/40 text-purple-200 px-2 py-1 rounded border border-purple-800/50">
                  v_rel,y = v_R
                </code>
              </li>
              <li>
                লব্ধি আপেক্ষিক বেগ:
                <code className="block mt-1 font-mono bg-purple-900/40 text-purple-200 px-2 py-1 rounded border border-purple-800/50">
                  v_RB = √[(v_W - v_B)² + v_R²]
                </code>
              </li>
              <li>
                উল্লম্বের সাথে বৃষ্টির আপেক্ষিক কোণ:
                <code className="block mt-1 font-mono bg-purple-900/40 text-purple-200 px-2 py-1 rounded border border-purple-800/50">
                  tan(θ) = |v_W - v_B| / v_R  ⟹  θ = tan⁻¹(|v_W - v_B| / v_R)
                </code>
              </li>
            </ul>
          </div>

          {/* Reference Frames */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 space-y-2">
            <h4 className="font-semibold text-amber-300">
              প্রসঙ্গ কাঠামোর পার্থক্য (Reference Frames):
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-zinc-100">১. ভূমির সাপেক্ষে (Ground Frame):</strong>
                <p className="text-zinc-400 mt-0.5">
                  ভূমিতে দাঁড়ানো স্থির পর্যবেক্ষকের কাছে বৃষ্টি কেবল বাতাসের কারণে হেলে পড়ে। বৃষ্টির খাঁটি অনুভূমিক বেগ = v_W।
                </p>
              </div>
              <div>
                <strong className="text-zinc-100">২. বাসের সাপেক্ষে (Bus Frame):</strong>
                <p className="text-zinc-400 mt-0.5">
                  বাসের যাত্রীর কাছে বাসটি স্থির মনে হয়। বৃষ্টি বাসের বিপরীত বেগ (-V<sub>b</sub>) যুক্ত হয়ে অনুভূত হয়, যার ফলে অনুভূমিক বেগ হয় (V<sub>w</sub> - V<sub>b</sub>)।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Wetting Conditions Detailed Cards */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-zinc-100 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>কখন বাসের কোন পাশের কাচ ভিজবে? (Detailed Case Analysis)</span>
          </h4>

          <div className="grid md:grid-cols-3 gap-3">
            {/* Case 1: Front Wet */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/70 space-y-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                শর্ত ১: v_B &gt; v_W
              </span>
              <h5 className="font-bold text-sm text-blue-200 pt-1">
                সামনের কাচ ভিজবে 💦
              </h5>
              <p className="text-xs text-zinc-300">
                বাসের অনুভূমিক বেগ বাতাসের বেগের চেয়ে বেশি হলে (v_W - v_B &lt; 0),
                বাসের সাপেক্ষে বৃষ্টি সম্মুখ দিক থেকে এসে পিছনের দিকে হেলে পড়ে। তাই
                সামনের কাচ ভিজে যাবে এবং পিছনের খাড়া কাচ শুকনা থাকবে।
              </p>
            </div>

            {/* Case 2: Rear Wet */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/70 space-y-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                শর্ত ২: v_W &gt; v_B
              </span>
              <h5 className="font-bold text-sm text-amber-200 pt-1">
                পিছনের কাচ ভিজবে 💦
              </h5>
              <p className="text-xs text-zinc-300">
                বাতাস বাসের চেয়ে দ্রুতগতিতে বইলে (v_W - v_B &gt; 0), বাতাস বৃষ্টিকে বাসের
                চেয়ে দ্রুত সামনে ঠেলে নিয়ে আসে। ফলে বাসের সাপেক্ষে বৃষ্টি পিছন থেকে
                এসে পিছনের কাচে আঘাত করবে।
              </p>
            </div>

            {/* Case 3: Roof Only */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/70 space-y-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                শর্ত ৩: v_W = v_B
              </span>
              <h5 className="font-bold text-sm text-emerald-200 pt-1">
                কেবল ছাদ ভিজবে 🛡️
              </h5>
              <p className="text-xs text-zinc-300">
                বাস ও বাতাসের অনুভূমিক বেগ হুবহু সমান হলে (v_W - v_B = 0), বাসের সাপেক্ষে
                বৃষ্টির কোনো অনুভূমিক বেগ থাকে না। বৃষ্টি সম্পূর্ণ উল্লম্বভাবে নিচে পড়বে,
                ফলে পিছনের খাড়া কাচ সম্পূর্ণ শুকনা থাকবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
