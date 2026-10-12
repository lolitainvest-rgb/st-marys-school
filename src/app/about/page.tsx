export const runtime = 'edge';

import { 
    School, 
    Target, 
    Eye, 
    Compass, 
    Heart, 
    Sparkles, 
    ShieldCheck, 
    CheckCircle2, 
    Smile, 
    Scale, 
    Flame, 
    Award, 
    BookOpen, 
    Palette, 
    FileDown, 
    ArrowRight 
} from "lucide-react";
import Link from "next/link";

const coreValues = [
    {
        num: "i",
        title: "Love and Compassion",
        icon: Heart,
        color: "text-rose-600 bg-rose-50 border-rose-200",
        description: "Fostering empathy, deep care for our community, and understanding toward every child and peer."
    },
    {
        num: "ii",
        title: "Faith and Hope",
        icon: Sparkles,
        color: "text-amber-600 bg-amber-50 border-amber-200",
        description: "Rooted in Catholic teachings, encouraging steadfast optimism, spiritual growth, and belief in a bright future."
    },
    {
        num: "iii",
        title: "Respect for others and Personal Dignity",
        icon: ShieldCheck,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        description: "Honouring the inherent value of every individual, nurturing self-worth and courtesy in all interactions."
    },
    {
        num: "iv",
        title: "Responsibility",
        icon: CheckCircle2,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        description: "Instilling accountability for our actions, academic commitments, and stewardship of our school community."
    },
    {
        num: "v",
        title: "Kindness",
        icon: Smile,
        color: "text-pink-600 bg-pink-50 border-pink-200",
        description: "Encouraging a warm, welcoming spirit with daily acts of generosity, gentleness, and goodwill."
    },
    {
        num: "vi",
        title: "Justice and Honesty",
        icon: Scale,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        description: "Standing firmly for fairness, truthfulness, integrity, and ethical conduct in all spheres of life."
    },
    {
        num: "vii",
        title: "Resilience",
        icon: Flame,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        description: "Building the fortitude to overcome challenges, learn from adversity, and persevere through difficulties."
    },
    {
        num: "viii",
        title: "Diligence",
        icon: Award,
        color: "text-teal-600 bg-teal-50 border-teal-200",
        description: "Committing wholeheartedly to hard work, punctuality, and the steady pursuit of personal excellence."
    },
    {
        num: "ix",
        title: "Love for learning",
        icon: BookOpen,
        color: "text-cyan-600 bg-cyan-50 border-cyan-200",
        description: "Cultivating inquisitive minds, intellectual curiosity, and an enduring passion for knowledge."
    },
    {
        num: "x",
        title: "Creativity",
        icon: Palette,
        color: "text-purple-600 bg-purple-50 border-purple-200",
        description: "Nurturing imaginative thinking, original problem solving, artistic expression, and innovative spirit."
    }
];

