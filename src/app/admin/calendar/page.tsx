"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar as CalendarIcon, X, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function CalendarPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ title: "", date: "", time: "", description: "" });
    const supabase = createClient();

    useEffect(() => {
        fetchEvents();
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

    const [editingId, setEditingId] = useState<number | null>(null);

    // ... (keep fetchEvents)

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        const { error } = await supabase.from('events').delete().eq('id', id);
        if (!error) {
            fetchEvents();
        } else {
            alert("Failed to delete event.");
        }
    };

    const handleEdit = (event: any) => {
        setFormData({ title: event.title, date: event.date, time: event.time || "", description: event.description || "" });
        setEditingId(event.id);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setFormData({ title: "", date: "", time: "", description: "" });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            handleCancel();
            fetchEvents();
        } else {
            alert(editingId ? "Failed to update event." : "Failed to add event.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage Calendar</h1>
                <button
                    onClick={() => { handleCancel(); setIsAdding(true); }}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Add Event
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{editingId ? "Edit Event" : "New Event"}</h3>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Event Title</label>
                            <input
                                type="text"
                                className="w-full border rounded-md px-3 py-2"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md px-3 py-2"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Time (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md px-3 py-2"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    placeholder="e.g. 14:00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full border rounded-md px-3 py-2 h-20"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={handleCancel} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                {editingId ? "Update Event" : "Save Event"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading events...</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(event.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {event.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {event.time || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No upcoming events.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
