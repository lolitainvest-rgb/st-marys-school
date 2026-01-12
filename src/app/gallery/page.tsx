import GalleryGrid from "@/components/GalleryGrid";
import { Image as ImageIcon } from "lucide-react";

export default function GalleryPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-primary sm:text-5xl mb-4 flex items-center justify-center gap-3">
                        School Gallery
                    </h1>
                    <p className="text-lg text-gray-600">
                        Capturing moments of learning, joy, and cultural celebration at St Mary's.
                    </p>
                </div>

                <GalleryGrid />
            </div>
        </div>
    )
}
