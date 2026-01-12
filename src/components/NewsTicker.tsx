"use client";

export default function NewsTicker() {
  return (
    <div className="bg-white text-primary py-2 overflow-hidden border-b-4 border-yellow-500">
      <div className="whitespace-nowrap animate-marquee flex gap-8 font-bold text-sm md:text-base uppercase tracking-wider">
        <span>📢 School Reopens for 2026 on January 5th</span>
        <span>🎓 2026 Admissions Open - Apply Now!</span>
        <span>🗓️ Check the new Term Dates in the Calendar</span>
        <span>📢 School Reopens for 2026 on January 5th</span>
        <span>🎓 2026 Admissions Open - Apply Now!</span>
      </div>

      {/* Add Custom Animation Style in globals.css later if needed, or use tailwind arbitrary values */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
