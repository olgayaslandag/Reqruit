import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Header() {
    const { url } = usePage();
    const { auth, canLogin, canRegister } = usePage().props;
    const user = auth?.user;

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('nav-sticky');
                } else {
                    navbar.classList.remove('nav-sticky');
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-white navbar-custom sticky" id="navbar">
            <div className="container">
                <a className="navbar-brand text-uppercase" href="#home">
                    <img src="/assets/images/kasy/logo-dark.png" alt="Reqruit" height="25" />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                    aria-controls="navbarCollapse"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="mdi mdi-menu"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav mx-auto" id="navbar-navlist">
                        <li className="nav-item">
                            <a className="nav-link active" href="#home">Ana Sayfa</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#features">Özellikler</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#about">Hakkımızda</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#pricing">Fiyatlandırma</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#contact">İletişim</a>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <div className="me-5 flex-shrink-0 d-none d-lg-block">
                            {user ? (
                                <a href={route('dashboard')} className="btn nav-btn">
                                    Panele Git
                                </a>
                            ) : (
                                <a href={canLogin ? route('login') : '#contact'} className="btn nav-btn">
                                    Giriş Yap
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
