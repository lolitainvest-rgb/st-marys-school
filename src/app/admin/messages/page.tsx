"use client";

import { Search, Trash2, Mail, Eye } from "lucide-react";

// Mock data for messages
const messages = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        subject: "Admissions Inquiry",
        date: "2026-01-12",
        status: "Unread",
        preview: "I would like to enquire about the admission requirements for Standard 1..."
    },
    {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@test.com",
        subject: "School Fees 2026",
        date: "2026-01-10",
        status: "Read",
        preview: "Could you please send me the updated fee structure for the upcoming year?"
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "m.brown@gmail.com",
        subject: "General Inquiry",
        date: "2026-01-08",
        status: "Read",
        preview: "Do you offer swimming as an extra-curricular activity?"
    }
];

export default function MessagesPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
                    <p className="text-gray-500 mt-1">Manage inquiries from the contact form</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-t-xl border border-gray-100 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Showing 3 of 3</span>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white border rounded-b-xl border-t-0 border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="p-4 w-10"><input type="checkbox" className="rounded" /></th>
                            <th className="p-4">Sender</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {messages.map((msg) => (
                            <tr key={msg.id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                                <td className="p-4"><input type="checkbox" className="rounded" /></td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{msg.name}</div>
                                    <div className="text-xs text-gray-500">{msg.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-gray-900 font-medium">{msg.subject}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{msg.preview}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-500">{msg.date}</td>
                                <td className="p-4 text-center">
                                    <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${msg.status === 'Unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {msg.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-full" title="View">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full" title="Delete">
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
