import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="dropdown">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { toggleOpen } = useContext(DropDownContext);

    return (
        <div onClick={toggleOpen}>{children}</div>
    );
};

const Content = ({ align = 'end', children }) => {
    const { open, setOpen } = useContext(DropDownContext);

    const alignmentClass = align === 'start' ? 'dropdown-menu-start' : 'dropdown-menu-end';

    return (
        <ul
            className={`dropdown-menu ${alignmentClass} ${open ? 'show' : ''}`}
            style={{ display: open ? 'block' : 'none' }}
            onClick={() => setOpen(false)}
        >
            {children}
        </ul>
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

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
