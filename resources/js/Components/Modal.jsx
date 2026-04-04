import React, { useEffect, useRef } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = 'lg',
    closeable = true,
    onClose = () => {},
    title = '',
}) {
    const modalRef = useRef(null);
    
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && closeable) {
                onClose();
            }
        };

        // Manage focus trap when modal is shown
        if (show && modalRef.current) {
            document.addEventListener('keydown', handleEscKey);
            
            // Focus the modal for accessibility
            modalRef.current.focus();
            
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [show, closeable, onClose]);

    const maxWidthClass = {
        sm: 'modal-sm',
        md: 'modal-md',
        lg: 'modal-lg',
        xl: 'modal-xl',
        '2xl': 'modal-xl',
    }[maxWidth] || 'modal-lg';

    return (
        <>
            {show && (
                <div
                    ref={modalRef}
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ display: 'block' }}
                    onClick={close}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className={`modal-dialog modal-dialog-centered ${maxWidthClass}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content" tabIndex="0">
                            {title && (
                                <div className="modal-header">
                                    <h5 className="modal-title">{title}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={close}
                                        aria-label="Close"
                                    ></button>
                                </div>
                            )}
                            <div className="modal-body">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
}
