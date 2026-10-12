"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, FileDown, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
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

const DEFAULT_KEY_DATES: KeyDateItem[] = [
    { id: "1", title: "Office Re-opens", date: "January 5, 2026", term: "Term 1", status: "completed" },
    { id: "2", title: "Term 1 Begins", date: "January 13, 2026", term: "Term 1", status: "active" },
    { id: "3", title: "Mid-Term Break", date: "February 26 - March 2, 2026", term: "Term 1", status: "upcoming" },
    { id: "4", title: "Term 1 Ends", date: "April 10, 2026", term: "Term 1", status: "upcoming" },
    { id: "5", title: "Term 2 Begins", date: "May 12, 2026", term: "Term 2", status: "upcoming" },
    { id: "6", title: "Mid-Term Break", date: "June 25 - June 29, 2026", term: "Term 2", status: "upcoming" },
    { id: "7", title: "Term 2 Ends", date: "August 7, 2026", term: "Term 2", status: "upcoming" },
    { id: "8", title: "Term 3 Begins", date: "September 8, 2026", term: "Term 3", status: "upcoming" },
    { id: "9", title: "Term 3 Ends", date: "November 27, 2026", term: "Term 3", status: "upcoming" },
];

const SAMPLE_EVENTS = [
    {
        id: "1",
        title: "Term 1 Begins",
        date: "2026-01-13T07:30:00",
        description: "School re-opens for all students.",
        category: "Term 1",
    },
    {
        id: "2",
        title: "Meet and Greet (Parents & Teachers)",
        date: "2026-01-24T14:00:00",
        description: "An opportunity for parents to meet class teachers.",
        category: "Term 1",
    },
    {
        id: "3",
        title: "Inter-House Athletics",
        date: "2026-02-12T08:00:00",
        description: "School grounds athletics competition.",
        category: "Term 1",
    },
    {
        id: "4",
        title: "Mid-Term Break",
        date: "2026-02-26T00:00:00",
        description: "Mid-term holiday break for all learners.",
        category: "Term 1",
    },
    {
        id: "5",
        title: "Term 2 Begins",
        date: "2026-05-12T07:30:00",
        description: "Term 2 commencement for winter academic term.",
        category: "Term 2",
    },
    {
        id: "6",
        title: "Term 3 Begins",
        date: "2026-09-08T07:30:00",
        description: "Final term opening including national PSLE preparations.",
        category: "Term 3",
    }
];

