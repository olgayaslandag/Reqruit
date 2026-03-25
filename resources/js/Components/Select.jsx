import React from 'react';

export default function Select({ 
    children, 
    className = '',
    error = null,
    ...props 
}) {
    return (
        <div className="relative">
            <select
                className={`block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 ${className}`}
                {...props}
            >
                {children}
            </select>
            
            {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
        </div>
    );
};

export { Select };