export default function AboutPage() {
    return (
        <div className="bg-transparent min-h-screen">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-blue-50/70 via-white/80 to-transparent py-16 md:py-24 border-b border-slate-200/60 backdrop-blur-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold bg-blue-100/80 text-primary border border-blue-200 mb-4">
                        <School size={16} />
                        <span>Catholic English Medium Primary Education</span>
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl tracking-tight">
                        About Our School
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        A proud tradition of academic excellence, moral grounding, and holistic development in Tlokweng, Botswana.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            href="/docs/st-marys-prospectus-2026.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                        >
                            <FileDown size={18} />
                            <span>Download Official Prospectus</span>
                        </a>
                        <Link
                            href="/admissions"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-white text-slate-800 hover:text-primary border border-slate-300 hover:border-primary shadow-xs transition-all"
                        >
                            <span>Admissions Information</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                {/* Section 1: Our School (formerly Our History) */}
                <section className="bg-blue-50/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-sm border border-blue-100/80">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-secondary/20 text-slate-900 border border-secondary/40">
                                <span>Overview &amp; Heritage</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Our School
                            </h2>
                            <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
                                <p className="font-semibold text-slate-800">
                                    Introduction:
                                </p>
                                <p>
                                    St Mary&apos;s is a Catholic English Medium Primary School. The school was established by Mrs Louise Mmusi, a seasoned educator in the year 1996. The rationale behind establishing the school was to offer parents with affordable quality primary education in a conducive and safe environment.
                                </p>
                                <p>
                                    The school embraces Catholic and general Christian values and ethos to develop a child with high morals and values. In January 2026, a deliberate decision was taken by the school directors to convert the school into a Catholic School in collaboration with the Catholic Diocese of Francistown. The school will instil acceptable behaviour that will make it easy for children to survive in morally decaying society.
                                </p>
                            </div>
                        </div>

                        {/* Motto Card & Quick Stats */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-gradient-to-br from-primary via-blue-700 to-indigo-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                                <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-3">
                                    <Compass className="w-4 h-4" />
                                    <span>2.0 School Motto</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight mb-4">
                                    &ldquo;Forever Onward&rdquo;
                                </h3>
                                <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                                    The motto of the school is &ldquo;Forever Onward&rdquo;. The school is determined to continuously improve in curriculum delivery, academic performance and in the co-curricular activities. The school remains resolute in ensuring that children improve and achieve their highest potential.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 text-center">
                                    <span className="block text-2xl md:text-3xl font-extrabold text-primary">1996</span>
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1 block">Founded by Mrs L. Mmusi</span>
                                </div>
                                <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-5 text-center">
                                    <span className="block text-2xl md:text-3xl font-extrabold text-amber-700">2026</span>
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1 block">Diocese Collaboration</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Mission & Vision */}
                <section className="space-y-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-xs font-bold tracking-widest text-primary uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            Guiding Purpose
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                            Mission &amp; Vision
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mission Card */}
                        <div className="bg-blue-50/45 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-sm border border-blue-200/70 hover:shadow-md transition-shadow relative flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-primary flex items-center justify-center border border-blue-200 shadow-xs">
                                    <Target className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                    Our Mission
                                </h3>
                                <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                                    &ldquo;St Mary&apos;s Catholic Primary School strives to deliver quality and affordable primary school education in a safe and conducive environment for the academic, physical, moral, spiritual and emotional development of our children.&rdquo;
                                </p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-blue-100/80 flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                                <CheckCircle2 size={16} />
                                <span>Holistic Child Development</span>
                            </div>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-amber-50/45 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-sm border border-amber-200/70 hover:shadow-md transition-shadow relative flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
                                    <Eye className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                    Our Vision
                                </h3>
                                <div className="text-slate-700 text-base md:text-lg leading-relaxed space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Vision:
                                    </p>
                                    <p>
                                        &ldquo;To Provide Affordable, Quality and Nurturing Education centred on Christ&apos;s Teachings.&rdquo;
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-amber-100/80 flex items-center gap-2 text-xs font-bold text-amber-750 uppercase tracking-wider">
                                <Sparkles size={16} />
                                <span>Centred on Christ&apos;s Teachings</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Values & Botho */}
                <section className="space-y-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold tracking-widest text-primary uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            Moral &amp; Character Framework
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Our Values &amp; Botho
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg">
                            Grounding young learners in African humane character, spiritual depth, and the enduring virtues of good citizenship.
                        </p>
                    </div>

                    {/* Botho Callout Banner */}
                    <div className="bg-gradient-to-r from-blue-900 via-primary to-blue-800 text-white rounded-2xl p-6 md:p-8 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="inline-block text-xs font-bold tracking-widest uppercase text-secondary bg-white/10 px-3 py-1 rounded-full mb-2">
                                    Foundational Pillar
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                    Botho
                                </h3>
                                <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                                    The cornerstone of our cultural ethos and moral instruction. Botho nurtures compassion, mutual dignity, humility, and community solidarity in each pupil, ensuring our learners grow with high morals and respect for all.
                                </p>
                            </div>
                            <div className="flex-shrink-0 self-start sm:self-center">
                                <span className="px-4 py-2 rounded-xl bg-white/15 border border-white/20 text-xs font-bold tracking-wider uppercase text-secondary">
                                    10 Core Virtues
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 10 Values Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
                        {coreValues.map((val, idx) => {
                            const IconComponent = val.icon;
                            const isEven = idx % 2 === 0;
                            return (
                                <div
                                    key={val.num}
                                    className={`${isEven ? 'bg-blue-50/35 border-blue-100/80' : 'bg-amber-50/35 border-amber-100/80'} backdrop-blur-md rounded-2xl p-5 border shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${val.color} group-hover:scale-110 transition-transform`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 font-serif">
                                                {val.num})
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-base mb-2 group-hover:text-primary transition-colors">
                                            {val.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {val.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">
                                        <span>Virtue {val.num}</span>
                                        <CheckCircle2 size={13} className="text-emerald-500" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 4: Download Prospectus CTA */}
                <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="space-y-3 text-center lg:text-left">
                            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-secondary bg-white/10 rounded-full uppercase">
                                Official School Publication
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                St Mary&apos;s Primary School Prospectus
                            </h3>
                            <p className="text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                                Download our official 2026 prospectus to learn more about our Catholic ethos, curriculum, extracurricular activities, and admissions policies.
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
                            <a
                                href="/docs/st-marys-prospectus-2026.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary text-slate-900 rounded-full font-bold text-sm hover:bg-amber-400 transition-all shadow-md"
                            >
                                <FileDown size={18} />
                                <span>Download PDF Prospectus</span>
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white border border-white/20 rounded-full font-bold text-sm hover:bg-white/20 transition-all"
                            >
                                <span>Contact School</span>
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
