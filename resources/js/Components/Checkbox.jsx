import React from 'react';

const Checkbox = React.forwardRef(({ className = '', ...props }, ref) => {
    const combinedClassName = `form-check-input ${className}`.trim();

    return (
        <input
            {...props}
            ref={ref}
            type="checkbox"
            className={combinedClassName}
        />
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
export { Checkbox };
