import Link from "next/link"

export default function Hero() {
    return (
        <div className="relative bg-primary text-white overflow-hidden">
            {/* Background Pattern/Image Placeholder */}
            <div className="absolute inset-0 bg-blue-900 opacity-50 mix-blend-multiply"></div>
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80')" }}
            >
                {/* Placeholder image from Unsplash - School building/students vibe */}
            </div>

            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                    <span className="block">Welcome to</span>
                    <span className="block text-secondary">St Mary's Primary School</span>
                </h1>
                <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-100">
                    "ONWARD ONWARD FOREVER ONWARD"
                </p>
                <p className="mt-4 text-lg text-gray-200">
                    A leading institution offering high quality, affordable English Medium Primary Education in Tlokweng, Botswana.
                </p>
                <div className="mt-10 flex gap-4 justify-center">
                    <Link
                        href="/admissions"
                        className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-secondary hover:bg-yellow-400 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                        Admissions 2026
                    </Link>
                    <Link
                        href="/about"
                        className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </div>
    )
}
