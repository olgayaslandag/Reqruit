import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to an error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
                    <div className="card w-100 text-center p-4" style={{ maxWidth: '28rem' }}>
                        <div className="rounded-circle bg-danger-subtle d-inline-flex align-items-center justify-content-center p-3 mx-auto">
                            <svg className="text-danger" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#dc2626' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 fs-5 fw-medium text-dark">Bir hata oluştu</h3>
                        <p className="mt-2 fs-sm text-muted">
                            Uygulamada beklenmedik bir hata oluştu. Lütfen sayfayı yeniden yükleyin veya daha sonra tekrar deneyin.
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-primary"
                            >
                                Sayfayı Yenile
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}