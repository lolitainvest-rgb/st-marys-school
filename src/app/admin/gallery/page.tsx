"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, X, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

interface UploadStatus {
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Upload state
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatuses, setUploadStatuses] = useState<Record<string, UploadStatus>>({});
    const [caption, setCaption] = useState("");
    const [category, setCategory] = useState("General");
    const [isUploading, setIsUploading] = useState(false);

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

        if (!error && data) setImages(data);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (!error) fetchGallery();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);

            // Initialize status for new files
            const newStatuses = { ...uploadStatuses };
            newFiles.forEach(file => {
                newStatuses[file.name] = {
                    fileName: file.name,
                    progress: 0,
                    status: 'pending'
                };
            });
            setUploadStatuses(newStatuses);
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(files.filter(f => f.name !== fileName));
        const newStatuses = { ...uploadStatuses };
        delete newStatuses[fileName];
        setUploadStatuses(newStatuses);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

            if (newFiles.length > 0) {
                setFiles(prev => [...prev, ...newFiles]);

                // Initialize status for new files
                const newStatuses = { ...uploadStatuses };
                newFiles.forEach(file => {
                    newStatuses[file.name] = {
                        fileName: file.name,
                        progress: 0,
                        status: 'pending'
                    };
                });
                setUploadStatuses(newStatuses);
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return;

        setIsUploading(true);

        for (const file of files) {
            // Update status to uploading
            setUploadStatuses(prev => ({
                ...prev,
                [file.name]: { ...prev[file.name], status: 'uploading', progress: 10 }
            }));

            try {
                // 1. Upload to Supabase Storage
                // Sanitize filename to avoid issues with spaces or special chars
                const fileExt = file.name.split('.').pop();
                const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_'); // Keep dots for extension
                const uniqueName = `${Date.now()}_${sanitizedFileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('gallery_images')
                    .upload(uniqueName, file);

                if (uploadError) throw uploadError;

                setUploadStatuses(prev => ({
                    ...prev,
                    [file.name]: { ...prev[file.name], progress: 50 }
                }));

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('gallery_images')
                    .getPublicUrl(uniqueName);

                // 3. Insert into Database
                const { error: dbError } = await supabase
                    .from('gallery')
                    .insert({
                        image_url: publicUrl,
                        caption: caption, // Optional: apply same caption to all, or allow individual editing in future
                        category: category
                    });

                if (dbError) throw dbError;

                // Mark completed
                setUploadStatuses(prev => ({
                    ...prev,
                    [file.name]: { ...prev[file.name], status: 'completed', progress: 100 }
                }));

            } catch (error: any) {
                console.error("Upload error:", error);
                setUploadStatuses(prev => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        status: 'error',
                        progress: 0,
                        error: error.message || "Failed to upload"
                    }
                }));
            }
        }

        setIsUploading(false);

        // If all succeeded, refresh and close after a delay
        const allCompleted = files.every(f => uploadStatuses[f.name]?.status === 'completed');
        if (allCompleted) {
            setTimeout(() => {
                setIsAdding(false);
                setFiles([]);
                setUploadStatuses({});
                fetchGallery();
            }, 1500);
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
                    <Plus size={20} /> Add Images
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Upload Images</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-6">
                        {/* File Drop / Select */}
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploading}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
                                    <Upload size={24} />
                                </div>
                                <span className="text-gray-700 font-medium font-sans">Click to select photos</span>
                                <span className="text-sm text-gray-500 mt-1 font-sans">or drag and drop here (Max 5MB each)</span>
                            </label>
                        </div>

                        {/* Selected Files List & Progress */}
                        {files.length > 0 && (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {files.map((file) => {
                                    const status = uploadStatuses[file.name] || { status: 'pending', progress: 0 };
                                    return (
                                        <div key={file.name} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                <ImageIcon size={18} className="text-gray-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between mb-1">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <span className="text-xs text-gray-500">{status.status === 'completed' ? 'Done' : `${status.progress}%`}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${status.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${status.progress}%` }}
                                                    />
                                                </div>
                                                {status.error && <p className="text-xs text-red-500 mt-1">{status.error}</p>}
                                            </div>

                                            {status.status === 'pending' && (
                                                <button type="button" onClick={() => removeFile(file.name)} className="text-gray-400 hover:text-red-500">
                                                    <X size={18} />
                                                </button>
                                            )}
                                            {status.status === 'completed' && <CheckCircle size={18} className="text-green-500" />}
                                            {status.status === 'uploading' && <Loader2 size={18} className="text-blue-500 animate-spin" />}
                                            {status.status === 'error' && <AlertCircle size={18} className="text-red-500" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Metadata Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md px-3 py-2"
                                    value={caption}
                                    onChange={e => setCaption(e.target.value)}
                                    placeholder="Applied to all images"
                                    disabled={isUploading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Album / Category</label>
                                <select
                                    className="w-full border rounded-md px-3 py-2"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    disabled={isUploading}
                                >
                                    <option>General</option>
                                    <option>Sports</option>
                                    <option>Events</option>
                                    <option>Academics</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-2 rounded-md font-medium text-white flex items-center gap-2 ${files.length === 0 || isUploading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                    }`}
                                disabled={files.length === 0 || isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        Upload {files.length > 0 ? `${files.length} Files` : ''}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader2 size={40} className="animate-spin mb-4 text-primary" />
                    <p>Loading gallery...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group relative">
                            <div className="aspect-square relative bg-gray-100">
                                <img
                                    src={img.image_url}
                                    alt={img.caption}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm truncate">{img.caption || "No caption"}</p>
                                <p className="text-xs text-gray-500 w-full flex justify-between">
                                    <span>{img.category}</span>
                                    <span>{new Date(img.created_at).toLocaleDateString()}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(img.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No images found</p>
                            <p className="text-sm text-gray-400">Click "Add Images" to create your gallery</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
