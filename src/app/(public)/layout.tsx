import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navigation/Navbar";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get authenticated user for navigation (SECURE)
    let initialSession = null;
    try {
        const supabase = await createServerSupabaseClient();
        // Use getUser() for security - validates against auth server
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
            // Reconstruct minimal session for navbar
            initialSession = {
                user,
                access_token: '', // Not needed for UI
                refresh_token: '', // Not needed for UI
                expires_at: 0, // Not needed for UI
                expires_in: 0,
                token_type: 'bearer'
            };
        }
    } catch (error) {
        console.error('Error getting authenticated user for navbar:', error);
    }

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen">
            <Navbar initialSession={initialSession} />
            {children}
            <Footer />
        </div>
    );
} 