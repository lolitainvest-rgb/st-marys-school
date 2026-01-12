"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

type Event = {
    id: string;
    title: string;
    date: string; // ISO date string
    description?: string;
    location?: string;
    type: "academic" | "sport" | "cultural" | "holiday";
};

// Mock Data
const SAMPLE_EVENTS: Event[] = [
    {
        id: "1",
        title: "Term 1 Begins",
        date: "2026-01-13T07:30:00",
        description: "School re-opens for all students.",
        type: "academic",
    },
    {
        id: "2",
        title: "Meet and Greet (Parents)",
        date: "2026-01-24T14:00:00",
        location: "School Hall",
        description: "An opportunity for parents to meet the new class teachers.",
        type: "cultural",
    },
    {
        id: "3",
        title: "Inter-House Athletics",
        date: "2026-02-12T08:00:00",
        location: "School Grounds",
        type: "sport",
    },
    {
        id: "4",
        title: "Mid-Term Break",
        date: "2026-02-26T00:00:00",
        type: "holiday",
    },
    {
        id: "5",
        title: "Good Friday (Public Holiday)",
        date: "2026-04-03T00:00:00",
        type: "holiday",
    },
];

export default function EventCalendar() {
    const [filter, setFilter] = useState<"all" | "academic" | "sport" | "cultural">("all");

    const filteredEvents = SAMPLE_EVENTS.filter((e) => {
        if (filter === "all") return true;
        return e.type === filter;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {["all", "academic", "sport", "cultural"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${filter === f
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Events List */}
            <div className="grid gap-6">
                {filteredEvents.map((event) => {
                    const dateObj = new Date(event.date);
                    const day = format(dateObj, "dd");
                    const month = format(dateObj, "MMM");
                    const time = format(dateObj, "h:mm a");

                    return (
                        <div
                            key={event.id}
                            className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
                        >
                            {/* Date Badge */}
                            <div className="flex-shrink-0 w-20 h-20 bg-blue-50 text-primary rounded-xl flex flex-col items-center justify-center border border-blue-100">
                                <span className="text-sm font-bold uppercase tracking-wider">{month}</span>
                                <span className="text-3xl font-extrabold">{day}</span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${event.type === 'academic' ? 'bg-blue-500' :
                                            event.type === 'sport' ? 'bg-green-500' :
                                                event.type === 'holiday' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}></span>
                                    <span className="text-xs font-semibold uppercase text-gray-400 tracking-wide">{event.type}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                <p className="text-gray-600 mb-3">{event.description || "No specific details provided."}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{time === "12:00 AM" ? "All Day" : time}</span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No events found for this category.
                    </div>
                )}
            </div>
        </div>
    );
}
