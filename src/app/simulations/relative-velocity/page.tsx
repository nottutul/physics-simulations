import { RelativeVelocityNav } from "@/components/simulations/relative-velocity/RelativeVelocityNav";
import { RelativeVelocitySim } from "@/components/simulations/relative-velocity/RelativeVelocitySim";

export const metadata = {
  title: "আপেক্ষিক বেগ: বাস, বাতাস ও বৃষ্টি | Relative Velocity Simulation",
  description:
    "চলমান বাস, বাতাস ও বৃষ্টির আপেক্ষিক বেগ, ভেক্টর ডায়াগ্রাম এবং কাচ ভেজার বাস্তবসম্মত পদার্থবিজ্ঞান সিমুলেশন",
};

export default function RelativeVelocityPage() {
  return (
    <div className="dark bg-zinc-950 text-zinc-100 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <RelativeVelocityNav />
        <RelativeVelocitySim />
      </div>
    </div>
  );
}
