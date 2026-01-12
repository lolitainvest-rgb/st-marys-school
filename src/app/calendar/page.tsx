export const runtime = 'edge';

import EventCalendar from "@/components/EventCalendar";

export default function CalendarPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-primary sm:text-5xl mb-4">School Calendar</h1>
                    <p className="text-lg text-gray-600">
                        Keep track of term dates, exams, sports days, and cultural events.
                    </p>
                </div>

                <EventCalendar />
            </div>
        </div>
    )
}
