export const runtime = 'edge';

import Link from "next/link";
import { PlusCircle, Users, FileText, Image } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default async function AdminDashboard() {
    const supabase = createClient();

    // Fetch counts
    const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
    const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
    const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Events</h3>
                        <span className="p-2 bg-blue-50 text-primary rounded-lg">
                            <PlusCircle size={20} />
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{eventCount || 0}</p>
                    <p className="text-sm text-green-600 mt-2">Active Calendar Items</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Gallery Photos</h3>
                        <span className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Image size={20} />
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{galleryCount || 0}</p>
                    <p className="text-sm text-gray-400 mt-2">Total uploaded images</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">News Posts</h3>
                        <span className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <FileText size={20} />
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{newsCount || 0}</p>
                    <p className="text-sm text-gray-400 mt-2">Active on ticker</p>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                    href="/admin/news"
                    className="flex items-center justify-center gap-2 p-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <PlusCircle size={18} /> Add News
                </Link>
                <Link
                    href="/admin/calendar"
                    className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <PlusCircle size={18} /> Add Event
                </Link>
                <Link
                    href="/admin/gallery"
                    className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <PlusCircle size={18} /> Upload Photo
                </Link>
            </div>

        </div>
    )
}
