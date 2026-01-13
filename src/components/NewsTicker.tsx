"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function NewsTicker() {
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch latest 3 news items
      const { data: newsData } = await supabase
        .from('news')
        .select('title')
        .order('created_at', { ascending: false })
        .limit(3);

      // 2. Fetch upcoming 3 events
      const { data: eventsData } = await supabase
        .from('events')
        .select('title, date')
        .gte('date', new Date().toISOString().split('T')[0]) // Upcoming only
        .order('date', { ascending: true })
        .limit(3);

      const items: string[] = [];

      // Add News
      if (newsData && newsData.length > 0) {
        newsData.forEach((n: any) => items.push(`📢 ${n.title}`));
      }

      // Add Events
      if (eventsData && eventsData.length > 0) {
        eventsData.forEach((e: any) => items.push(`🗓️ ${new Date(e.date).toLocaleDateString()}: ${e.title}`));
      }

      // Fallback if empty
      if (items.length === 0) {
        items.push("📢 Welcome to St Mary's Primary School!");
        items.push("🎓 Admissions Open for 2026");
      }

      setTickerItems(items);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white text-primary py-2 overflow-hidden border-b-4 border-yellow-500">
      <div className="whitespace-nowrap animate-marquee flex gap-8 font-bold text-sm md:text-base uppercase tracking-wider">
        {/* Duplicate items to ensure smooth infinite scroll */}
        {tickerItems.map((item, i) => (
          <span key={`original-${i}`}>{item}</span>
        ))}
        {tickerItems.map((item, i) => (
          <span key={`duplicate-${i}`}>{item}</span>
        ))}
        {tickerItems.map((item, i) => (
          <span key={`triplicate-${i}`}>{item}</span>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); } /* simple translation might need adjustment based on width */
        }
      `}</style>
    </div>
  )
}
