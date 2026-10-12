import Link from "next/link";
import { FileDown, ArrowRight, ShieldCheck } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative bg-gradient-to-br from-blue-900 via-primary to-blue-950 text-white overflow-hidden">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80')" }}
            />
            {/* Subtle glow circles */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white/10 backdrop-blur-md text-secondary border border-white/20 mb-6 shadow-sm">
                    <ShieldCheck size={16} />
                    <span>Catholic English Medium Primary School • Est. 1996</span>
                </div>

                <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl mb-4 max-w-4xl">
                    <span className="block text-white">Welcome to</span>
                    <span className="block text-secondary drop-shadow-sm mt-1">St Mary&apos;s Catholic Primary School</span>
                </h1>

                {/* Motto */}
                <div className="my-3 inline-block">
                    <p className="text-xl sm:text-2xl font-black tracking-wide text-yellow-300 font-serif italic">
                        &ldquo;Forever Onward&rdquo;
                    </p>
                </div>

                <p className="mt-3 text-base sm:text-lg max-w-2xl mx-auto text-blue-100 font-medium leading-relaxed">
                    Delivering quality, affordable, and nurturing primary education centred on Christ&apos;s teachings and grounded in the cultural virtues of Botho.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
                    <Link
                        href="/admissions"
                        className="px-7 py-3.5 border border-transparent text-sm sm:text-base font-bold rounded-full text-slate-900 bg-secondary hover:bg-yellow-400 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    >
                        Admissions 2026
                    </Link>
                    <a
                        href="/docs/st-marys-prospectus-2026.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="px-6 py-3.5 border border-white/30 text-sm sm:text-base font-bold rounded-full text-white bg-white/10 hover:bg-white hover:text-primary transition-all backdrop-blur-sm inline-flex items-center gap-2 shadow-sm"
                    >
                        <FileDown size={18} />
                        <span>Download Prospectus</span>
                    </a>
                    <Link
                        href="/about"
                        className="px-6 py-3.5 border border-white/20 text-sm sm:text-base font-semibold rounded-full text-blue-100 hover:text-white hover:border-white/50 transition-all inline-flex items-center gap-1.5"
                    >
                        <span>Our School</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
