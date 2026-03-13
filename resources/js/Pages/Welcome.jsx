import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Reqruit - Başvuru Yönetim Sistemi" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="min-h-screen flex flex-col">
                    <header className="py-6 px-8">
                        <nav className="flex justify-between items-center max-w-7xl mx-auto">
                            <div className="text-2xl font-bold text-white">Reqruit</div>
                            <div className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition"
                                    >
                                        Panele Git
                                    </Link>
                ) : (
                    <Link
                        href={route('login')}
                        className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Giriş Yap
                    </Link>
                )}
                            </div>
                        </nav>
                    </header>

                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h1 className="text-5xl font-bold mb-6">
                                Başvuru Yönetim Sistemi
                            </h1>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Departmanlarınız için dinamik formlar oluşturun, 
                                başvuruları yönetin ve iş akışınızı hızlandırın.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link
                                    href={route('login')}
                                    className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
                                >
                                    Giriş Yap
                                </Link>
                                {auth.user && (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition text-lg"
                                    >
                                        Panel
                                    </Link>
                                )}
                            </div>
                        </div>
                    </main>

                    <footer className="py-6 text-center text-white/70">
                        <p>© 2026 Reqruit. Tüm hakları saklıdır.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
