"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
import GalleryImage from "./GalleryImage";

export default function GalleryGrid() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const supabase = createClient();

    useEffect(() => {
        const fetchImages = async () => {
            const { data } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setImages(data);
            setLoading(false);
        };
        fetchImages();
    }, []);

    const categories = ["All", "General", "Sports", "Events", "Academics"];

    const filteredImages = selectedCategory === "All"
        ? images
        : images.filter(img => img.category === selectedCategory);

    if (loading) return <div className="text-center py-20">Loading gallery...</div>;

    return (
        <div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                            ? "bg-primary text-white shadow-lg scale-105"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                    <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm hover:shadow-md transition-all">
                        <GalleryImage
                            src={image.image_url}
                            alt={image.caption || "Gallery Image"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <p className="text-white font-medium truncate">{image.caption}</p>
                            <p className="text-white/80 text-xs uppercase tracking-wider">{image.category}</p>
                        </div>
                    </div>
                ))}
            </div>
            {filteredImages.length === 0 && (
                <p className="text-center text-gray-500 py-10">No images found in this category.</p>
            )}
        </div>
    );
}
