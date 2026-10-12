"use client";

import { useForm } from "react-hook-form";
import { Send, MessageCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

type FormData = {
    name: string;
    email: string;
    phone: string;
    subject: "General Inquiry" | "Admissions" | "Fees" | "Other";
    message: string;
};

const DEFAULT_WHATSAPP = "+26774105044";

export default function ContactForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successUrl, setSuccessUrl] = useState<string | null>(null);
    const [targetWhatsapp, setTargetWhatsapp] = useState(DEFAULT_WHATSAPP);

    useEffect(() => {
        // Fetch custom WhatsApp number if configured in site_settings
        const fetchWhatsapp = async () => {
            try {
                const supabase = createClient();
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'contact_whatsapp')
                    .single();

                if (data && data.value) {
                    setTargetWhatsapp(data.value);
                }
            } catch {
                // Keep default
            }
        };
        fetchWhatsapp();
    }, []);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            // Save to messages table for admin record
            const supabase = createClient();
            await supabase
                .from('messages')
                .insert([
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        subject: data.subject,
                        message: data.message,
                        status: 'Unread'
                    }
                ]);
        } catch (err) {
            console.warn('Note: Could not archive message to database, continuing to WhatsApp:', err);
        }

        // Format message for WhatsApp
        const formattedMessage = 
`*St Mary's Catholic Primary School - Website Inquiry*

*Name:* ${data.name}
*Email:* ${data.email}
*Phone:* ${data.phone || 'Not provided'}
*Subject:* ${data.subject}

*Message:*
${data.message}`;

        const cleanPhone = targetWhatsapp.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedMessage)}`;

        setSuccessUrl(whatsappUrl);
        reset();

        // Automatically open WhatsApp in new tab/window
        if (typeof window !== 'undefined') {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-amber-50/35 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-amber-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Send us a Message</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Inquiries are sent directly to our school WhatsApp desk at <span className="font-semibold text-emerald-700">{targetWhatsapp}</span>.
                    </p>
                </div>
                <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <MessageCircle size={14} className="text-emerald-600" />
                    <span>Instant WhatsApp Delivery</span>
                </div>
            </div>

            {successUrl && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Message prepared successfully!</span>
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                        We have opened WhatsApp on <strong>{targetWhatsapp}</strong> with your inquiry details. If your browser blocked the popup, please click the button below to continue:
                    </p>
                    <a
                        href={successUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                        <MessageCircle size={16} />
                        <span>Open WhatsApp Chat ({targetWhatsapp})</span>
                        <ExternalLink size={13} />
                    </a>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Full Name *
                    </label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        placeholder="e.g. John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address *
                    </label>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        placeholder="e.g. parent@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number
                    </label>
                    <input
                        {...register("phone")}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        placeholder="e.g. +267 7x xxx xxx"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Inquiry Topic
                    </label>
                    <select
                        {...register("subject")}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                    >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Admissions">Admissions &amp; Enrollment</option>
                        <option value="Fees">School Fees Structure</option>
                        <option value="Other">Other Question</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Message *
                </label>
                <textarea
                    {...register("message", { required: "Message is required" })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    placeholder="Please type your message or question here..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
            >
                {isSubmitting ? (
                    <span>Preparing WhatsApp...</span>
                ) : (
                    <>
                        <MessageCircle size={18} />
                        <span>Send via WhatsApp (+267 74 105 044)</span>
                        <Send size={16} className="ml-1" />
                    </>
                )}
            </button>
        </form>
    );
}
