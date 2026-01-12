export const runtime = 'edge';

"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function PrincipalSettingsPage() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'principal_welcome')
                .single();

            if (data) {
                setMessage(data.value);
            } else if (error) {
                console.error("Error fetching principal message:", error);
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const supabase = createClient();
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'principal_welcome', value: message, updated_at: new Date().toISOString() });

        if (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save changes.");
        } else {
            alert("Message updated successfully!");
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Principal's Welcome</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Welcome Message Content
                    </label>
                    <div className="text-xs text-gray-500 mb-2">
                        This text appears on the Home Page under "Principal's Welcome".
                    </div>
                    <textarea
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary font-mono text-sm"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-bold"
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
