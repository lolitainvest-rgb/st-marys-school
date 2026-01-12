export const runtime = 'edge';

"use client";

import { useState, useEffect } from "react";
import { Save, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function SystemSettingsPage() {
    const [portalLink, setPortalLink] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'portal_url')
                .single();

            if (data) {
                setPortalLink(data.value);
            } else if (error) {
                console.error("Error fetching portal link:", error);
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
            .upsert({ key: 'portal_url', value: portalLink, updated_at: new Date().toISOString() });

        if (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } else {
            alert("Settings updated successfully!");
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <LinkIcon className="text-secondary" /> External Links
                </h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Management System URL
                    </label>
                    <div className="text-xs text-gray-500 mb-2">
                        Updates the "School Management System" link in the Footer and Navbar.
                    </div>
                    <input
                        type="url"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={portalLink}
                        onChange={(e) => setPortalLink(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-bold"
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
