import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { showToast } from '@/Utils/toast';

/**
 * Custom hook to access flash messages from Inertia page props
 * Eliminates repeated usePage().props.flash code across 22+ pages
 * 
 * @returns {object} - Flash object containing success, error, warning, info properties
 * 
 * @example
 * const { success, error } = useFlash();
 * 
 * // Or with automatic toast display:
 * const { success, error } = useFlash({ autoShow: true });
 */
export function useFlash(options = {}) {
    const { autoShow = false } = options;
    const { props } = usePage();
    const flash = props.flash || {};

    // Display toast messages automatically if enabled
    useEffect(() => {
        if (autoShow) {
            if (flash.success) {
                showToast(flash.success, 'success');
            }
            if (flash.error) {
                showToast(flash.error, 'error');
            }
            if (flash.warning) {
                showToast(flash.warning, 'warning');
            }
            if (flash.info) {
                showToast(flash.info, 'info');
            }
        }
    }, [flash, autoShow]);

    return flash;
}

/**
 * Hook for displaying flash messages with automatic cleanup
 * Handles the stale data issue by using a ref-based approach
 * 
 * @returns {object} - { success, error, warning, info, clear }
 */
export function useFlashWithToast() {
    const { props } = usePage();
    const flash = props.flash || {};
    const prevFlashRef = useRef(null);

    useEffect(() => {
        // Only show if flash data has changed (prevents stale messages)
        const flashString = JSON.stringify(flash);
        if (prevFlashRef.current !== flashString && flashString !== '{}') {
            prevFlashRef.current = flashString;
            
            if (flash.success) {
                showToast(flash.success, 'success');
            }
            if (flash.error) {
                showToast(flash.error, 'error');
            }
            if (flash.warning) {
                showToast(flash.warning, 'warning');
            }
            if (flash.info) {
                showToast(flash.info, 'info');
            }
        }
    }, [flash]);

    return {
        ...flash,
        /**
         * Clear all flash messages by making a dummy visit
         * Useful when you want to clear messages after manual handling
         */
        clear: () => {
            prevFlashRef.current = '{}';
        }
    };
}

export default useFlash;