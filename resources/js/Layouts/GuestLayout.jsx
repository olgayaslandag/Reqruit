export default function GuestLayout({ children }) {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
