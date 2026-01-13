"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Calendar, Image, LogOut, Mail } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inbox", href: "/admin/messages", icon: Mail },
    { name: "Manage News", href: "/admin/news", icon: FileText },
    { name: "Manage Calendar", href: "/admin/calendar", icon: Calendar },
    { name: "Manage Gallery", href: "/admin/gallery", icon: Image },
    { name: "Principal's Welcome", href: "/admin/principal", icon: FileText },
    { name: "System Settings", href: "/admin/settings", icon: LayoutDashboard },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = () => {
        // Force hard refresh to clear all state and prevent "freezing"
        window.location.href = "/";
    };

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-secondary">Admin Portal</h2>
                <p className="text-xs text-slate-400">St Mary's Website CMS</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-primary text-white"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    )
}
