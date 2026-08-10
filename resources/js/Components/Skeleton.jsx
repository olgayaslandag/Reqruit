import React from 'react';

/**
 * Base Skeleton component for loading states
 * Provides a shimmer effect to indicate loading content
 */
export function Skeleton({ className = '', variant = 'text', width, height, circle = false }) {
    const baseClasses = 'animate-pulse bg-secondary-subtle';
    
    const variantClasses = {
        text: 'rounded',
        rectangular: 'rounded',
        circular: 'rounded-circle',
        avatar: 'rounded-circle',
        card: 'rounded',
    };

    const classes = [
        baseClasses,
        variantClasses[variant] || variantClasses.text,
        circle ? 'rounded-circle' : '',
        className,
    ].filter(Boolean).join(' ');

    const style = {
        width: width || (variant === 'avatar' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '1rem' : variant === 'avatar' ? '40px' : '100%'),
    };

    return <div className={classes} style={style} aria-hidden="true" />;
}

/**
 * Skeleton for table rows
 */
export function SkeletonRow({ columns = 5 }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, index) => (
                <td key={index} className="px-4 py-3">
                    <Skeleton variant="text" width="80%" />
                </td>
            ))}
        </tr>
    );
}

/**
 * Skeleton for table with multiple rows
 */
export function SkeletonTable({ rows = 5, columns = 5, header = true }) {
    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                {header && (
                    <thead>
                        <tr>
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index} className="px-4 py-3">
                                    <Skeleton variant="text" width="60%" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <SkeletonRow key={rowIndex} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Skeleton for card component
 */
export function SkeletonCard({ title = true, image = false, footer = false }) {
    return (
        <div className="card">
            {image && (
                <div className="card-img-top">
                    <Skeleton height="200px" variant="rectangular" />
                </div>
            )}
            <div className="card-body">
                {title && (
                    <>
                        <Skeleton width="60%" height="1.5rem" className="mb-2" />
                        <Skeleton width="80%" variant="text" />
                    </>
                )}
            </div>
            {footer && (
                <div className="card-footer">
                    <Skeleton width="30%" />
                </div>
            )}
        </div>
    );
}

/**
 * Skeleton for form inputs
 */
export function SkeletonInput({ label = true }) {
    return (
        <div className="mb-3">
            {label && <Skeleton width="30%" height="0.875rem" className="mb-2" />}
            <Skeleton height="38px" variant="rectangular" />
        </div>
    );
}

/**
 * Skeleton for form with multiple inputs
 */
export function SkeletonForm({ fields = 3, buttons = 1 }) {
    return (
        <div>
            {Array.from({ length: fields }).map((_, index) => (
                <SkeletonInput key={index} />
            ))}
            {Array.from({ length: buttons }).map((_, index) => (
                <Skeleton key={`btn-${index}`} width="100px" height="38px" className="me-2" />
            ))}
        </div>
    );
}

/**
 * Skeleton for stats/card widget
 */
export function SkeletonStat({ icon = true }) {
    return (
        <div className="card bg-primary-subtle">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <Skeleton width="60%" height="0.875rem" className="mb-2" />
                        <Skeleton width="40%" height="2rem" />
                    </div>
                    {icon && (
                        <Skeleton width="48px" height="48px" circle />
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Loading overlay component
 */
export function LoadingOverlay({ message = 'Yükleniyor...' }) {
    return (
        <div className="position-relative">
            <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ zIndex: 10 }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{message}</span>
                </div>
                {message && <div className="mt-2 text-muted">{message}</div>}
            </div>
            <div className="opacity-50">
                {/* Placeholder content */}
            </div>
        </div>
    );
}

/**
 * Table loading state component
 */
export function TableLoading({ message = 'Veriler yükleniyor...' }) {
    return (
        <div className="card">
            <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Yükleniyor</span>
                </div>
                <p className="text-muted mb-0">{message}</p>
            </div>
        </div>
    );
}

/**
 * Page loading state with skeleton
 */
export function PageSkeleton({ type = 'table', ...props }) {
    switch (type) {
        case 'table':
            return <SkeletonTable {...props} />;
        case 'card':
            return <SkeletonCard {...props} />;
        case 'form':
            return <SkeletonForm {...props} />;
        case 'stats':
            return (
                <div className="row">
                    {Array.from({ length: props.count || 4 }).map((_, index) => (
                        <div key={index} className="col-md-3">
                            <SkeletonStat />
                        </div>
                    ))}
                </div>
            );
        default:
            return <Skeleton />;
    }
}

export default Skeleton;