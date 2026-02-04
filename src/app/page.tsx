export const runtime = 'edge';

import Hero from "@/components/Hero";
import NewsTicker from "@/components/NewsTicker";
import Link from "next/link";
import { ArrowRight, Calendar, Users, BookOpen } from "lucide-react";
import { getSiteSetting } from "@/utils/getSiteSetting";
import GalleryImage from "@/components/GalleryImage";

export default async function Home() {
  const principalWelcome = await getSiteSetting('principal_welcome',
    `We are delighted to welcome you to St Mary's English Medium Primary School. Our school is dedicated to nurturing young minds in a vibrant and culturally grounded environment.\n\nAs we embark on the 2026 academic year, we renew our commitment to excellence ("ONWARD FOREVER ONWARD") and to fostering a community where every child feels valued and inspired to learn.`
  );

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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Principal's Welcome
            </h2>
            <div className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 whitespace-pre-wrap">
              {principalWelcome}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-shadow border border-blue-100">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Excellence</h3>
              <p className="text-gray-600 mb-4">
                We offer a comprehensive curriculum designed to challenge and support every student.
              </p>
              <Link href="/about" className="text-primary font-medium inline-flex items-center hover:underline">
                Read About Us <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="p-6 bg-yellow-50 rounded-xl hover:shadow-lg transition-shadow border border-yellow-100">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-primary mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Events & Term Dates</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with our school term dates, holidays, and upcoming cultural activities.
              </p>
              <Link href="/calendar" className="text-primary font-medium inline-flex items-center hover:underline">
                View Calendar <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-shadow border border-blue-100">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admissions</h3>
              <p className="text-gray-600 mb-4">
                Join the St Mary's family. Find out about our application process and school fees.
              </p>
              <Link href="/admissions" className="text-primary font-medium inline-flex items-center hover:underline">
                Apply Today <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Life at St Mary's</h2>
            <p className="mt-4 text-lg text-gray-600">A glimpse into our vibrant school community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {galleryImages.length > 0 ? (
              galleryImages.map((img: any) => (
                <div key={img.id} className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
                  <GalleryImage
                    src={img.image_url}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    alt={img.caption || "Gallery Image"}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                    <p className="text-white text-xs font-medium truncate w-full">{img.caption}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all"><img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Students" /></div>
                <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all"><img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Sports" /></div>
                <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all"><img src="https://images.unsplash.com/photo-1577896336186-8ad3d7c67fd3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Culture" /></div>
                <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all"><img src="https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Events" /></div>
              </>
            )}
          </div>

          <div className="text-center">
            <Link href="/gallery" className="inline-flex items-center text-primary font-bold hover:underline py-2 px-4 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              View Full Gallery <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
