export const runtime = 'edge';

import Link from "next/link";
import { Calendar, CheckCircle, Download, FileText } from "lucide-react";

export default function AdmissionsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-primary sm:text-5xl mb-4">Admissions & Fees</h1>
                    <p className="text-lg text-gray-600">Join the St Mary's family for the 2026 Academic Year</p>
                </div>

                {/* Application Process */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText className="text-secondary" /> How to Apply
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-bold text-lg">Visit the School</h3>
                                <p className="text-gray-600">Come to our campus in Tlokweng to collect an application form. Our office hours are 7:30 AM – 4:30 PM.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="font-bold text-lg">Submit Documents</h3>
                                <p className="text-gray-600">Bring the completed form along with:</p>
                                <ul className="mt-2 text-sm text-gray-500 list-disc list-inside ml-2">
                                    <li>Copy of Child's Birth Certificate</li>
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
                                <h3 className="font-bold text-lg">Assessment & Interview</h3>
                                <p className="text-gray-600">Prospective students may be invited for a short assessment to determine placement level.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Term Dates & Fees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* School Fees */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 border-t-4 border-secondary">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">School Fees (2026)</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-gray-600">Registration Fee (One-time)</span>
                                <span className="font-bold text-primary">P 500.00</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-gray-600">Standard 1 - 7 (Per Term)</span>
                                <span className="font-bold text-primary">P 3,500.00*</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-gray-600">Pre-School (Per Term)</span>
                                <span className="font-bold text-primary">P 2,800.00*</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg mt-6">
                                <p className="text-xs text-blue-800">
                                    *Fees are subject to change. Please contact the Bursar's office for the official fee structure and payment plans.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Term Dates */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 border-t-4 border-primary">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Calendar className="text-primary" /> Key Dates
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                <div>
                                    <span className="block font-bold text-gray-900">Term 1 Begins</span>
                                    <span className="text-gray-600">January 13, 2026</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <span className="block font-bold text-gray-900">Term 1 Ends</span>
                                    <span className="text-gray-600">April 10, 2026</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <span className="block font-bold text-gray-900">Office Re-opens</span>
                                    <span className="text-gray-600">January 5, 2026</span>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link href="/calendar" className="text-primary font-bold hover:underline">
                                View Full School Calendar &arr;
                            </Link>
                        </div>
                    </div>

                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Have questions regarding admissions?</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 md:text-lg"
                    >
                        Contact Admissions Office
                    </Link>
                </div>

            </div>
        </div>
    )
}
