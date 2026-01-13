"use client";

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname();

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
    ]

    return (
        <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <a href="/" className="flex items-center gap-3">
                            <div className="relative w-12 h-14 md:w-14 md:h-16">
                                <Image
                                    src="/logo.png"
                                    alt="St Mary's Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl md:text-2xl tracking-tight text-secondary leading-none">ST MARY'S</span>
                                <span className="text-[0.6rem] md:text-xs text-white font-medium tracking-wider">PRIMARY SCHOOL</span>
                            </div>
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        {links.map((link) => (
                            link.href === "/" ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="hover:text-secondary transition-colors font-medium text-sm lg:text-base"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="hover:text-secondary transition-colors font-medium text-sm lg:text-base"
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                        <Link
                            href="/login"
                            className="bg-secondary text-primary px-4 py-2 rounded-md font-bold hover:bg-white transition-colors text-sm"
                        >
                            Staff Portal
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-secondary focus:outline-none"
                        >
                            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </button>
                    </div>
                </div >
            </div >

            {/* Mobile Menu */}
            {
                isOpen && (
                    <div className="md:hidden bg-primary pb-4">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {links.map((link) => (
                                link.href === "/" ? (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 hover:text-secondary"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 hover:text-secondary"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 mt-4 rounded-md text-base font-bold bg-secondary text-primary text-center"
                            >
                                Staff Portal
                            </Link>
                        </div>
                    </div>
                )
            }
        </nav >
    )
}
