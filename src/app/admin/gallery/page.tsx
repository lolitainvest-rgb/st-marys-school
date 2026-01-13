"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ image_url: "", caption: "", category: "General" });
    const supabase = createClient();

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setImages(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (!error) {
            fetchGallery();
        } else {
            alert("Failed to delete image.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Split by newline, comma, or space and remove empty strings
        const urls = formData.image_url.split(/[\n,\s]+/).filter(url => url.trim().length > 0);

        if (urls.length === 0) {
            alert("Please enter at least one valid URL");
            return;
        }

        const inserts = urls.map(url => ({
            image_url: url.trim(),
            caption: formData.caption,
            category: formData.category
        }));

        const { error } = await supabase.from('gallery').insert(inserts);

        if (!error) {
            setFormData({ image_url: "", caption: "", category: "General" });
            setIsAdding(false);
            fetchGallery();
        } else {
            console.error(error);
            alert("Failed to add images. Check console for details.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Add Image
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Add Image</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URLs (Bulk Upload)</label>
                            <div className="text-xs text-blue-600 mb-2 p-2 bg-blue-50 rounded">
                                <strong>Tip:</strong> Paste multiple image links here. Separate them with a new line, comma, or space.
                            </div>
                            <textarea
                                className="w-full border rounded-md px-3 py-2 h-32 font-mono text-sm"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder={`https://example.com/image1.jpg\nhttps://example.com/image2.jpg`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
                            <input
                                type="text"
                                className="w-full border rounded-md px-3 py-2"
                                value={formData.caption}
                                onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Applied to all uploaded images"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Album / Category</label>
                            <select
                                className="w-full border rounded-md px-3 py-2"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>General</option>
                                <option>Sports</option>
                                <option>Events</option>
                                <option>Academics</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                Upload {formData.image_url.split(/[\n,\s]+/).filter(Boolean).length > 1 ? "Images" : "Image"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading gallery...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group relative">
                            <div className="aspect-square relative bg-gray-100">
                                {/* We use img tag here for simplicity in admin view if domain not whitelisted in Next.js Image */}
                                <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm truncate">{img.caption || "No caption"}</p>
                                <p className="text-xs text-gray-500">{img.category}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(img.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {images.length === 0 && <p className="col-span-full text-center text-gray-500 py-8">No images found.</p>}
                </div>
            )}
        </div>
    );
}
