import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

export default function Welcome() {
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    useEffect(() => {
        document.body.classList.add('landing-page');
        return () => document.body.classList.remove('landing-page');
    }, []);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setVideoModalOpen(false);
        };
        if (videoModalOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [videoModalOpen]);

    return (
        <>
            <Head title="Reqruit - İnsan Kaynakları Yönetim Platformu" />

            <Header />

            {/* Start Home */}
            <section className="section home" id="home">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mt-5 pt-lg-5 text-center">
                                <h3>İnsan Kaynakları Yönetiminde Tek Platform</h3>
                                <p className="text-muted fs-18 mb-0">
                                    İşe alımdan bordroya, PDKS'den izin yönetimine kadar tüm İK süreçlerinizi
                                    tek çatı altında yönetin.
                                </p>
                                <div className="row justify-content-center mt-5">
                                    <div className="col-lg-12 hstack gap-3 justify-content-center">
                                        <div className="d-grid d-sm-block gap-3">
                                            <a href={route('login')} className="btn btn-primary">
                                                Ücretsiz Demo
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                className="btn btn-primary"
                                                onClick={() => setVideoModalOpen(true)}
                                            >
                                                <i className="mdi mdi-play play-icon-circle play play-icon f-30 me-2"></i>
                                                Video İzle
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {videoModalOpen && (
                                    <div
                                        className="modal fade show d-block"
                                        tabIndex="-1"
                                        aria-hidden="true"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                                        onClick={() => setVideoModalOpen(false)}
                                    >
                                        <div className="modal-dialog modal-dialog-centered modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                                            <div className="modal-content home-modal">
                                                <div className="modal-header border-0">
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white"
                                                        onClick={() => setVideoModalOpen(false)}
                                                        aria-label="Close"
                                                    ></button>
                                                </div>
                                                <div className="ratio ratio-16x9">
                                                    <video id="VisaChipCardVideo" className="video-box" controls>
                                                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                                                    </video>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <img className="buy-about-img my-5 img-fluid" src="/assets/images/kasy/home-2.png" alt="" />
                                <div className="client-list">
                                    <div className="row justify-content-around mt-4">
                                        <div className="col-md-2 col-6">
                                            <img className="img-fluid" src="/assets/images/kasy/logo/brand-logo-1.png" alt="" />
                                        </div>
                                        <div className="col-md-2 col-6">
                                            <img className="img-fluid" src="/assets/images/kasy/logo/brand-logo-2.png" alt="" />
                                        </div>
                                        <div className="col-md-2 col-6">
                                            <img className="img-fluid" src="/assets/images/kasy/logo/brand-logo-3.png" alt="" />
                                        </div>
                                        <div className="col-md-2 col-6">
                                            <img className="img-fluid" src="/assets/images/kasy/logo/brand-logo-4.png" alt="" />
                                        </div>
                                        <div className="col-md-2 col-6">
                                            <img className="img-fluid" src="/assets/images/kasy/logo/brand-logo-2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="home-shape-arrow">
                            <a href="#features" className="mouse-down">
                                <i className="mdi mdi-arrow-down arrow-icon text-dark h5"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Home */}

            {/* Start Features */}
            <section className="section features features-bg" id="features">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="text-center mb-5">
                                <h3 className="heading">Modüller</h3>
                                <p className="text-muted fs-17">
                                    İnsan kaynakları süreçlerinizi dijitalleştiren güçlü modüllerle tanışın.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="card features-card">
                                <div className="card-body">
                                    <div className="avatar-md mb-4">
                                        <div className="avatar-title bg-primary rounded-circle">
                                            <i className="mdi mdi-account-group"></i>
                                        </div>
                                    </div>
                                    <h5>İşe Alım</h5>
                                    <p className="text-muted">Sürükle-bırak form oluşturucu ile iş ilanlarınızı yayınlayın, AI destekli ön eleme ile adaylarınızı değerlendirin.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card features-card">
                                <div className="card-body">
                                    <div className="avatar-md mb-4">
                                        <div className="avatar-title bg-primary rounded-circle">
                                            <i className="mdi mdi-card-account-details"></i>
                                        </div>
                                    </div>
                                    <h5>Çalışan Yönetimi</h5>
                                    <p className="text-muted">Dijital personel dosyaları, belge yönetimi ve tüm çalışan bilgilerinizi tek platformda güvenle saklayın.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card features-card">
                                <div className="card-body">
                                    <div className="avatar-md mb-4">
                                        <div className="avatar-title bg-primary rounded-circle">
                                            <i className="mdi mdi-calendar-check"></i>
                                        </div>
                                    </div>
                                    <h5>İzin Yönetimi</h5>
                                    <p className="text-muted">Otomatik izin hesaplama, çoklu onay akışları ve takvim entegrasyonu ile izin süreçlerini kolayca yönetin.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card features-card">
                                <div className="card-body">
                                    <div className="avatar-md mb-4">
                                        <div className="avatar-title bg-primary rounded-circle">
                                            <i className="mdi mdi-cash-multiple"></i>
                                        </div>
                                    </div>
                                    <h5>Bordro ve Maaş</h5>
                                    <p className="text-muted">SGK, gelir vergisi, damga vergisi hesaplamalarını otomatik yapın, bordroları tek tıkla oluşturun.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card features-card">
                                <div className="card-body">
                                    <div className="avatar-md mb-4">
                                        <div className="avatar-title bg-primary rounded-circle">
                                            <i className="mdi mdi-qrcode-scan"></i>
                                        </div>
                                    </div>
                                    <h5>PDKS</h5>
                                    <p className="text-muted">QR kod ile giriş-çıkış, vardiya yönetimi ve fazla mesai takibi ile devam yönetimini dijitalleştirin.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card features-card">
                                <div className="card-body">
                                    <div className="avatar-md mb-4">
                                        <div className="avatar-title bg-primary rounded-circle">
                                            <i className="mdi mdi-wallet-outline"></i>
                                        </div>
                                    </div>
                                    <h5>Avans Yönetimi</h5>
                                    <p className="text-muted">Taksitli avans ödeme planları, otomatik kesinti hesaplama ve şeffaf avans takibi sağlayın.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Features */}

            {/* Start About */}
            <section className="section" id="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="text-center mb-lg-5">
                                <h3 className="heading">Neden Reqruit?</h3>
                                <p className="text-muted fs-17 mb-0">
                                    Teknoloji ve mevzuat bilgisini bir araya getirerek İK süreçlerinizi kolaylaştırıyoruz.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6">
                            <div className="card border-0">
                                <img src="/assets/images/kasy/about.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="about-title">
                                        <span></span>
                                        <h6 className="text-uppercase">Teknoloji Altyapısı</h6>
                                    </div>
                                    <h4>Modern ve Güçlü Platform</h4>
                                    <p className="text-muted lh-base">
                                        Laravel 12, React 18 ve Inertia.js ile geliştirilmiş güçlü altyapı.
                                        Türkiye mevzuatına tam uyumlu, güvenli ve hızlı çözüm.
                                    </p>
                                    <div className="about-link">
                                        <a href="javascript:void(0)">Daha Fazla <i className="mdi mdi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4 align-items-center justify-content-between">
                        <div className="col-lg-5">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="me-lg-5">
                                        <div className="about-title">
                                            <span></span>
                                            <h6 className="text-uppercase">Hakkımızda</h6>
                                        </div>
                                        <h4>İK Yönetiminde Uzman Kadro</h4>
                                        <p className="text-muted">
                                            Yıllardır İK süreçlerini dijitalleştiren uzman kadromuz, işletmenizin
                                            ihtiyaçlarına özel çözümler sunuyor. Verimliliğinizi artırın, maliyetlerinizi azaltın.
                                        </p>
                                        <div className="about-link">
                                            <a href="javascript:void(0)">İletişime Geç <i className="mdi mdi-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img src="/assets/images/kasy/about-2.png" className="img-fluid" alt="" />
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-between pt-lg-5">
                        <div className="col-lg-6">
                            <div className="buy-about-img">
                                <img src="/assets/images/kasy/about-3.png" className="img-fluid" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="ms-lg-5">
                                <div className="about-title">
                                    <span></span>
                                    <h6 className="text-uppercase">%100 Güvenli Platform</h6>
                                </div>
                                <h4>Çalışanlarınızı Kolayca Yönetin</h4>
                                <p className="text-muted">
                                    Tüm çalışan bilgilerinizi güvenli bir ortamda saklayın. Rol bazlı erişim kontrolü
                                    ile verilerinizi koruma altına alın.
                                </p>
                                <div className="about-link">
                                    <a href="javascript:void(0)">Keşfet <i className="mdi mdi-arrow-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End About */}

            {/* Start Counter */}
            <section className="bg-counter w-100" style={{ backgroundImage: 'url(/assets/images/kasy/counter-bg.png)' }}>
                <div className="bg-overlay"></div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="text-center">
                                <h3 className="heading">
                                    Tüm İK süreçlerinizi tek platformda yönetin
                                </h3>
                                <p className="text-muted">
                                    İş süreçlerinizi hızlandırın, verimliliğinizi artırın.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-lg-between justify-content-center">
                        <div className="col-lg-3 col-md-6">
                            <div className="mt-5 text-center">
                                <h1 className="fw-semibold display-6 mb-3">
                                    <span className="counter_value" data-target="6">0</span>
                                    <span>+</span>
                                </h1>
                                <p className="mb-0 fs-17 text-muted">Kapsamlı Modül</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="mt-5 text-center">
                                <h1 className="fw-semibold display-6 mb-3">
                                    <span className="counter_value" data-target="500">0</span>
                                    <span>+</span>
                                </h1>
                                <p className="mb-0 fs-17 text-muted">Mutlu Müşteri</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="mt-5 text-center">
                                <h1 className="fw-semibold display-6 mb-3">
                                    <span className="counter_value" data-target="99">0</span>
                                    <span>%</span>
                                </h1>
                                <p className="mb-0 fs-17 text-muted">Müşteri Memnuniyeti</p>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="d-flex justify-content-center">
                                <div className="mt-5">
                                    <a className="btn btn-outline-dark" href="javascript:void(0)">
                                        Keşfet <i className="mdi mdi-arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Counter */}

            {/* Start Pricing */}
            <section className="section pricing" id="pricing">
                <div className="bg-shape"></div>
                <div className="container">
                    <div className="row gy-5 justify-content-center">
                        <div className="col-lg-12">
                            <div className="text-center">
                                <h3 className="heading">İhtiyacınıza Uygun Planı Seçin</h3>
                                <p className="text-muted">14 günlük ücretsiz deneme imkanı</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <span className="pricing-bg"></span>
                            <div className="card pricing-box border-light h-100 py-5 mx-1">
                                <div className="pb-4 text-center border-bottom">
                                    <h6 className="text-info">Başlangıç</h6>
                                    <h1 className="mb-0 pt-2 fw-bold">₺999 <sub className="fs-14 fw-normal text-muted">/ay</sub></h1>
                                </div>
                                <div className="p-4 pb-0">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>Temel modüller</span>
                                                    <p className="text-muted fs-12 mb-0">İşe alım ve çalışan yönetimi</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>25 çalışana kadar</span>
                                                    <p className="text-muted fs-12 mb-0">Küçük ekipler için ideal</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>E-posta desteği</span>
                                                    <p className="text-muted fs-12 mb-0">7/24 e-posta ile destek</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mx-auto">
                                    <a href="javascript:void(0)" className="btn btn-outline-dark">Planı Seç</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card pricing-box border-light h-100 py-5 mx-1 active">
                                <div className="pb-4 text-center border-bottom">
                                    <h6 className="text-danger">Profesyonel</h6>
                                    <h1 className="mb-0 pt-2 fw-bold">₺1.999 <sub className="fs-14 fw-normal text-muted">/ay</sub></h1>
                                </div>
                                <div className="p-4 pb-0">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>Tüm modüller</span>
                                                    <p className="text-muted fs-12 mb-0">6 modülün tamamı</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>100 çalışana kadar</span>
                                                    <p className="text-muted fs-12 mb-0">Orta ölçekli şirketler</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>AI özellikler</span>
                                                    <p className="text-muted fs-12 mb-0">Akıllı değerlendirme</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mx-auto">
                                    <a href="javascript:void(0)" className="btn btn-outline-dark active">Planı Seç</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card pricing-box border-light h-100 py-5 mx-1">
                                <div className="pb-4 text-center border-bottom">
                                    <h6 className="text-primary">Kurumsal</h6>
                                    <h1 className="mb-0 pt-2 fw-bold">Özel <sub className="fs-14 fw-normal text-muted">/fiyat</sub></h1>
                                </div>
                                <div className="p-4 pb-0">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>Sınırsız çalışan</span>
                                                    <p className="text-muted fs-12 mb-0">Büyük organizasyonlar</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>Özel entegrasyonlar</span>
                                                    <p className="text-muted fs-12 mb-0">API ve webhook</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shring-0">
                                                    <i className="mdi mdi-circle-medium"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <span>Dedike destek ekibi</span>
                                                    <p className="text-muted fs-12 mb-0">Özel hesap yöneticisi</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mx-auto">
                                    <a href="javascript:void(0)" className="btn btn-outline-dark">Planı Seç</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Pricing */}

            {/* Start Testimonial */}
            <section className="section testimonial">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="text-center mb-5">
                                <h3 className="heading">Müşterilerimiz Ne Diyor?</h3>
                                <p className="text-muted fs-17">
                                    Reqruit'i kullanan İK profesyonellerinin deneyimlerini keşfedin.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-between">
                        <div className="col-lg-3">
                            <h4>Onları Dinleyin</h4>
                            <p className="fs-14 text-muted">
                                Doğrudan kullanıcılarımızdan dinleyin, deneyimlerini öğrenin.
                            </p>
                        </div>
                        <div className="col-lg-8">
                            <div id="carouselTestimonials" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-indicators mb-0">
                                    <button type="button" data-bs-target="#carouselTestimonials" data-bs-slide-to="0" className="" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselTestimonials" data-bs-slide-to="1" className="active" aria-current="true" aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#carouselTestimonials" data-bs-slide-to="2" className="" aria-label="Slide 3"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item">
                                        <div className="card testimonial-box h-100">
                                            <div className="card-body">
                                                <img className="mb-4" src="/assets/images/kasy/quote.png" alt="" />
                                                <p className="text-muted">
                                                    "Reqruit sayesinde İK süreçlerimizi %60 hızlandırdık. Özellikle bordro yönetimi ve PDKS modülleri hayat kurtarıcı."
                                                </p>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <img className="avatar-sm rounded-circle img-fluid" src="/assets/images/kasy/user/user1.png" alt="" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-0">Ayşe Yılmaz</h6>
                                                        <p className="text-muted mb-0 fs-14">İK Müdürü, TechCorp</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="carousel-item active">
                                        <div className="card testimonial-box h-100">
                                            <div className="card-body">
                                                <img className="mb-4" src="/assets/images/kasy/quote.png" alt="" />
                                                <p className="text-muted">
                                                    "Küçük bir ekiple büyürken Reqruit bize kurumsal İK deneyimi sundu. İşe alım sürecimiz artık çok daha verimli."
                                                </p>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <img className="avatar-sm rounded-circle img-fluid" src="/assets/images/kasy/user/user.png" alt="" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-0">Mehmet Kaya</h6>
                                                        <p className="text-muted mb-0 fs-14">Genel Müdür, StartupX</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="card testimonial-box h-100">
                                            <div className="card-body">
                                                <img className="mb-4" src="/assets/images/kasy/quote.png" alt="" />
                                                <p className="text-muted">
                                                    "AI destekli ön eleme özelliği ile doğru adaylara çok daha hızlı ulaşıyoruz. Kesinlikle tavsiye ediyorum."
                                                </p>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <img className="avatar-sm rounded-circle img-fluid" src="/assets/images/kasy/user/user2.png" alt="" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-0">Zeynep Demir</h6>
                                                        <p className="text-muted mb-0 fs-14">İK Uzmanı, GlobalTech</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Testimonial */}

            {/* Start Contact */}
            <section className="section" id="contact">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="text-center mb-5">
                                <h3 className="heading">Bize Ulaşın</h3>
                                <p className="text-muted mt-2">
                                    Sorularınız veya demo talepleriniz için bizimle iletişime geçin.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-around">
                        <div className="col-lg-6">
                            <form onSubmit={(e) => { e.preventDefault(); alert('Mesajınız alındı.'); }}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="position-relative mb-3">
                                            <span className="input-group-text">
                                                <i className="mdi mdi-account-outline"></i>
                                            </span>
                                            <input name="name" id="name" type="text" className="form-control" placeholder="Ad Soyad*" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="position-relative mb-3">
                                            <span className="input-group-text">
                                                <i className="mdi mdi-email-outline"></i>
                                            </span>
                                            <input name="email" id="email" type="email" className="form-control" placeholder="E-posta*" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="position-relative mb-3">
                                            <span className="input-group-text">
                                                <i className="mdi mdi-file-document-outline"></i>
                                            </span>
                                            <input name="subject" id="subject" type="text" className="form-control" placeholder="Konu" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="position-relative mb-3">
                                            <span className="input-group-text align-items-start">
                                                <i className="mdi mdi-comment-text-outline"></i>
                                            </span>
                                            <textarea name="comments" id="comments" rows="4" className="form-control" placeholder="Mesajınız*"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <input type="submit" id="submit" name="send" className="btn btn-primary" value="Mesaj Gönder" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-4">
                            <div className="contact-details mb-4 mb-lg-0">
                                <p className="mb-3">
                                    <i className="mdi mdi-email-outline align-middle text-muted fs-20 me-2"></i>
                                    <span className="fw-medium">info@reqruit.com</span>
                                </p>
                                <p className="mb-3">
                                    <i className="mdi mdi-web align-middle text-muted fs-20 me-2"></i>
                                    <span className="fw-medium">www.reqruit.com</span>
                                </p>
                                <p className="mb-3">
                                    <i className="mdi mdi-phone align-middle text-muted fs-20 me-2"></i>
                                    <span className="fw-medium">+90 (212) 555 0000</span>
                                </p>
                                <p className="mb-3">
                                    <i className="mdi mdi-hospital-building text-muted fs-20 me-2"></i>
                                    <span className="fw-medium">09:00 - 18:00</span>
                                </p>
                                <p className="mb-3">
                                    <i className="mdi mdi-map-marker-outline text-muted fs-20 me-2"></i>
                                    <span className="fw-medium">İstanbul, Türkiye</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Contact */}

            <Footer />
        </>
    );
}
