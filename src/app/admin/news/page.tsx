"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar as CalendarIcon, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", image_url: "" });
    const supabase = createClient();

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setNews(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;

        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) {
            fetchNews();
        } else {
            alert("Failed to delete news item.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('news').insert([formData]);
        if (!error) {
            setFormData({ title: "", content: "", image_url: "" });
            setIsAdding(false);
            fetchNews();
        } else {
            alert("Failed to add news item.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage News</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Add News
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">New Announcement</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full border rounded-md px-3 py-2"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <textarea
                                className="w-full border rounded-md px-3 py-2 h-32"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </div>
                        {/* Image URL optional for now, future enhancement: upload */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                            <input
                                type="text"
                                className="w-full border rounded-md px-3 py-2"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Publish</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading news...</p>
            ) : (
                <div className="grid gap-4">
                    {news.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{item.content.substring(0, 100)}...</p>
                                <div className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                                    <CalendarIcon size={12} />
                                    {new Date(item.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-400 hover:text-red-600 p-2"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {news.length === 0 && <p className="text-gray-500 text-center py-8">No news items found.</p>}
                </div>
            )}
        </div>
    );
}
