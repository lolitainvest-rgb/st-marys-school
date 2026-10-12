"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { 
    Plus, 
    Trash2, 
    Calendar as CalendarIcon, 
    X, 
    Pencil, 
    Upload, 
    FileDown, 
    Clock, 
    Save, 
    CheckCircle2, 
    AlertCircle, 
    Loader2 
} from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

interface KeyDateItem {
    id: string;
    title: string;
    date: string;
    term: "Term 1" | "Term 2" | "Term 3";
    status?: "active" | "completed" | "upcoming";
}

interface TermFiles {
    term1: string;
    term2: string;
    term3: string;
}

export default function AdminCalendarPage() {
    // Events
    const [events, setEvents] = useState<any[]>([]);
    const [selectedTermFilter, setSelectedTermFilter] = useState<string>("All");
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ 
        title: "", 
        date: "", 
        time: "", 
        description: "", 
        category: "Term 1" 
    });

    // Term Calendar Files
    const [termFiles, setTermFiles] = useState<TermFiles>({
        term1: "/docs/st-marys-term1-calendar-2026.pdf",
        term2: "",
        term3: ""
    });
    const [uploadingTerm, setUploadingTerm] = useState<string | null>(null);

    // Key Dates
    const [keyDates, setKeyDates] = useState<KeyDateItem[]>([
        { id: "1", title: "Office Re-opens", date: "January 5, 2026", term: "Term 1", status: "completed" },
        { id: "2", title: "Term 1 Begins", date: "January 13, 2026", term: "Term 1", status: "active" },
        { id: "3", title: "Mid-Term Break", date: "February 26 - March 2, 2026", term: "Term 1", status: "upcoming" },
        { id: "4", title: "Term 1 Ends", date: "April 10, 2026", term: "Term 1", status: "upcoming" },
        { id: "5", title: "Term 2 Begins", date: "May 12, 2026", term: "Term 2", status: "upcoming" },
        { id: "6", title: "Mid-Term Break", date: "June 25 - June 29, 2026", term: "Term 2", status: "upcoming" },
        { id: "7", title: "Term 2 Ends", date: "August 7, 2026", term: "Term 2", status: "upcoming" },
        { id: "8", title: "Term 3 Begins", date: "September 8, 2026", term: "Term 3", status: "upcoming" },
        { id: "9", title: "Term 3 Ends", date: "November 27, 2026", term: "Term 3", status: "upcoming" }
    ]);
    const [newKeyDate, setNewKeyDate] = useState({ title: "", date: "", term: "Term 1" as "Term 1" | "Term 2" | "Term 3" });
    const [isSavingKeyDates, setIsSavingKeyDates] = useState(false);

    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchEvents();
        fetchCalendarSettings();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (!error && data) {
            setEvents(data);
        }
        setLoading(false);
    };

    const fetchCalendarSettings = async () => {
        try {
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['calendar_term_files', 'calendar_key_dates']);

            if (data) {
                data.forEach((row: { key: string; value: string }) => {
                    if (row.key === 'calendar_term_files' && row.value) {
                        try {
                            const parsed = JSON.parse(row.value);
                            setTermFiles(prev => ({ ...prev, ...parsed }));
                        } catch {}
                    }
                    if (row.key === 'calendar_key_dates' && row.value) {
                        try {
                            const parsed = JSON.parse(row.value);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                setKeyDates(parsed);
                            }
                        } catch {}
                    }
                });
            }
        } catch (e) {
            console.error("Error fetching calendar settings", e);
        }
    };

    // Term Calendar File Upload
    const handleTermFileUpload = async (termKey: 'term1' | 'term2' | 'term3', file: File) => {
        setUploadingTerm(termKey);
        setStatusMessage(null);
        try {
            const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `documents/${termKey}_${Date.now()}_${sanitized}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery_images')
                .upload(filePath, file, {
                    contentType: file.type || 'application/pdf',
                    upsert: true
                });

            let fileUrl = `/docs/${sanitized}`;
            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                    .from('gallery_images')
                    .getPublicUrl(filePath);
                if (publicUrlData && publicUrlData.publicUrl) {
                    fileUrl = publicUrlData.publicUrl;
                }
            }

            const updatedTermFiles = {
                ...termFiles,
                [termKey]: fileUrl
            };

            await supabase
                .from('site_settings')
                .upsert({
                    key: 'calendar_term_files',
                    value: JSON.stringify(updatedTermFiles),
                    updated_at: new Date().toISOString()
                });

            setTermFiles(updatedTermFiles);
            setStatusMessage({ type: 'success', text: `${termKey.toUpperCase()} Calendar successfully uploaded and published!` });
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message || "Failed to upload term calendar." });
        } finally {
            setUploadingTerm(null);
        }
    };

    const handleClearTermFile = async (termKey: 'term1' | 'term2' | 'term3') => {
        const updated = { ...termFiles, [termKey]: "" };
        await supabase
            .from('site_settings')
            .upsert({
                key: 'calendar_term_files',
                value: JSON.stringify(updated),
                updated_at: new Date().toISOString()
            });
        setTermFiles(updated);
        setStatusMessage({ type: 'success', text: `${termKey.toUpperCase()} calendar removed. It will now display "Loading soon" on the website.` });
    };

    // Key Dates Management
    const handleAddKeyDate = () => {
        if (!newKeyDate.title || !newKeyDate.date) return;
        const item: KeyDateItem = {
            id: Date.now().toString(),
            title: newKeyDate.title,
            date: newKeyDate.date,
            term: newKeyDate.term,
            status: "upcoming"
        };
        setKeyDates([...keyDates, item]);
        setNewKeyDate({ title: "", date: "", term: newKeyDate.term });
    };

    const handleDeleteKeyDate = (id: string) => {
        setKeyDates(keyDates.filter(k => k.id !== id));
    };

    const handleSaveKeyDates = async () => {
        setIsSavingKeyDates(true);
        setStatusMessage(null);
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    key: 'calendar_key_dates',
                    value: JSON.stringify(keyDates),
                    updated_at: new Date().toISOString()
                });

            if (!error) {
                setStatusMessage({ type: 'success', text: 'Key Dates per term updated successfully across the website!' });
            } else {
                setStatusMessage({ type: 'error', text: `Failed to save Key Dates: ${error.message}` });
            }
        } catch (e: any) {
            setStatusMessage({ type: 'error', text: e.message || 'Error saving key dates.' });
        } finally {
            setIsSavingKeyDates(false);
        }
    };

    // Events CRUD
    const handleDeleteEvent = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (!error) {
            fetchEvents();
        } else {
            alert("Failed to delete event.");
        }
    };

    const handleEditEvent = (event: any) => {
        setFormData({ 
            title: event.title, 
            date: event.date, 
            time: event.time || "", 
            description: event.description || "",
            category: event.category || "Term 1"
        });
        setEditingId(event.id);
        setIsAdding(true);
    };

    const handleCancelEvent = () => {
        setFormData({ title: "", date: "", time: "", description: "", category: "Term 1" });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleSubmitEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        let error;
        if (editingId) {
            const { error: updateError } = await supabase
                .from('events')
                .update(formData)
                .eq('id', editingId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('events').insert([formData]);
            error = insertError;
        }

        if (!error) {
            handleCancelEvent();
            fetchEvents();
        } else {
            alert(editingId ? "Failed to update event." : "Failed to add event.");
        }
    };

    const filteredEvents = events.filter(e => {
        if (selectedTermFilter === "All") return true;
        return (e.category || "Term 1") === selectedTermFilter;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-16">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                    <CalendarIcon className="text-primary w-8 h-8" /> Manage School Calendar &amp; Dates
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Upload term-specific calendar schedules, configure key term dates, and manage school events.
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

            {/* SECTION 1: TERM CALENDAR SCHEDULE UPLOADS */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Upload className="text-primary w-5 h-5" /> Term Calendar Document Uploads
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Upload the official PDF schedule for each term. If a term has no upload yet, the public website displays <span className="font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">&ldquo;Loading soon&rdquo;</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Term 1 */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                Term 1
                            </span>
                            {termFiles.term1 ? (
                                <span className="text-[0.7rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Uploaded
                                </span>
                            ) : (
                                <span className="text-[0.7rem] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Loading soon
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Term 1 Calendar</h3>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                {termFiles.term1 ? termFiles.term1.split('/').pop() : 'No file uploaded'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {termFiles.term1 && (
                                <a
                                    href={termFiles.term1}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100"
                                >
                                    <FileDown size={14} /> Download &amp; View
                                </a>
                            )}
                            <label className="w-full cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs">
                                <Upload size={14} />
                                <span>{uploadingTerm === 'term1' ? 'Uploading...' : termFiles.term1 ? 'Replace File' : 'Upload File'}</span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    disabled={uploadingTerm === 'term1'}
                                    onChange={(e) => e.target.files?.[0] && handleTermFileUpload('term1', e.target.files[0])}
                                />
                            </label>
                            {termFiles.term1 && (
                                <button
                                    type="button"
                                    onClick={() => handleClearTermFile('term1')}
                                    className="w-full text-[0.7rem] text-slate-400 hover:text-red-600 transition-colors py-1"
                                >
                                    Remove (show &ldquo;Loading soon&rdquo;)
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Term 2 */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                Term 2
                            </span>
                            {termFiles.term2 ? (
                                <span className="text-[0.7rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Uploaded
                                </span>
                            ) : (
                                <span className="text-[0.7rem] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Loading soon
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Term 2 Calendar</h3>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                {termFiles.term2 ? termFiles.term2.split('/').pop() : 'Placeholder: Loading soon'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {termFiles.term2 && (
                                <a
                                    href={termFiles.term2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100"
                                >
                                    <FileDown size={14} /> Download &amp; View
                                </a>
                            )}
                            <label className="w-full cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs">
                                <Upload size={14} />
                                <span>{uploadingTerm === 'term2' ? 'Uploading...' : termFiles.term2 ? 'Replace File' : 'Upload File'}</span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    disabled={uploadingTerm === 'term2'}
                                    onChange={(e) => e.target.files?.[0] && handleTermFileUpload('term2', e.target.files[0])}
                                />
                            </label>
                            {termFiles.term2 && (
                                <button
                                    type="button"
                                    onClick={() => handleClearTermFile('term2')}
                                    className="w-full text-[0.7rem] text-slate-400 hover:text-red-600 transition-colors py-1"
                                >
                                    Remove (show &ldquo;Loading soon&rdquo;)
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Term 3 */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                Term 3
                            </span>
                            {termFiles.term3 ? (
                                <span className="text-[0.7rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Uploaded
                                </span>
                            ) : (
                                <span className="text-[0.7rem] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Loading soon
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Term 3 Calendar</h3>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                {termFiles.term3 ? termFiles.term3.split('/').pop() : 'Placeholder: Loading soon'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {termFiles.term3 && (
                                <a
                                    href={termFiles.term3}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100"
                                >
                                    <FileDown size={14} /> Download &amp; View
                                </a>
                            )}
                            <label className="w-full cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs">
                                <Upload size={14} />
                                <span>{uploadingTerm === 'term3' ? 'Uploading...' : termFiles.term3 ? 'Replace File' : 'Upload File'}</span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    disabled={uploadingTerm === 'term3'}
                                    onChange={(e) => e.target.files?.[0] && handleTermFileUpload('term3', e.target.files[0])}
                                />
                            </label>
                            {termFiles.term3 && (
                                <button
                                    type="button"
                                    onClick={() => handleClearTermFile('term3')}
                                    className="w-full text-[0.7rem] text-slate-400 hover:text-red-600 transition-colors py-1"
                                >
                                    Remove (show &ldquo;Loading soon&rdquo;)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: KEY DATES CATEGORIZED PER TERM */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="text-primary w-5 h-5" /> Key Term Dates (2026)
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Published in the admissions and calendar sections for term opening/closing and breaks.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveKeyDates}
                        disabled={isSavingKeyDates}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-xs self-start sm:self-auto"
                    >
                        <Save size={15} />
                        <span>{isSavingKeyDates ? "Saving Dates..." : "Save Key Dates"}</span>
                    </button>
                </div>

                {/* Add new key date row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                        <label className="block text-[0.7rem] font-bold text-slate-600 uppercase mb-1">Term</label>
                        <select
                            value={newKeyDate.term}
                            onChange={(e) => setNewKeyDate({ ...newKeyDate, term: e.target.value as any })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-primary font-medium"
                        >
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div className="sm:col-span-1">
                        <label className="block text-[0.7rem] font-bold text-slate-600 uppercase mb-1">Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Mid-Term Break"
                            value={newKeyDate.title}
                            onChange={(e) => setNewKeyDate({ ...newKeyDate, title: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="sm:col-span-1">
                        <label className="block text-[0.7rem] font-bold text-slate-600 uppercase mb-1">Date String</label>
                        <input
                            type="text"
                            placeholder="e.g. May 12, 2026"
                            value={newKeyDate.date}
                            onChange={(e) => setNewKeyDate({ ...newKeyDate, date: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={handleAddKeyDate}
                            className="w-full px-4 py-2 bg-secondary text-slate-900 font-bold text-xs rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            + Add Key Date
                        </button>
                    </div>
                </div>

                {/* Key dates grouped by term */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {(["Term 1", "Term 2", "Term 3"] as const).map(term => {
                        const termDates = keyDates.filter(k => k.term === term);
                        return (
                            <div key={term} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                                <div className="border-b border-slate-100 pb-2">
                                    <h4 className="font-bold text-slate-900 text-sm text-primary">{term}</h4>
                                    <span className="text-[0.7rem] text-slate-400">{termDates.length} milestone dates</span>
                                </div>
                                <div className="space-y-2">
                                    {termDates.map(item => (
                                        <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-slate-800">{item.title}</p>
                                                <p className="text-[0.7rem] text-slate-500">{item.date}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteKeyDate(item.id)}
                                                className="text-slate-400 hover:text-red-500 p-1"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {termDates.length === 0 && (
                                        <p className="text-xs text-slate-400 italic">No key dates added for {term}.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 3: CALENDAR EVENTS CATEGORIZED PER TERM */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <CalendarIcon className="text-primary w-5 h-5" /> School Events (Categorized per Term)
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Activities, assemblies, exams, sports, and cultural dates.
                        </p>
                    </div>
                    <button
                        onClick={() => { handleCancelEvent(); setIsAdding(true); }}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-xs font-bold self-start sm:self-auto shadow-xs"
                    >
                        <Plus size={16} /> Add School Event
                    </button>
                </div>

                {/* Term Category Filters */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                    {["All", "Term 1", "Term 2", "Term 3"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTermFilter(tab)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                selectedTermFilter === tab
                                    ? "bg-primary text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {isAdding && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-slate-900">
                                {editingId ? "Edit Event" : "Add New Event"}
                            </h3>
                            <button onClick={handleCancelEvent} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitEvent} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-3 py-2 text-xs bg-white"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Term Category</label>
                                    <select
                                        className="w-full border rounded-lg px-3 py-2 text-xs bg-white"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Term 1">Term 1</option>
                                        <option value="Term 2">Term 2</option>
                                        <option value="Term 3">Term 3</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg px-3 py-2 text-xs bg-white"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Time (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-3 py-2 text-xs bg-white"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        placeholder="e.g. 08:00 AM"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 text-xs bg-white h-20"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={handleCancelEvent} className="px-4 py-2 text-xs text-slate-600">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700">
                                    {editingId ? "Update Event" : "Save Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <p className="text-xs text-slate-500 py-4">Loading calendar events...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-xs">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-bold text-slate-600 uppercase">Term</th>
                                    <th className="px-4 py-3 text-left font-bold text-slate-600 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left font-bold text-slate-600 uppercase">Title</th>
                                    <th className="px-4 py-3 text-left font-bold text-slate-600 uppercase">Time</th>
                                    <th className="px-4 py-3 text-right font-bold text-slate-600 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="font-bold text-[0.7rem] bg-blue-50 text-primary px-2 py-0.5 rounded border border-blue-100">
                                                {event.category || "Term 1"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                                            {new Date(event.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">
                                            {event.title}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                                            {event.time || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditEvent(event)}
                                                    className="text-primary hover:text-blue-800 p-1"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="text-rose-500 hover:text-rose-700 p-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic">
                                            No events found for {selectedTermFilter}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
