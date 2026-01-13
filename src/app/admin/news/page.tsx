"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar as CalendarIcon, Save, X, Pencil } from "lucide-react";
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

    const [editingId, setEditingId] = useState<number | null>(null);

    // ... (keep useEffect and fetchNews same)

    const handleEdit = (item: any) => {
        setFormData({ title: item.title, content: item.content, image_url: item.image_url || "" });
        setEditingId(item.id);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setFormData({ title: "", content: "", image_url: "" });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let error;

        if (editingId) {
            // Update existing
            const { error: updateError } = await supabase
                .from('news')
                .update({ title: formData.title, content: formData.content, image_url: formData.image_url })
                .eq('id', editingId);
            error = updateError;
        } else {
            // Create new
            const { error: insertError } = await supabase
                .from('news')
                .insert([formData]);
            error = insertError;
        }

        if (!error) {
            handleCancel();
            fetchNews();
        } else {
            alert(editingId ? "Failed to update news." : "Failed to add news.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage News</h1>
                <button
                    onClick={() => { handleCancel(); setIsAdding(true); }}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Add News
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{editingId ? "Edit Announcement" : "New Announcement"}</h3>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
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
                            <button type="button" onClick={handleCancel} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                {editingId ? "Update News" : "Publish"}
                            </button>
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
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-blue-500 hover:text-blue-700 p-2"
                                    title="Edit"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-400 hover:text-red-600 p-2"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {news.length === 0 && <p className="text-gray-500 text-center py-8">No news items found.</p>}
                </div>
            )}
        </div>
    );
}
