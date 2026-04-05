import React from 'react';

const EmptyState = ({
    title,
    description,
    icon = null,
    buttonLabel = '',
    onButtonClick = null,
    imageUrl = '',
    actionUrl = '',
    linkText = '',
    className = ''
}) => {
    // Render icon if provided
    const renderIcon = () => {
        if (icon) {
            return <div className="mb-3 text-muted fs-1">{icon}</div>;
        }
        return null;
    };

    // Render image if provided
    const renderImage = () => {
        if (imageUrl) {
            return (
                <div className="mb-4">
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className="img-fluid" 
                        style={{ maxHeight: '200px', opacity: 0.7 }}
                    />
                </div>
            );
        }
        return null;
    };

    // Determine if we should render a CTA
    const hasCTA = (onButtonClick || actionUrl) && (buttonLabel || linkText);

    // Render CTA if needed
    const renderCTA = () => {
        if (!hasCTA) {
            return null;
        }

        if (onButtonClick) {
            return (
                <button
                    onClick={onButtonClick}
                    className="btn btn-primary"
                >
                    {buttonLabel}
                </button>
            );
        }
        
        // or render a link if actionUrl is provided
        if (actionUrl) {
            return (
                <a 
                    href={actionUrl}
                    className="btn btn-primary"
                >
                    {linkText}
                </a>
            );
        }
        
        return null;
    };

    return (
        <div className={`text-center p-5 ${className}`}>
            {renderImage()}
            {renderIcon()}
            <h4 className="text-dark mb-2">
                {title}
            </h4>
            <p className="text-muted mb-4">
                {description}
            </p>
            {renderCTA()}
        </div>
    );
};

export default EmptyState;