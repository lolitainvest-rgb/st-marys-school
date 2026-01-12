export const runtime = 'edge';

import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-primary sm:text-5xl mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-600">
                        We are here to help. Get in touch with our administration office.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">School Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Physical Address</h3>
                                        <p className="text-gray-600">Plot 1040 Lenganeng<br />Tlokweng, Gaborone<br />Botswana</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Phone Numbers</h3>
                                        <p className="text-gray-600">
                                            Landline: +267 392 8788<br />
                                            Mobile: +267 75 979 591
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Email Address</h3>
                                        <p className="text-gray-600">admin@stmarysschool.co.bw</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Office Hours</h3>
                                        <p className="text-gray-600">Monday - Friday: 7:30 AM - 4:30 PM</p>
                                        <p className="text-gray-600">Weekends: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Map Embed Placeholder */}
                        <div className="bg-gray-200 h-64 rounded-xl overflow-hidden relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114567.87788474241!2d25.9225!3d-24.6583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1eb5ce2593d6d5d1%3A0x0!2zOMKwMTQnMTIuMCJTIDI1wrA1NScxMi4wIkU!5e0!3m2!1sen!2sbw!4v1620000000000!5m2!1sen!2sbw&q=8XJH%2B3W%2C+Gaborone"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                title="School Location"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <ContactForm />

                </div>
            </div>
        </div>
    )
}
