export const runtime = 'edge';

import Link from "next/link";
import { Calendar, CheckCircle, FileDown, FileText, Clock, CreditCard } from "lucide-react";
import { getSiteSetting } from "@/utils/getSiteSetting";

export default async function AdmissionsPage() {
    const prospectusUrl = await getSiteSetting('prospectus_url', '/docs/st-marys-prospectus-2026.pdf');
    const feeScheduleUrl = await getSiteSetting('fee_schedule_url', '/docs/st-marys-fees-schedule-2026.pdf');
    const feesDataRaw = await getSiteSetting('school_fees_data', '');
    const keyDatesRaw = await getSiteSetting('calendar_key_dates', '');

    // Parse dynamic fees
    let fees = {
        registrationFee: "P 500.00",
        standardPrimaryFee: "P 3,500.00*",
        preschoolFee: "P 2,800.00*",
        customItems: [] as { id: string; name: string; amount: string; frequency: string }[],
        notes: "*Fees are subject to change. Please consult the official School Prospectus or contact the Bursar's office for detailed payment plans."
    };

    if (feesDataRaw) {
        try {
            const parsed = JSON.parse(feesDataRaw);
            if (parsed.registrationFee) fees.registrationFee = parsed.registrationFee;
            if (parsed.standardPrimaryFee) fees.standardPrimaryFee = parsed.standardPrimaryFee;
            if (parsed.preschoolFee) fees.preschoolFee = parsed.preschoolFee;
            if (parsed.notes) fees.notes = parsed.notes;
            if (Array.isArray(parsed.customItems)) fees.customItems = parsed.customItems;
        } catch {}
    }

    // Parse dynamic key dates
    let keyDates = [
        { id: "1", title: "Term 1 Begins", date: "January 13, 2026", term: "Term 1", status: "completed" },
        { id: "2", title: "Term 1 Ends", date: "April 10, 2026", term: "Term 1", status: "upcoming" },
        { id: "3", title: "Term 2 Begins", date: "May 12, 2026", term: "Term 2", status: "upcoming" },
        { id: "4", title: "Office Re-opens", date: "January 5, 2026", term: "Term 1", status: "completed" },
    ];

    if (keyDatesRaw) {
        try {
            const parsedDates = JSON.parse(keyDatesRaw);
            if (Array.isArray(parsedDates) && parsedDates.length > 0) {
                keyDates = parsedDates.slice(0, 4); // show key milestone dates
            }
        } catch {}
    }

    return (
        <div className="bg-transparent min-h-screen py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                        Enrollment 2026
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mt-3 mb-3 tracking-tight">
                        Admissions &amp; Fees
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Join the St Mary&apos;s Catholic School family for the 2026 Academic Year
                    </p>
                </div>

                {/* Prospectus & Fees Schedule Spotlight Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-primary to-blue-800 text-white rounded-3xl p-6 sm:p-8 mb-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="text-xs font-extrabold tracking-wider text-secondary uppercase bg-white/10 px-3 py-1 rounded-full">
                            Official School Documents
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            Download Official School Publications
                        </h2>
                        <p className="text-blue-100 text-sm max-w-xl">
                            Includes complete details on the admissions process, required documents, curriculum, fee schedule, and calendar guidelines.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        <a
                            href={prospectusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-secondary text-slate-900 font-extrabold rounded-full hover:bg-yellow-400 transition-all shadow-sm text-xs sm:text-sm hover:scale-105"
                        >
                            <FileDown size={16} />
                            <span>Prospectus (PDF)</span>
                        </a>
                        <a
                            href={feeScheduleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 text-white border border-white/20 font-bold rounded-full hover:bg-white hover:text-primary transition-all text-xs sm:text-sm"
                        >
                            <FileDown size={16} />
                            <span>Fees Schedule (PDF)</span>
                        </a>
                    </div>
                </div>

                {/* Application Process */}
                <div className="bg-blue-50/40 backdrop-blur-md rounded-2xl shadow-sm p-8 mb-12 border border-blue-100/80">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FileText className="text-secondary" /> How to Apply
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Visit the School or Download Prospectus</h3>
                                <p className="text-slate-700 text-sm sm:text-base">
                                    Come to our campus in Tlokweng to collect an application form or download our official prospectus. Our office hours are Monday – Thursday: 7:30 AM – 3:30 PM &amp; Friday: 7:30 AM – 12:30 PM.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Submit Documents</h3>
                                <p className="text-slate-700 text-sm sm:text-base">Bring the completed form along with:</p>
                                <ul className="mt-2 text-sm text-slate-600 list-disc list-inside ml-2 space-y-1">
                                    <li>Copy of Child&apos;s Birth Certificate</li>
                                    <li>Copy of Parent/Guardian ID (Omang/Passport)</li>
                                    <li>Recent Passport Size Photo of the child</li>
                                    <li>Immunization Card (Clinic Card)</li>
                                    <li>Latest Report Card (if transferring)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Assessment &amp; Placement</h3>
                                <p className="text-slate-700 text-sm sm:text-base">Prospective students may be invited for a short placement assessment to determine appropriate learning support.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Term Dates & Fees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* School Fees */}
                    <div className="bg-amber-50/35 backdrop-blur-md rounded-2xl shadow-sm p-8 border-t-4 border-secondary border-x border-b border-amber-200/70 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <CreditCard className="text-primary w-6 h-6" /> School Fees (2026)
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-slate-700 font-medium">Registration Fee (One-time)</span>
                                    <span className="font-bold text-primary">{fees.registrationFee}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-slate-700 font-medium">Standard 1 – 7 (Per Term)</span>
                                    <span className="font-bold text-primary">{fees.standardPrimaryFee}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-slate-700 font-medium">Pre-School (Per Term)</span>
                                    <span className="font-bold text-primary">{fees.preschoolFee}</span>
                                </div>

                                {fees.customItems && fees.customItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center pb-2 border-b border-slate-100">
                                        <span className="text-slate-700 font-medium">{item.name} ({item.frequency})</span>
                                        <span className="font-bold text-slate-900">{item.amount}</span>
                                    </div>
                                ))}

                                <div className="bg-blue-50/90 p-4 rounded-xl mt-4 border border-blue-100">
                                    <p className="text-xs text-blue-950 leading-relaxed font-medium">
                                        {fees.notes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <a
                                href={feeScheduleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                            >
                                <FileDown size={15} />
                                <span>Download Official Fees Schedule (PDF)</span>
                            </a>
                        </div>
                    </div>

                    {/* Term Dates */}
                    <div className="bg-blue-50/35 backdrop-blur-md rounded-2xl shadow-sm p-8 border-t-4 border-primary border-x border-b border-blue-200/70 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Calendar className="text-primary" /> Key Dates (2026)
                            </h2>
                            <ul className="space-y-4">
                                {keyDates.map((d) => (
                                    <li key={d.id} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="block font-bold text-gray-900 text-sm">{d.title}</span>
                                            <span className="text-xs text-gray-500">{d.date} ({d.term})</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100">
                            <Link 
                                href="/calendar" 
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-primary border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                                <Calendar size={15} />
                                <span>View Full School Calendar &amp; Term Dates &rarr;</span>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Have questions regarding admissions?</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-white bg-primary hover:bg-blue-700 md:text-lg shadow-md transition-all"
                    >
                        Contact Admissions Office
                    </Link>
                </div>

            </div>
        </div>
    );
}
