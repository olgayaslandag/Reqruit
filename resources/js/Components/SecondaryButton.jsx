export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={`btn btn-secondary btn-sm ${disabled ? 'disabled' : ''} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