export default function EventCalendar() {
    const [selectedTerm, setSelectedTerm] = useState<"All" | "Term 1" | "Term 2" | "Term 3">("Term 1");
    const [termFiles, setTermFiles] = useState<TermFiles>({
        term1: "/docs/st-marys-term1-calendar-2026.pdf",
        term2: "",
        term3: ""
    });
    const [keyDates, setKeyDates] = useState<KeyDateItem[]>(DEFAULT_KEY_DATES);
    const [events, setEvents] = useState<any[]>(SAMPLE_EVENTS);

    const supabase = createClient();

    useEffect(() => {
        const fetchSettingsAndEvents = async () => {
            try {
                // Fetch term files and key dates
                const { data: settingsData } = await supabase
                    .from('site_settings')
                    .select('key, value')
                    .in('key', ['calendar_term_files', 'calendar_key_dates']);

                if (settingsData) {
                    settingsData.forEach((row: { key: string; value: string }) => {
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

                // Fetch database events
                const { data: dbEvents } = await supabase
                    .from('events')
                    .select('*')
                    .order('date', { ascending: true });

                if (dbEvents && dbEvents.length > 0) {
                    setEvents(dbEvents);
                }
            } catch (err) {
                console.error("Calendar fetch error:", err);
            }
        };

        fetchSettingsAndEvents();
    }, []);

    // Filter events by selected term
    const filteredEvents = events.filter(e => {
        if (selectedTerm === "All") return true;
        const cat = e.category || "Term 1";
        return cat.toLowerCase() === selectedTerm.toLowerCase();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter key dates by selected term
    const filteredKeyDates = keyDates.filter(k => {
        if (selectedTerm === "All") return true;
        return k.term === selectedTerm;
    });

    const termsInfo = [
        { id: "term1", name: "Term 1", fileUrl: termFiles.term1, datesRange: "Jan 13 – Apr 10, 2026" },
        { id: "term2", name: "Term 2", fileUrl: termFiles.term2, datesRange: "May 12 – Aug 7, 2026" },
        { id: "term3", name: "Term 3", fileUrl: termFiles.term3, datesRange: "Sep 8 – Nov 27, 2026" },
    ];

    return (
        <div className="space-y-12">
            {/* Term Calendars Download Section */}
            <div>
                <div className="text-center md:text-left mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        Official Downloads
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                        Term Calendar Schedules (2026)
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Download the comprehensive day-by-day term planner or check back when published.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {termsInfo.map((term, idx) => {
                        const hasUpload = Boolean(term.fileUrl && term.fileUrl.trim().length > 0);
                        const isAmber = idx === 1;

                        return (
                            <div 
                                key={term.id} 
                                className={`${isAmber ? 'bg-amber-50/40 border-amber-200/80' : 'bg-blue-50/40 border-blue-200/80'} backdrop-blur-md rounded-2xl border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold tracking-wider uppercase text-primary bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                            {term.name}
                                        </span>
                                        {hasUpload ? (
                                            <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                <CheckCircle2 size={11} /> Ready
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 animate-pulse">
                                                <Clock size={11} /> Loading soon
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                                        {term.name} School Calendar
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-4">
                                        Academic Period: {term.datesRange}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    {hasUpload ? (
                                        <a
                                            href={term.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-xs hover:shadow-sm"
                                        >
                                            <FileDown size={15} />
                                            <span>Download {term.name} Calendar (PDF)</span>
                                        </a>
                                    ) : (
                                        <div className="w-full py-2.5 px-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                                            <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
                                                <Clock size={14} className="text-amber-500" />
                                                <span>Loading soon</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Term Navigation & Key Dates */}
            <div className="bg-amber-50/30 backdrop-blur-md rounded-2xl border border-amber-200/60 p-6 md:p-8 shadow-xs space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Key Term Dates &amp; Events
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                            Select a term to view opening dates, breaks, holidays, and student activities.
                        </p>
                    </div>

                    {/* Term Selector Pills */}
                    <div className="flex flex-wrap gap-2">
                        {(["All", "Term 1", "Term 2", "Term 3"] as const).map((term) => (
                            <button
                                key={term}
                                onClick={() => setSelectedTerm(term)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    selectedTerm === term
                                        ? "bg-primary text-white shadow-xs"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Dates Highlights */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <Clock size={14} className="text-primary" /> Key Term Milestones ({selectedTerm})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredKeyDates.map((item, idx) => (
                            <div key={item.id} className={`p-4 rounded-xl ${idx % 2 === 0 ? 'bg-blue-50/50 border-blue-200/70' : 'bg-amber-50/50 border-amber-200/70'} backdrop-blur-md border space-y-1 shadow-xs`}>
                                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                                    {item.term}
                                </span>
                                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-600 font-medium">{item.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheduled Events List */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <CalendarIcon size={14} className="text-primary" /> Detailed Calendar Activities ({selectedTerm})
                    </h3>

                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Clock size={24} className="mx-auto text-amber-500 mb-1" />
                            <p className="text-xs font-bold text-slate-600">Loading soon</p>
                            <p className="text-xs text-slate-400 mt-0.5">Additional activities for this term will be published shortly.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {filteredEvents.map((event) => {
                                const dateObj = new Date(event.date);
                                const day = isNaN(dateObj.getTime()) ? "01" : format(dateObj, "dd");
                                const month = isNaN(dateObj.getTime()) ? "JAN" : format(dateObj, "MMM");
                                const timeStr = event.time || (isNaN(dateObj.getTime()) ? "" : format(dateObj, "h:mm a"));

                                return (
                                    <div
                                        key={event.id}
                                        className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/40 transition-colors shadow-xs"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-primary rounded-xl flex flex-col items-center justify-center border border-blue-100">
                                            <span className="text-[0.7rem] font-bold uppercase tracking-wider">{month}</span>
                                            <span className="text-2xl font-black">{day}</span>
                                        </div>

                                        <div className="flex-grow space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[0.65rem] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                                    {event.category || "Term 1"}
                                                </span>
                                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{event.title}</h4>
                                            </div>
                                            {event.description && (
                                                <p className="text-xs text-slate-500 leading-relaxed">{event.description}</p>
                                            )}
                                        </div>

                                        {timeStr && (
                                            <div className="flex-shrink-0 text-xs font-medium text-slate-500 flex items-center gap-1 sm:self-center">
                                                <Clock size={13} className="text-slate-400" />
                                                <span>{timeStr}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
