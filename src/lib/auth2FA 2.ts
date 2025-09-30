import { createClient } from '@/lib/supabase';

export interface MFAEnrollment {
  id: string;
  type: string;
  friendly_name: string;
  created_at: string;
}

export interface MFAChallenge {
  id: string;
  type: string;
  expires_at: number;
}

/**
 * Enable MFA/2FA for the current user
 */
export async function enableMFA(): Promise<{ qrCode?: string; secret?: string; factorId?: string; error?: string }> {
  const supabase = createClient();
  
  try {
    // First check if user already has MFA factors
    const { factors } = await getMFAFactors();
    if (factors.length > 0) {
      // Check if any factor is verified/active
      const activeFactor = factors.find(f => f.friendly_name === 'Admin 2FA');
      if (activeFactor) {
        return { error: 'MFA is already enabled for this account.' };
      }
    }

    // Get current user to check session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: 'User not authenticated. Please refresh and try again.' };
    }

    console.log('Attempting MFA enrollment for user:', user.id);

    // If there's an existing factor with the same name, try to remove it first
    if (factors.length > 0) {
      console.log('Found existing factors, attempting to clean up...');
      for (const factor of factors) {
        try {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
          console.log('Removed existing factor:', factor.id);
        } catch (cleanupError) {
          console.warn('Could not remove existing factor:', cleanupError);
        }
      }
    }

    // Generate a unique friendly name to avoid conflicts
    const timestamp = Date.now();
    const friendlyName = `Admin 2FA ${timestamp}`;

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: friendlyName
    });

    if (error) {
      console.error('MFA enrollment error details:', error);
      
      // Provide better error messages for common issues
      if (error.message.includes('422') || error.message.includes('Unprocessable')) {
        return { error: `MFA enrollment failed: ${error.message}. This could mean MFA is not properly configured in your Supabase project or the user session is invalid.` };
      }
      return { error: `MFA enrollment failed: ${error.message}` };
    }

    console.log('MFA enrollment successful');
    console.log('MFA enrollment data:', data);
    return {
      qrCode: data.totp?.qr_code || '',
      secret: data.totp?.secret || '',
      factorId: data.id
    };
  } catch (error: any) {
    console.error('MFA enrollment error:', error);
    return { error: `Failed to enable MFA: ${error.message || 'Unknown error'}` };
  }
}

/**
 * Verify MFA setup with TOTP code
 */
export async function verifyMFASetup(factorId: string, code: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to verify MFA setup' };
  }
}

/**
 * Create MFA challenge for login
 */
export async function createMFAChallenge(factorId: string): Promise<{ challenge?: MFAChallenge; error?: string }> {
  const supabase = createClient();
  
  if (!factorId) {
    return { error: 'Factor ID is required' };
  }
  
  try {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });

    if (error) {
      return { error: error.message };
    }

    return { challenge: data };
  } catch (error) {
    return { error: 'Failed to create MFA challenge' };
  }
}

/**
 * Verify MFA challenge with TOTP code
 */
export async function verifyMFAChallenge(challengeId: string, code: string, factorId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  if (!challengeId) {
    return { success: false, error: 'Challenge ID is required' };
  }
  
  if (!factorId) {
    return { success: false, error: 'Factor ID is required' };
  }
  
  if (!code) {
    return { success: false, error: 'Verification code is required' };
  }
  
  try {
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to verify MFA code' };
  }
}

/**
 * Get user's MFA factors
 */
export async function getMFAFactors(): Promise<{ factors: MFAEnrollment[]; error?: string }> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      return { factors: [], error: error.message };
    }

    const factors = (data.totp || []).map((factor: any) => ({
      id: factor.id,
      type: factor.type || 'totp',
      friendly_name: factor.friendly_name || 'Admin 2FA',
      created_at: factor.created_at || new Date().toISOString()
    }));
    return { factors };
  } catch (error) {
    return { factors: [], error: 'Failed to get MFA factors' };
  }
}

/**
 * Disable MFA factor
 */
export async function disableMFA(factorId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to disable MFA' };
  }
}

/**
 * Check if user has MFA enabled
 */
export async function hasMFAEnabled(): Promise<boolean> {
  const { factors } = await getMFAFactors();
  return factors.length > 0;
}

/**
 * Check if admin requires MFA verification
 */
export async function requiresAdminMFA(): Promise<{ required: boolean; factorId?: string }> {
  const supabase = createClient();
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { required: false };

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) return { required: false };

    // Check if user has MFA enabled
    const { factors } = await getMFAFactors();
    if (factors.length === 0) return { required: false };

    // Check if current session has MFA verification
    const aal = (user as any).aal; // Authentication Assurance Level
    if (aal === 'aal2') return { required: false }; // Already verified

    return { 
      required: true, 
      factorId: factors[0].id 
    };
  } catch (error) {
    return { required: false };
  }
}







