export default function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "School",
        "name": "St Mary's English Medium Primary School",
        "image": "https://stmarysschool.co.bw/og-image.jpg",
        "url": "https://stmarysschool.co.bw",
        "telephone": "+2673928788",
        "email": "admin@stmarysschool.co.bw",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Plot 1040 Lenganeng",
            "addressLocality": "Tlokweng",
            "addressRegion": "South-East District",
            "addressCountry": "BW"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -24.6583,
            "longitude": 25.9225
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "07:30",
            "closes": "16:30"
        },
        "sameAs": [
            "https://www.facebook.com/StMarysEnglishMediumPrimarySchool"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
