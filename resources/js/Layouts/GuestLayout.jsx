export default function GuestLayout({ children }) {
    return (
        <div className="auth-main">
            <div className="auth-wrapper v3">
                <div className="auth-form container">
                    {children}
                </div>
            </div>
        </div>
    );
}