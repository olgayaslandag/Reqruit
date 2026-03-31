import React from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = 'lg',
    closeable = true,
    onClose = () => {},
    title = '',
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'modal-sm',
        md: 'modal-md',
        lg: 'modal-lg',
        xl: 'modal-xl',
        '2xl': 'modal-xl',
    }[maxWidth] || 'modal-lg';

    return (
        <>
            <div
                className={`modal fade ${show ? 'show' : ''}`}
                style={{ display: show ? 'block' : 'none' }}
                tabIndex="-1"
                onClick={close}
            >
                <div
                    className={`modal-dialog modal-dialog-centered ${maxWidthClass}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        {title && (
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={close}
                                ></button>
                            </div>
                        )}
                        <div className="modal-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show" onClick={close}></div>}
        </>
    );
}
