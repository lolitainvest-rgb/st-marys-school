import { BadgeCheck, Eye, Target, History } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Header */}
            <div className="bg-blue-50 py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">About Our School</h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        A legacy of excellence, community, and cultural pride since our founding.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* History Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <History className="text-secondary w-8 h-8" />
                        <h2 className="text-3xl font-bold text-gray-900">Our History</h2>
                    </div>
                    <div className="prose prose-blue text-gray-600">
                        <p className="mb-4">
                            St Mary's English Medium Primary School has served the Tlokweng and Gaborone community for years,
                            establishing itself as a beacon of quality education.
                        </p>
                        <p className="mb-4">
                            From our humble beginnings, we have grown into a leading institution, known for our vibrant campus
                            embodied by our Royal Blue and Yellow colors. Our motto "ONWARD ONWARD FOREVER ONWARD" drives us
                            to continually improve and adapt to the changing educational landscape while staying rooted in our traditions.
                        </p>
                        <p>
                            We take pride in our alumni who have gone on to excel in secondary and tertiary education, carrying
                            the St Mary's spirit of discipline and hard work with them.
                        </p>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="grid gap-6">
                    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="text-primary w-6 h-6" />
                            <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                        </div>
                        <p className="text-gray-600">
                            To be the leading institution that offers high quality, affordable English Medium Primary Education,
                            fostering holistic development in every child.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <Eye className="text-primary w-6 h-6" />
                            <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                        </div>
                        <p className="text-gray-600">
                            To cultivate a learning environment where academic excellence meets cultural heritage,
                            empowering students to become responsible global citizens.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <BadgeCheck className="text-primary w-6 h-6" />
                            <h3 className="text-xl font-bold text-gray-900">Core Values</h3>
                        </div>
                        <ul className="text-gray-600 list-disc list-inside space-y-1">
                            <li>Academic Excellence</li>
                            <li>Discipline & Respect</li>
                            <li>Cultural Pride</li>
                            <li>Community Service</li>
                            <li>Integrity</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}
