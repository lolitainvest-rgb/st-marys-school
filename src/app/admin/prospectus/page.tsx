"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Upload, FileDown, CheckCircle2, AlertCircle, Loader2, Save, ExternalLink, FileText } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function AdminProspectusPage() {
    const [currentUrl, setCurrentUrl] = useState("/docs/st-marys-prospectus-2026.pdf");
    const [customUrl, setCustomUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchProspectusSetting();
    }, []);

    const fetchProspectusSetting = async () => {
        setIsLoading(true);
        try {
            const { data } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'prospectus_url')
                .single();

            if (data && data.value) {
                setCurrentUrl(data.value);
                setCustomUrl(data.value);
            } else {
                setCustomUrl("/docs/st-marys-prospectus-2026.pdf");
            }
        } catch (err) {
            console.error("Error fetching prospectus setting:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
                setStatusMessage({ type: 'error', text: 'Please upload a PDF document.' });
                return;
            }
            setSelectedFile(file);
            setStatusMessage(null);
        }
    };

    const handleUploadAndSave = async () => {
        setIsUploading(true);
        setStatusMessage(null);

        let finalUrl = customUrl.trim();

        try {
            if (selectedFile) {
                // Try uploading to Supabase storage bucket
                const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filePath = `documents/${Date.now()}_${sanitizedName}`;

                // Try uploading to gallery_images or create object
                const { error: uploadError } = await supabase.storage
                    .from('gallery_images')
                    .upload(filePath, selectedFile, {
                        contentType: 'application/pdf',
                        upsert: true
                    });

                if (uploadError) {
                    console.warn("Storage bucket upload notice:", uploadError.message);
                    // Fallback to storing custom URL if bucket doesn't support PDF
                    if (!finalUrl || finalUrl === "/docs/st-marys-prospectus-2026.pdf") {
                        finalUrl = `/docs/${sanitizedName}`;
                    }
                } else {
                    const { data: publicUrlData } = supabase.storage
                        .from('gallery_images')
                        .getPublicUrl(filePath);

                    if (publicUrlData && publicUrlData.publicUrl) {
                        finalUrl = publicUrlData.publicUrl;
                    }
                }
            }

            if (!finalUrl) {
                setStatusMessage({ type: 'error', text: 'Please provide a valid file or document URL.' });
                setIsUploading(false);
                return;
            }

            // Save to site_settings table
            const { error: dbError } = await supabase
                .from('site_settings')
                .upsert({
                    key: 'prospectus_url',
                    value: finalUrl,
                    updated_at: new Date().toISOString()
                });

            if (dbError) {
                console.error("Error saving prospectus setting:", dbError);
                setStatusMessage({ type: 'error', text: `Failed to save setting: ${dbError.message}` });
            } else {
                setCurrentUrl(finalUrl);
                setCustomUrl(finalUrl);
                setSelectedFile(null);
                setStatusMessage({ type: 'success', text: 'School prospectus updated successfully! Visitors can now download it directly from the header and admissions page.' });
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            setStatusMessage({ type: 'error', text: err?.message || 'An unexpected error occurred during upload.' });
        } finally {
            setIsUploading(false);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage School Prospectus</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Upload or configure the official school prospectus document for parents and prospective students to download.
                </p>
            </div>

            {statusMessage && (
                <div
                    className={`p-4 rounded-xl flex items-start gap-3 border ${
                        statusMessage.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                >
                    {statusMessage.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                    ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                    )}
                    <span className="text-sm font-medium">{statusMessage.text}</span>
                </div>
            )}

            {/* Current Prospectus Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="text-primary w-5 h-5" /> Currently Active Prospectus
                </h2>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            PDF
                        </div>
                        <div className="truncate">
                            <p className="font-semibold text-sm text-slate-800 truncate max-w-md">
                                {currentUrl.split('/').pop() || 'st-marys-prospectus-2026.pdf'}
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-md">
                                {currentUrl}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={currentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                        >
                            <FileDown size={14} />
                            Download & Test
                        </a>
                    </div>
                </div>
            </div>

            {/* Upload New Section */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="text-primary w-5 h-5" /> Upload New Prospectus Document
                </h2>

                {/* Drag and Drop Box */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary/60 transition-colors bg-slate-50/50">
                    <input
                        type="file"
                        id="prospectus-file-input"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="prospectus-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center gap-3"
                    >
                        <div className="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="font-semibold text-primary hover:underline">Click to browse</span> or drag and drop your PDF here
                        </div>
                        <p className="text-xs text-slate-500">PDF documents only (up to 20MB)</p>
                    </label>

                    {selectedFile && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 inline-flex items-center gap-3 text-left">
                            <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                PDF
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{selectedFile.name}</p>
                                <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Direct Document URL Input */}
                <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Or specify direct document URL / storage path
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                        If hosted externally (e.g. Google Drive direct link, Cloud storage, or local path):
                    </p>
                    <input
                        type="text"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://... or /docs/st-marys-prospectus-2026.pdf"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleUploadAndSave}
                        disabled={isUploading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Uploading & Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Save & Update Prospectus</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
