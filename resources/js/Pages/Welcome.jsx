import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Reqruit - İK Yönetim Platformu" />
            <div className="d-flex flex-column min-vh-100 bg-primary bg-gradient">
                {/* Header - Top */}
                <header className="py-3 px-4 border-bottom border-white border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center container">
                        <div>
                            <img
                                src="/assets/images/reqruit-logo-black.png"
                                alt="Reqruit"
                                height="50"
                            />
                        </div>
                        <div>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="btn btn-light btn-sm"
                                >
                                    Panele Git
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="btn btn-light btn-sm"
                                >
                                    Giriş Yap
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main - Center */}
                <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="text-center text-white px-4">
                        <h1 className="display-3 fw-bold mb-4">
                            İK Yönetim Platformu
                        </h1>
                        <p className="lead mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                            Çalışanlarınızı, devam takibini, izin süreçlerini, bordro ve
                            maaş yönetimini ve işe alım formlarını tek platformda yönetin,
                            iş akışınızı hızlandırın.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Link
                                href={route('login')}
                                className="btn btn-light btn-lg"
                            >
                                Giriş Yap
                            </Link>
                            {auth.user && (
                                <Link
                                    href={route('dashboard')}
                                    className="btn btn-outline-light btn-lg"
                                >
                                    Panel
                                </Link>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer - Bottom */}
                <footer className="py-3 text-center text-white-50 border-top border-white border-opacity-25">
                    <p className="mb-0">© 2026 Reqruit. Tüm hakları saklıdır.</p>
                </footer>
            </div>
        </>
    );
}
