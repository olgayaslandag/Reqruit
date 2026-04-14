import AuthLayout from './AuthLayout';

export default function GuestLayout({ children }) {
    return (
        <AuthLayout>
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
                <div className="card shadow guest-card-max-width">
                    <div className="card-body">
                        {children}
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
