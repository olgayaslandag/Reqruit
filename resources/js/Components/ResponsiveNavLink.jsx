import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`nav-link ${active ? 'active' : ''} ${className}`}
        >
            {children}
        </Link>
    );
}
