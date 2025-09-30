/**
 * Production monitoring for chunk loading errors
 * Prevents ChunkLoadError and MODULE_NOT_FOUND crashes
 * 
 * This function must be called client-side only to avoid build serialization issues
 */

export function initializeMonitoring() {
  if (typeof window === 'undefined') return;

  // Global error handler for chunk loading issues
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    // Detect chunk loading errors
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('ChunkLoadError') ||
      error?.message?.includes('use-sync-external-store')
    ) {
      console.warn('🔄 Chunk loading error detected, attempting recovery:', error.message);
      
      // Attempt automatic recovery
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 1000);
      
      // Prevent error from bubbling up
      event.preventDefault();
      return false;
    }
  });

  // Monitor webpack chunk loading
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    
    if (
      reason?.message?.includes('ChunkLoadError') ||
      reason?.message?.includes('use-sync-external-store') ||
      reason?.message?.includes('vendor-chunks')
    ) {
      console.warn('🔄 Promise rejection for chunk loading detected:', reason.message);
      
      // Auto-recovery for chunk errors
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 1000);
      
      event.preventDefault();
      return false;
    }
  });
}


