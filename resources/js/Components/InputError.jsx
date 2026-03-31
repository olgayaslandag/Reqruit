export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <div
            {...props}
            className={`invalid-feedback d-block ${className}`}
        >
            {message}
        </div>
    ) : null;
}

export { InputError };
