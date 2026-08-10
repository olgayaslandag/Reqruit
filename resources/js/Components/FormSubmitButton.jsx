import React from 'react';

export default function FormSubmitButton({ 
    children, 
    processing = false, 
    disabled = false, 
    className = '', 
    type = 'submit',
    ...props 
}) {
    return (
        <button
            type={type}
            disabled={processing || disabled}
            className={`${className} btn btn-primary d-inline-flex align-items-center text-uppercase ${
                processing || disabled ? 'disabled' : ''
            }`}
            {...props}
        >
            {processing && (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            )}
            {children}
        </button>
    );
}