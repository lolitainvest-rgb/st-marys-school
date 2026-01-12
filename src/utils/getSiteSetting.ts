export async function getSiteSetting(settingKey: string, fallback: string) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn("Supabase credentials missing, using fallback.");
            return fallback;
        }

        const res = await fetch(`${supabaseUrl}/rest/v1/site_settings?key=eq.${settingKey}&select=value`, {
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`
            },
            next: { revalidate: 10 } // Revalidate every 10 seconds so admin updates appear quickly
        });

        if (!res.ok) {
            console.error(`Failed to fetch setting ${settingKey}: ${res.statusText}`);
            return fallback;
        }

        const data = await res.json();
        if (data && data.length > 0) {
            return data[0].value;
        }

        return fallback;
    } catch (e) {
        console.error(`Error fetching setting ${settingKey}:`, e);
        return fallback;
    }
}
