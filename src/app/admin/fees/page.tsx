"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, FileDown, Upload, CheckCircle2, AlertCircle, Loader2, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

interface CustomFeeItem {
    id: string;
    name: string;
    amount: string;
    frequency: string;
}

export default function AdminFeesPage() {
    const [registrationFee, setRegistrationFee] = useState("P 500.00");
    const [standardPrimaryFee, setStandardPrimaryFee] = useState("P 3,500.00");
    const [preschoolFee, setPreschoolFee] = useState("P 2,800.00");
    const [customItems, setCustomItems] = useState<CustomFeeItem[]>([]);
    const [notes, setNotes] = useState("*Fees are subject to change. Please contact the Bursar's office for the official fee structure and payment plans.");

    // Fees Schedule File
    const [scheduleUrl, setScheduleUrl] = useState("/docs/st-marys-fees-schedule-2026.pdf");
    const [customScheduleInput, setCustomScheduleInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchFeesData();
    }, []);

    const fetchFeesData = async () => {
        setIsLoading(true);
        try {
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['school_fees_data', 'fee_schedule_url']);

            if (data) {
                data.forEach((row: { key: string; value: string }) => {
                    if (row.key === 'school_fees_data' && row.value) {
                        try {
                            const parsed = JSON.parse(row.value);
                            if (parsed.registrationFee) setRegistrationFee(parsed.registrationFee);
                            if (parsed.standardPrimaryFee) setStandardPrimaryFee(parsed.standardPrimaryFee);
                            if (parsed.preschoolFee) setPreschoolFee(parsed.preschoolFee);
                            if (parsed.notes) setNotes(parsed.notes);
                            if (Array.isArray(parsed.customItems)) setCustomItems(parsed.customItems);
                        } catch {
                            // ignore json error
                        }
                    }
                    if (row.key === 'fee_schedule_url' && row.value) {
                        setScheduleUrl(row.value);
                        setCustomScheduleInput(row.value);
                    }
                });
            }
        } catch (e) {
            console.error("Error fetching fees settings:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCustomItem = () => {
        const newItem: CustomFeeItem = {
            id: Date.now().toString(),
            name: "",
            amount: "P ",
            frequency: "Per Term"
        };
        setCustomItems([...customItems, newItem]);
    };

    const handleRemoveCustomItem = (id: string) => {
        setCustomItems(customItems.filter(item => item.id !== id));
    };

    const handleCustomItemChange = (id: string, field: keyof CustomFeeItem, value: string) => {
        setCustomItems(customItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setStatusMessage(null);
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        setStatusMessage(null);

        let finalScheduleUrl = customScheduleInput.trim() || scheduleUrl;

        try {
            if (selectedFile) {
                const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filePath = `documents/fees_${Date.now()}_${sanitizedName}`;

                const { error: uploadError } = await supabase.storage
                    .from('gallery_images')
                    .upload(filePath, selectedFile, {
                        contentType: selectedFile.type || 'application/pdf',
                        upsert: true
                    });

                if (uploadError) {
                    console.warn("Storage upload notice:", uploadError.message);
                    if (!finalScheduleUrl) {
                        finalScheduleUrl = `/docs/${sanitizedName}`;
                    }
                } else {
                    const { data: publicUrlData } = supabase.storage
                        .from('gallery_images')
                        .getPublicUrl(filePath);

                    if (publicUrlData && publicUrlData.publicUrl) {
                        finalScheduleUrl = publicUrlData.publicUrl;
                    }
                }
            }

            const feesPayload = JSON.stringify({
                registrationFee,
                standardPrimaryFee,
                preschoolFee,
                customItems,
                notes,
                updatedAt: new Date().toISOString()
            });

            const { error: saveError } = await supabase
                .from('site_settings')
                .upsert([
                    { key: 'school_fees_data', value: feesPayload, updated_at: new Date().toISOString() },
                    { key: 'fee_schedule_url', value: finalScheduleUrl, updated_at: new Date().toISOString() }
                ]);

            if (saveError) {
                setStatusMessage({ type: 'error', text: `Failed to save fees: ${saveError.message}` });
            } else {
                setScheduleUrl(finalScheduleUrl);
                setCustomScheduleInput(finalScheduleUrl);
                setSelectedFile(null);
                setStatusMessage({ type: 'success', text: 'School fees and fees schedule document updated successfully! Changes are live on the Admissions page.' });
            }
        } catch (err: any) {
            console.error("Save error:", err);
            setStatusMessage({ type: 'error', text: err?.message || 'An error occurred while saving.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <CreditCard className="text-primary w-8 h-8" /> Manage School Fees
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Edit published school fee amounts and upload the official fees schedule document.
                    </p>
                </div>
                <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm self-start sm:self-auto"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            <span>Save All Changes</span>
                        </>
                    )}
                </button>
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

            {/* School Fees Editor Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Core School Fee Structure (2026)</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        These amounts are displayed in the official School Fees card on the Admissions page.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Registration Fee (One-time)
                        </label>
                        <input
                            type="text"
                            value={registrationFee}
                            onChange={(e) => setRegistrationFee(e.target.value)}
                            placeholder="e.g. P 500.00"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold text-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Standard 1 – 7 (Per Term)
                        </label>
                        <input
                            type="text"
                            value={standardPrimaryFee}
                            onChange={(e) => setStandardPrimaryFee(e.target.value)}
                            placeholder="e.g. P 3,500.00"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold text-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Pre-School (Per Term)
                        </label>
                        <input
                            type="text"
                            value={preschoolFee}
                            onChange={(e) => setPreschoolFee(e.target.value)}
                            placeholder="e.g. P 2,800.00"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold text-primary"
                        />
                    </div>
                </div>

                {/* Custom Additional Fees */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Additional Fee Items (Optional)</h3>
                            <p className="text-xs text-slate-500">e.g. Feeding Scheme, Uniforms, Transport, Development Levy</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddCustomItem}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        >
                            <Plus size={14} /> Add Item
                        </button>
                    </div>

                    {customItems.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                            No additional fee items added yet. Click &quot;Add Item&quot; to specify optional levies or activities.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {customItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <input
                                        type="text"
                                        placeholder="Item description (e.g. Meals)"
                                        value={item.name}
                                        onChange={(e) => handleCustomItemChange(item.id, 'name', e.target.value)}
                                        className="flex-grow px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Amount (e.g. P 450.00)"
                                        value={item.amount}
                                        onChange={(e) => handleCustomItemChange(item.id, 'amount', e.target.value)}
                                        className="w-32 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Frequency (e.g. Per Month)"
                                        value={item.frequency}
                                        onChange={(e) => handleCustomItemChange(item.id, 'frequency', e.target.value)}
                                        className="w-32 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCustomItem(item.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Fee Notice / Bursar Terms
                    </label>
                    <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs text-slate-600"
                    />
                </div>
            </div>

            {/* School Fees Schedule Document Upload Section */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Upload className="text-primary w-5 h-5" /> School Fees Schedule Document (PDF)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Upload the detailed, signed official fee structure sheet that parents download from the Admissions section.
                    </p>
                </div>

                {/* Current Active File */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            PDF
                        </div>
                        <div className="truncate">
                            <p className="font-semibold text-sm text-slate-800 truncate max-w-md">
                                {scheduleUrl.split('/').pop() || 'st-marys-fees-schedule-2026.pdf'}
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-md">
                                {scheduleUrl}
                            </p>
                        </div>
                    </div>
                    <a
                        href={scheduleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs flex-shrink-0"
                    >
                        <FileDown size={14} />
                        Download &amp; Test Schedule
                    </a>
                </div>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary/60 transition-colors bg-slate-50/50">
                    <input
                        type="file"
                        id="fees-schedule-file"
                        accept=".pdf,.doc,.docx,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="fees-schedule-file"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-primary hover:underline">
                            Click to upload new fees schedule file
                        </span>
                        <p className="text-xs text-slate-500">PDF or Word documents (up to 20MB)</p>
                    </label>

                    {selectedFile && (
                        <div className="mt-4 p-2.5 bg-white rounded-lg border border-slate-200 inline-flex items-center gap-3 text-left">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">NEW</span>
                            <span className="text-xs font-semibold text-slate-800">{selectedFile.name}</span>
                        </div>
                    )}
                </div>

                {/* Direct URL input */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Or specify direct file URL / storage path:
                    </label>
                    <input
                        type="text"
                        value={customScheduleInput}
                        onChange={(e) => setCustomScheduleInput(e.target.value)}
                        placeholder="/docs/st-marys-fees-schedule-2026.pdf"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-primary text-xs font-mono"
                    />
                </div>
            </div>
        </div>
    );
}
