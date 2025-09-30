"use client";

import { useEffect } from 'react';
import { initializeMonitoring } from '@/lib/monitoring';

/**
 * Client-side monitoring provider
 * Initializes error monitoring only on the client to avoid build serialization issues
 */
export function MonitoringProvider() {
  useEffect(() => {
    // Initialize monitoring on client-side only
    initializeMonitoring();
  }, []);

  // This component renders nothing, it's just for side effects
  return null;
}

