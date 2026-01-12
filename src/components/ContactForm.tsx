"use client";

import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type FormData = {
    name: string;
    email: string;
    phone: string;
    subject: "General Inquiry" | "Admissions" | "Fees" | "Other";
    message: string;
};

export default function ContactForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
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

            if (error) throw error;

            setSuccess(true);
            reset();
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error('Error submitting form:', err);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

            {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        {...register("phone")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="+267 7x xxx xxx"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                        {...register("subject")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Admissions">Admissions</option>
                        <option value="Fees">School Fees</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                    {...register("message", { required: "Message is required" })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="How can we help you?"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {isSubmitting ? "Sending..." : (
                    <>
                        Send Message <Send size={18} />
                    </>
                )}
            </button>
        </form>
    )
}
