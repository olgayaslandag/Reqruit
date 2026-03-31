import React from 'react';

export default function Select({
    children,
    className = '',
    error = null,
    ...props
}) {
    return (
        <>
            <select
                className={`form-select ${className}`}
                {...props}
            >
                {children}
            </select>

            {error && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </>
    );
};

export { Select };