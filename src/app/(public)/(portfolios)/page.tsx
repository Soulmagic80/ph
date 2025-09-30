import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import HomeClient from "./HomeClient";

export default async function Home() {
    // Get authenticated user on server-side (SECURE)
    let initialSession = null;
    try {
        const supabase = await createServerSupabaseClient();
        // Use getUser() for security - validates against auth server
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
            // Reconstruct minimal session for client
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
        console.error('Error getting authenticated user:', error);
    }
    return (
        <ErrorBoundary>
            <HomeClient initialSession={initialSession} />
        </ErrorBoundary>
    );
}