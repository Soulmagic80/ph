"use client";

import { requiresAdminMFA } from "@/lib/auth2FA";
import { useEffect, useState } from "react";

interface MFAGuardState {
  isLoading: boolean;
  requiresMFA: boolean;
  factorId?: string;
  isVerified: boolean;
}

/**
 * Hook to guard admin routes with MFA verification
 */
export function useMFAGuard() {
  const [state, setState] = useState<MFAGuardState>({
    isLoading: true,
    requiresMFA: false,
    isVerified: false
  });

  useEffect(() => {
    checkMFARequirement();
  }, []);

  const checkMFARequirement = async () => {
    try {
      const { required, factorId } = await requiresAdminMFA();
      console.log('🔍 MFA Guard - Required:', required, 'FactorId:', factorId);
      
      setState({
        isLoading: false,
        requiresMFA: required,
        factorId,
        isVerified: !required // If MFA not required, consider verified
      });
    } catch (error) {
      console.error('MFA check failed:', error);
      setState({
        isLoading: false,
        requiresMFA: false,
        isVerified: true // Fail open for now
      });
    }
  };

  const markAsVerified = () => {
    setState(prev => ({
      ...prev,
      isVerified: true,
      requiresMFA: false
    }));
  };

  const resetVerification = () => {
    setState(prev => ({
      ...prev,
      isVerified: false,
      requiresMFA: true
    }));
  };

  return {
    ...state,
    markAsVerified,
    resetVerification,
    recheckMFA: checkMFARequirement
  };
}

