import Image from "next/image";
import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { getSiteSetting } from "@/utils/getSiteSetting";

export default async function Footer() {
    const portalUrl = await getSiteSetting('portal_url', 'https://signalhands.co.bw/myschoolst/site/login');

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-10 h-12">
                                <Image
                                    src="/logo.png"
                                    alt="St Mary's Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="text-2xl font-bold font-serif text-secondary">St Mary's</h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Empowering future leaders through faith, discipline, and academic excellence since establishment.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/StMarysEnglishMediumPrimarySchool" target="_blank" rel="noopener noreferrer" className="bg-blue-800 p-2 rounded-full hover:bg-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
                            <li><Link href="/admissions" className="hover:text-secondary transition-colors">Admissions</Link></li>
                            <li><Link href="/calendar" className="hover:text-secondary transition-colors">Calendar</Link></li>
                            <li><Link href="/gallery" className="hover:text-secondary transition-colors">Photo Gallery</Link></li>
                            {/* Dynamic CMS Link */}
                            <li>
                                <a
                                    href={portalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-secondary transition-colors flex items-center gap-1"
                                >
                                    School Management System
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Contact Us</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
                            <div className="flex items-start gap-3">
                                <MapPin className="flex-shrink-0 text-secondary" size={20} />
                                <span>Plot 1040 Lenganeng<br />Tlokweng, Botswana</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="flex-shrink-0 text-secondary" size={20} />
                                <span>+267 392 8788<br />+267 75 979 591</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="flex-shrink-0 text-secondary" size={20} />
                                <span>admin@stmarysschool.co.bw</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2026 St Mary's School. All rights reserved.</p>
                    <div className="flex items-center gap-1 mt-2 md:mt-0">
                        <span>Designed by</span>
                        <a href="https://lolitainvestment.com/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                            Lolita Investment PTY LTD
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
