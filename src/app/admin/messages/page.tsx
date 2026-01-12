"use client";

export const runtime = 'edge';

import { Search, Trash2, Mail, Eye, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
                    <p className="text-gray-500 mt-1">Manage inquiries from the contact form</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-t-xl border border-gray-100 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        {loading ? "Loading..." : `Showing ${filteredMessages.length} of ${messages.length}`}
                    </span>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white border rounded-b-xl border-t-0 border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                            <th className="p-4">Sender</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                                    Fetching messages...
                                </td>
                            </tr>
                        ) : filteredMessages.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    No messages found.
                                </td>
                            </tr>
                        ) : filteredMessages.map((msg) => (
                            <tr key={msg.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{msg.name}</div>
                                    <div className="text-xs text-gray-500">{msg.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-gray-900 font-medium">{msg.subject}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{msg.message}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => alert(`Message from ${msg.name}:\n\n${msg.message}`)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-full"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
