export default function GalleryGrid() {
    // Placeholder images - in real app, fetch from Supabase
    const images = [
        { src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800", alt: "Students in class" },
        { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", alt: "Sports day" },
        { src: "https://images.unsplash.com/photo-1577896336186-8ad3d7c67fd3?auto=format&fit=crop&q=80&w=800", alt: "Cultural dance" },
        { src: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=800", alt: "Graduation" },
        { src: "https://images.unsplash.com/photo-1427504746696-ea5abc7dba3d?auto=format&fit=crop&q=80&w=800", alt: "Library time" },
        { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800", alt: "Playground fun" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 aspect-square">
                    <img
                        src={img.src}
                        alt={img.alt}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white font-medium">{img.alt}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
