"use client";

export const runtime = 'edge';

import { FileText } from "lucide-react";

export default function NewsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage News</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-4">
                    <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">News Management Module</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    This feature is currently under development. Soon you will be able to post school news, announcements, and newsletters directly from here.
                </p>
            </div>
        </div>
    );
}
