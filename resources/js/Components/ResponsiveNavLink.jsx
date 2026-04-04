// This is a duplicate of NavLink and exists only for legacy usage
// Both components were identical - this is maintained for backward compatibility
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
