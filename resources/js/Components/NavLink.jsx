import NavBase from './NavBase';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <NavBase
            {...props}
            active={active}
            className={className}
        >
            {children}
        </NavBase>
    );
}
