export const runtime = 'edge';

import Hero from "@/components/Hero";
import NewsTicker from "@/components/NewsTicker";
import Link from "next/link";
import { ArrowRight, Calendar, Users, BookOpen, Heart, ShieldCheck, Sparkles, FileDown, CheckCircle2 } from "lucide-react";
import { getSiteSetting } from "@/utils/getSiteSetting";
import GalleryImage from "@/components/GalleryImage";

export default async function Home() {
  const principalWelcome = await getSiteSetting('principal_welcome',
    `We are delighted to welcome you to St Mary's Catholic Primary School. Our school is dedicated to delivering quality and affordable primary school education in a safe and conducive environment centred on Christ's teachings.\n\nAs we embark on the 2026 academic year in collaboration with the Catholic Diocese of Francistown, we renew our commitment to excellence under our motto "Forever Onward", instilling high morals, Botho, and a lifelong love for learning in every child.`
  );

  const prospectusUrl = await getSiteSetting('prospectus_url', '/docs/st-marys-prospectus-2026.pdf');

  // Fetch latest gallery images
  let galleryImages: any[] = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      // Use direct client for server-side fetching to be robust
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (data) galleryImages = data;
    }
  } catch (e) {
    console.error("Failed to fetch gallery images", e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NewsTicker />
      <Hero />

      {/* Principal's Welcome Section */}
      <section className="py-16 md:py-20 bg-blue-50/30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xs border border-blue-100/80 text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              Welcome Message
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl mt-3 tracking-tight">
              Principal&apos;s Welcome
            </h2>
            <div className="mt-5 max-w-3xl mx-auto text-base sm:text-lg text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
              {principalWelcome}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-8 bg-blue-50/70 rounded-2xl hover:shadow-lg transition-all border border-blue-100/80 group">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-5 shadow-xs group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Academic Excellence</h3>
              <p className="text-slate-600 mb-5 text-sm sm:text-base leading-relaxed">
                Comprehensive curriculum designed to nurture intellectual curiosity, diligence, and academic achievement.
              </p>
              <Link href="/about" className="text-primary font-bold text-sm inline-flex items-center hover:underline">
                Read About Our School <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="p-8 bg-amber-50/70 rounded-2xl hover:shadow-lg transition-all border border-amber-100/80 group">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-slate-900 mb-5 shadow-xs group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Events &amp; Term Dates</h3>
              <p className="text-slate-600 mb-5 text-sm sm:text-base leading-relaxed">
                Stay updated with our school term dates, holidays, liturgical celebrations, and cultural activities.
              </p>
              <Link href="/calendar" className="text-primary font-bold text-sm inline-flex items-center hover:underline">
                View Calendar <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="p-8 bg-blue-50/70 rounded-2xl hover:shadow-lg transition-all border border-blue-100/80 group">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-5 shadow-xs group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admissions 2026</h3>
              <p className="text-slate-600 mb-5 text-sm sm:text-base leading-relaxed">
                Join the St Mary&apos;s Catholic school community. Learn about our admissions steps, requirements, and fee structure.
              </p>
              <Link href="/admissions" className="text-primary font-bold text-sm inline-flex items-center hover:underline">
                Apply Today <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Botho Preview Section */}
      <section className="py-16 bg-amber-50/35 backdrop-blur-xs border-y border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                Foundational Virtues
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mt-3 tracking-tight">
                Our Values &amp; Botho
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl text-base">
                Centred on Christ&apos;s teachings and guided by the African cultural principle of Botho, we foster 10 foundational virtues.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-bold text-sm transition-all shadow-xs"
            >
              <span>Explore All 10 Values</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-rose-100/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Love &amp; Compassion</h3>
              <p className="text-xs text-slate-600">Empathy and care for every peer and community member.</p>
            </div>

            <div className="bg-amber-50/40 backdrop-blur-md p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Faith &amp; Hope</h3>
              <p className="text-xs text-slate-600">Nurturing Christian character and spiritual purpose.</p>
            </div>

            <div className="bg-blue-50/40 backdrop-blur-md p-5 rounded-2xl border border-blue-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Respect &amp; Dignity</h3>
              <p className="text-xs text-slate-600">Honouring the human worth and self-respect of each child.</p>
            </div>

            <div className="bg-amber-50/40 backdrop-blur-md p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Responsibility</h3>
              <p className="text-xs text-slate-600">Accountability for learning and stewardship of our community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* School Prospectus Download Strip */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xs uppercase font-extrabold tracking-widest text-secondary block mb-1">
                2026 Academic Year
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Download the Official School Prospectus
              </h2>
              <p className="text-blue-100 text-sm sm:text-base mt-1">
                Get full details on curriculum, tuition fees, admissions guidelines, and student life.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href={prospectusUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-secondary text-slate-900 font-extrabold rounded-full hover:bg-yellow-400 transition-all shadow-md text-sm sm:text-base"
              >
                <FileDown size={18} />
                <span>Download Prospectus (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-16 bg-blue-50/35 backdrop-blur-xs border-t border-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">Life at St Mary&apos;s</h2>
            <p className="mt-4 text-lg text-slate-600">A glimpse into our vibrant school community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {galleryImages.length > 0 ? (
              galleryImages.map((img: any) => (
                <div key={img.id} className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-slate-200/60">
                  <GalleryImage
                    src={img.image_url}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    alt={img.caption || "Gallery Image"}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                    <p className="text-white text-xs font-semibold truncate w-full drop-shadow-md">{img.caption}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-slate-200/60"><img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Students" /></div>
                <div className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-slate-200/60"><img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Sports" /></div>
                <div className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-slate-200/60"><img src="https://images.unsplash.com/photo-1577896336186-8ad3d7c67fd3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Culture" /></div>
                <div className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-slate-200/60"><img src="https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Events" /></div>
              </>
            )}
          </div>

          <div className="text-center">
            <Link href="/gallery" className="inline-flex items-center text-primary font-bold hover:underline py-2.5 px-6 bg-white/95 backdrop-blur-md rounded-full shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
              View Full Gallery <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
