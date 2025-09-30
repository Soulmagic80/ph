import { createClient } from "@/lib/supabase";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_admin: boolean;
    website: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
}

export function useAuth(initialSession?: Session | null) {
    const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
    const [loading, setLoading] = useState(!initialSession);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    
    // Use useMemo to create a stable supabase client reference
    const supabase = useMemo(() => createClient(), []);

    const fetchProfile = useCallback(async () => {
        if (!user) {
            setAvatarUrl(null);
            setProfile(null);
            return;
        }
        try {
            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error) throw error;
            
            setProfile({
                ...profileData,
                is_admin: profileData.is_admin || false // Convert DB null to application boolean
            });
            setAvatarUrl(profileData?.avatar_url || null);
        } catch (error) {
            // Only log error if user is authenticated (avoid noise on public pages)
            if (user) {
                console.warn('Could not fetch profile for authenticated user:', error);
            }
            setAvatarUrl(null);
            setProfile(null);
        }
    }, [user, supabase]);

    // Fetch profile when user changes
    useEffect(() => {
        if (user) {
            fetchProfile();
        } else {
            setAvatarUrl(null);
            setProfile(null);
        }
    }, [user, fetchProfile]);

    const updateAvatar = (newAvatarUrl: string | null) => {
        setAvatarUrl(newAvatarUrl);
        // Also update profile if it exists
        if (profile) {
            setProfile({ ...profile, avatar_url: newAvatarUrl });
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setAvatarUrl(null);
            setProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    useEffect(() => {
        async function getUser() {
            // Only fetch if we don't have initial session from SSR
            if (!initialSession) {
                try {
                    // SECURE: Use getUser() to validate authenticity (like we had in AuthContext)
                    const { data: { user }, error } = await supabase.auth.getUser();
                    if (error) {
                        // Handle AuthSessionMissingError as normal "not logged in" state
                        if (error.message?.includes('Auth session missing') || error.name === 'AuthSessionMissingError') {
                            setUser(null);
                            return;
                        }
                        console.error('Error getting user:', error);
                        setUser(null);
                        return;
                    }
                    setUser(user);
                } catch (err: any) {
                    // Handle AuthSessionMissingError as normal "not logged in" state
                    if (err.message?.includes('Auth session missing') || err.name === 'AuthSessionMissingError') {
                        setUser(null);
                    } else {
                        console.error('Exception in getUser:', err);
                        setUser(null);
                    }
                } finally {
                    setLoading(false);
                }
            }
        }

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase, initialSession]);

    return { 
        user, 
        profile,
        loading, 
        avatarUrl, 
        updateAvatar, 
        signOut 
    };
}