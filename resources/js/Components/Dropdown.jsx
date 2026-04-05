import { Link } from '@inertiajs/react';
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        // Add event listener when dropdown is open
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [open]);

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="dropdown" ref={dropdownRef}>{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { toggleOpen } = useContext(DropDownContext);

    return (
        <div onClick={toggleOpen} style={{ cursor: 'pointer' }}>{children}</div>
    );
};

const Content = ({ align = 'end', children, className = '' }) => {
    const { open, setOpen } = useContext(DropDownContext);

    const alignmentClass = align === 'start' ? 'dropdown-menu-start' : 'dropdown-menu-end';

    if (!open) return null;

    return (
        <ul
            className={`dropdown-menu ${alignmentClass} show ${className}`}
            style={{ display: 'block', position: 'absolute' }}
            onClick={(e) => {
                // Don't close if clicking on a disabled item
                if (e.target.classList.contains('disabled')) return;
                setOpen(false);
            }}
        >
            {children}
        </ul>
    );
};

const Button = ({ children, onClick, className = '', variant = 'primary', size = 'md', disabled = false }) => {
    const sizeClass = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    }[size] || '';

    const variantClass = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        danger: 'btn-danger',
        warning: 'btn-warning',
        info: 'btn-info',
        light: 'btn-light',
        dark: 'btn-dark',
        outline: 'btn-outline-secondary',
    }[variant] || 'btn-primary';

    return (
        <button
            type="button"
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={`dropdown-item ${className}`}
        >
            {children}
        </Link>
    );
};

const DropdownItem = ({ className = '', children, onClick, disabled = false }) => {
    return (
        <li>
            <button
                type="button"
                className={`dropdown-item ${disabled ? 'disabled' : ''} ${className}`}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        </li>
    );
};

const DropdownDivider = () => {
    return <li><hr className="dropdown-divider" /></li>;
};

const DropdownHeader = ({ children, className = '' }) => {
    return <li><h6 className={`dropdown-header ${className}`}>{children}</h6></li>;
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
Dropdown.Item = DropdownItem;
Dropdown.Button = Button;
Dropdown.Divider = DropdownDivider;
Dropdown.Header = DropdownHeader;

export default Dropdown;