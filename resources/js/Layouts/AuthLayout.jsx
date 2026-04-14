export default function AuthLayout({ children }) {
    return (
        <div className="auth-layout-wrapper d-flex flex-column min-vh-100">
            <main className="flex-grow-1">
                {children}
            </main>
            <footer className="auth-footer mt-auto py-3 bg-light">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 col-12 text-center text-md-left mb-2 mb-md-0">
                            <p className="mb-0">Telif Hakkı © <a href="#">Dinamik Dizayn</a></p>
                        </div>
                        <div className="col-md-6 col-12 text-center text-md-right">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item"><a href="#">Ana Sayfa</a></li>
                                <li className="list-inline-item"><a href="#">Gizlilik Politikası</a></li>
                                <li className="list-inline-item"><a href="#">Bize Ulaşın</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}