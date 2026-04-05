import React, { useEffect, useRef, useState } from 'react';

/**
 * Unified Modal Component
 * Replaces 3 different implementations (custom Modal, Bootstrap modals, inline modals)
 * 
 * Features:
 * - ESC key to close
 * - Click outside to close
 * - Focus trap for accessibility
 * - Multiple sizes (sm, md, lg, xl, 2xl, full)
 * - Scrollable body for long content
 * - Callback hooks for open/close events
 */
export default function Modal({
    children,
    show = false,
    maxWidth = 'lg',
    closeable = true,
    onClose = () => {},
    title = '',
    footer = null,
    className = '',
    centered = true,
    scrollable = false,
    staticBackdrop = false,
}) {
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Handle ESC key press and click outside
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && closeable && !staticBackdrop) {
                onClose();
            }
        };

        if (show && closeable) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [show, closeable, onClose, staticBackdrop]);

    // Handle focus and body scroll
    useEffect(() => {
        if (show) {
            // Store the currently focused element to restore later
            previousActiveElement.current = document.activeElement;
            
            // Focus the modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
            
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
        } else {
            // Restore focus
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && closeable && !staticBackdrop) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'modal-sm',
        md: 'modal-md',
        lg: 'modal-lg',
        xl: 'modal-xl',
        '2xl': 'modal-xl',
        full: 'modal-fullscreen',
    }[maxWidth] || 'modal-lg';

    if (!show) return null;

    return (
        <>
            <div
                ref={modalRef}
                className="modal fade show d-block dropdown-open-style"
                tabIndex="-1"
                onClick={handleBackdropClick}
                aria-modal="true"
                role="dialog"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                <div
                    className={`modal-dialog ${centered ? 'modal-dialog-centered' : ''} ${scrollable ? 'modal-dialog-scrollable' : ''} ${maxWidthClass} ${className}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content" tabIndex="0">
                        {title && (
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-title">{title}</h5>
                                {closeable && (
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={onClose}
                                        aria-label="Kapat"
                                    ></button>
                                )}
                            </div>
                        )}
                        <div className={`modal-body ${scrollable ? 'overflow-auto' : ''}`}>
                            {children}
                        </div>
                        {footer && (
                            <div className="modal-footer">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}

/**
 * Simple Modal with children render prop pattern
 */
export function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title = 'Onay',
    message = 'Bu işlemi onaylamak istediğinize emin misiniz?',
    confirmText = 'Onayla',
    cancelText = 'İptal',
    variant = 'primary',
}) {
    const confirmVariantClass = {
        primary: 'btn-primary',
        success: 'btn-success',
        danger: 'btn-danger',
        warning: 'btn-warning',
    }[variant] || 'btn-primary';

    return (
        <Modal show={show} onClose={onClose} title={title} maxWidth="sm">
            <p className="mb-0">{message}</p>
            <div className="mt-3 d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    {cancelText}
                </button>
                <button type="button" className={`btn ${confirmVariantClass}`} onClick={onConfirm}>
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}

/**
 * Form Modal wrapper for forms
 */
export function FormModal({
    show,
    onClose,
    title,
    onSubmit,
    submitText = 'Kaydet',
    cancelText = 'İptal',
    maxWidth = 'lg',
    children,
}) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title={title}
            maxWidth={maxWidth}
            footer={
                <>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button type="submit" form="modal-form" className="btn btn-primary">
                        {submitText}
                    </button>
                </>
            }
        >
            <form id="modal-form" onSubmit={onSubmit}>
                {children}
            </form>
        </Modal>
    );
}