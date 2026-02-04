"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface GalleryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
}

export default function GalleryImage({ src, alt, className, ...props }: GalleryImageProps) {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    if (error || !src) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 w-full h-full min-h-[100px]`}>
                <ImageOff size={24} />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt || "Gallery Image"}
            className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            {...props}
        />
    );
}
