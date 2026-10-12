"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, FileDown, Lock } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [prospectusUrl, setProspectusUrl] = useState("/docs/st-marys-prospectus-2026.pdf");
    const pathname = usePathname();

    useEffect(() => {
        // Fetch latest prospectus URL from Supabase site_settings if available
        const fetchProspectus = async () => {
            try {
                const supabase = createClient();
                const { data } = await supabase
                    .from("site_settings")
                    .select("value")
                    .eq("key", "prospectus_url")
                    .single();

                if (data && data.value) {
                    setProspectusUrl(data.value);
                }
            } catch {
                // Keep default fallback
            }
        };
        fetchProspectus();
    }, []);

    if (pathname && pathname.startsWith("/admin")) {
        return null;
    }

    const links = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Admissions", href: "/admissions" },
        { name: "Calendar", href: "/calendar" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
    ];

    const isLinkActive = (href: string) => {
        if (!pathname) return false;
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-14 md:w-14 md:h-16 transition-transform group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="St Mary's Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl md:text-2xl tracking-tight text-primary leading-none group-hover:text-blue-700 transition-colors">
                                    ST MARY&apos;S
                                </span>
                                <span className="text-[0.62rem] md:text-xs text-slate-600 font-bold tracking-wider mt-1">
                                    CATHOLIC PRIMARY SCHOOL
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {links.map((link) => {
                            const active = isLinkActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm lg:text-[0.925rem] px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                                        active
                                            ? "text-primary font-bold bg-blue-50/90 shadow-xs border border-blue-200/80"
                                            : "text-slate-700 hover:text-primary hover:bg-slate-100/70 font-medium"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* Prospectus Download Button */}
                        <a
                            href={prospectusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 ml-2 px-3.5 py-1.5 text-xs lg:text-sm font-semibold rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
                            title="Download School Prospectus"
                        >
                            <FileDown size={15} />
                            <span>Prospectus</span>
                        </a>

                        {/* Staff Portal Link */}
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 ml-1 bg-secondary text-slate-900 px-3.5 py-1.5 rounded-full font-bold hover:bg-amber-400 transition-all text-xs lg:text-sm shadow-xs"
                        >
                            <Lock size={13} />
                            <span>Staff Portal</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <a
                            href={prospectusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border border-primary text-primary"
                            title="Download Prospectus"
                        >
                            <FileDown size={14} />
                            <span>Prospectus</span>
                        </a>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-700 hover:text-primary p-2 focus:outline-none rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="Toggle navigation menu"
                        >
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 pt-3 pb-6 space-y-1.5">
                        {links.map((link) => {
                            const active = isLinkActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-2.5 rounded-lg text-base transition-colors ${
                                        active
                                            ? "bg-blue-50 text-primary font-bold border-l-4 border-primary"
                                            : "text-slate-700 hover:bg-slate-50 font-medium"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                            <a
                                href={prospectusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-primary text-primary hover:bg-blue-50 transition-colors"
                            >
                                <FileDown size={18} />
                                <span>Download School Prospectus (PDF)</span>
                            </a>

                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-secondary text-slate-900 text-center hover:bg-amber-400 transition-colors shadow-xs"
                            >
                                <Lock size={16} />
                                <span>Staff Portal</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
