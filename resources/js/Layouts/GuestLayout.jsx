export default function GuestLayout({ children, className = '' }) {
    return (
        <>
            <div className="auth-main">
                <div className="auth-wrapper v3">
                    <div className={`auth-form ${className}`}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
