import { useEffect } from 'react';

export default function Footer() {
    useEffect(() => {
        const handleScroll = () => {
            const backToTop = document.getElementById('back-to-top');
            if (backToTop) {
                if (window.scrollY > 100) {
                    backToTop.style.display = 'block';
                } else {
                    backToTop.style.display = 'none';
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Footer */}
            <footer className="section bg-footer">
                <div className="container">
                    <div className="row g-sm-4">
                        <div className="col-lg-12">
                            <div className="mb-3 mb-sm-0">
                                <img src="/assets/images/kasy/logo-dark.png" className="logo-dark" alt="Reqruit" height="22" />
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-4 col-6">
                            <h6 className="text-uppercase fw-semibold">Hakkımızda</h6>
                            <ul className="list-unstyled footer-link mt-3 mb-0 fs-14">
                                <li><a href="#about">Hakkımızda</a></li>
                                <li><a href="#features">Özellikler</a></li>
                                <li><a href="#pricing">Fiyatlandırma</a></li>
                                <li><a href="#contact">İletişim</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-4 col-6">
                            <h6 className="text-uppercase fw-semibold">Modüller</h6>
                            <ul className="list-unstyled footer-link mt-3 mb-0 fs-14">
                                <li><a href="#features">İşe Alım</a></li>
                                <li><a href="#features">Çalışan Yönetimi</a></li>
                                <li><a href="#features">İzin Yönetimi</a></li>
                                <li><a href="#features">Bordro ve Maaş</a></li>
                                <li><a href="#features">PDKS</a></li>
                                <li><a href="#features">Avans Yönetimi</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-4 col-6 d-none d-sm-block">
                            <h6 className="text-uppercase fw-semibold">Destek</h6>
                            <ul className="list-unstyled footer-link mt-3 mb-0 fs-14">
                                <li><a href="#contact">Yardım Merkezi</a></li>
                                <li><a href="#contact">Dökümantasyon</a></li>
                                <li><a href="#contact">API Referansı</a></li>
                                <li><a href="#contact">Sistem Durumu</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-10">
                            <h6 className="text-uppercase fw-semibold">
                                Sosyal Medya{' '}
                                <span className="text-primary text-uppercase fs-18">Reqruit</span>
                            </h6>
                            <p className="mt-md-3 pt-3 pt-md-2 fs-14">
                                Bizi takip edin, en güncel haberlerden haberdar olun.
                            </p>
                            <div className="footer-subcribe text-end shadow-sm d-inline-block">
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <input placeholder="E-posta Adresiniz" type="email" />
                                    <button type="submit" className="btn btn-primary">
                                        <i className="mdi mdi-bell-ring"></i>
                                    </button>
                                </form>
                            </div>
                            <div className="mt-md-4 mt-3">
                                <ul className="list-inline footer-social mb-0">
                                    <li className="list-inline-item">
                                        <a href="javascript:void(0)" className="rounded">
                                            <i className="mdi mdi-facebook text-dark"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="javascript:void(0)" className="rounded">
                                            <i className="mdi mdi-linkedin text-dark"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="javascript:void(0)" className="rounded">
                                            <i className="mdi mdi-pinterest text-dark"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="javascript:void(0)" className="rounded">
                                            <i className="mdi mdi-twitter text-dark"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Footer Alt */}
            <div className="footer-alt pt-3 pb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center">
                                <p className="mb-0 text-white">
                                    &copy; 2026 Reqruit HRMS. Tüm hakları saklıdır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                id="back-to-top"
            >
                <i className="mdi mdi-arrow-up"></i>
            </button>
        </>
    );
}
