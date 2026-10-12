"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Save, Link as LinkIcon, FileDown, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function SystemSettingsPage() {
    const [portalLink, setPortalLink] = useState("");
    const [prospectusLink, setProspectusLink] = useState("/docs/st-marys-prospectus-2026.pdf");
    const [contactWhatsapp, setContactWhatsapp] = useState("+26774105044");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const supabase = createClient();
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['portal_url', 'prospectus_url', 'contact_whatsapp']);

            if (data) {
                data.forEach((row: { key: string; value: string }) => {
                    if (row.key === 'portal_url') setPortalLink(row.value);
                    if (row.key === 'prospectus_url') setProspectusLink(row.value);
                    if (row.key === 'contact_whatsapp') setContactWhatsapp(row.value);
                });
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
            .upsert([
                { key: 'portal_url', value: portalLink, updated_at: new Date().toISOString() },
                { key: 'prospectus_url', value: prospectusLink, updated_at: new Date().toISOString() },
                { key: 'contact_whatsapp', value: contactWhatsapp, updated_at: new Date().toISOString() }
            ]);

        if (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings: " + error.message);
        } else {
            alert("Settings updated successfully!");
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-sm text-slate-600 mt-1">Manage global system URLs, WhatsApp inquiries, and document links.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-8 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <LinkIcon className="text-primary w-5 h-5" /> External &amp; Document Links
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                School Management System URL
                            </label>
                            <p className="text-xs text-slate-500 mb-2">
                                Updates the &quot;School Management System&quot; link in the Footer and Navbar.
                            </p>
                            <input
                                type="url"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                                value={portalLink}
                                onChange={(e) => setPortalLink(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                Contact Form WhatsApp Destination Number
                            </label>
                            <p className="text-xs text-slate-500 mb-2">
                                Website inquiries from the contact form are dispatched to this WhatsApp line.
                            </p>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                                value={contactWhatsapp}
                                onChange={(e) => setContactWhatsapp(e.target.value)}
                                placeholder="+26774105044"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-slate-800">
                                    Official School Prospectus URL / Path
                                </label>
                                <Link
                                    href="/admin/prospectus"
                                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                                >
                                    Go to Document Uploader <ExternalLink size={12} />
                                </Link>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">
                                The file or link downloaded when visitors click &quot;Prospectus&quot; on the website.
                            </p>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                                value={prospectusLink}
                                onChange={(e) => setProspectusLink(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-bold shadow-xs"
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
