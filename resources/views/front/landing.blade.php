<!DOCTYPE html>
<html lang="tr">
    <head>
        <meta charset="utf-8" />
        <title>Reqruit - İnsan Kaynakları Yönetim Platformu</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Reqruit - İşe alımdan bordroya, PDKS'den izin yönetimine kadar tüm İK süreçlerinizi tek çatı altında yönetin." />
        <meta name="keywords" content="İK yazılımı, insan kaynakları, hrms, personel devam kontrolü, bordro, izin yönetimi, maaş" />
        <meta name="author" content="Reqruit" />

        <link rel="shortcut icon" href="{{ asset('assets/images/reqruit-icon.png') }}">
        <!-- Bootstrap css -->
        <link rel="stylesheet" href="{{ asset('assets/css/kasy/bootstrap.min.css') }}" type="text/css" />

        <!-- slider -->
        <link rel="stylesheet" href="{{ asset('assets/css/kasy/swiper-bundle.min.css') }}" />

        <!-- Icon -->
        <link rel="stylesheet" href="{{ asset('assets/css/kasy/materialdesignicons.min.css') }}" type="text/css" />

        <!-- CSS -->
        <link rel="stylesheet" href="{{ asset('assets/css/kasy/style.min.css') }}" type="text/css" />

        <!-- AOS -->
        <link rel="stylesheet" href="{{ asset('assets/css/kasy/aos.css') }}" type="text/css" />

    </head>
    <body data-bs-spy="scroll" data-bs-target="#navbar" data-bs-offset="71">

        <!-- Start Navbar -->
        <nav class="navbar navbar-expand-lg fixed-top navbar-white navbar-custom sticky" id="navbar">
            <div class="container">
    
                <!-- LOGO -->
                <a class="navbar-brand text-uppercase" href="#home">
                    <img src="{{ asset('assets/images/reqruit-logo.png') }}" alt="Reqruit" height="35">
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="mdi mdi-menu"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav mx-auto" id="navbar-navlist">
                        <li class="nav-item">
                            <a class="nav-link active" href="#home">Ana Sayfa</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#features">Özellikler</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#about">Hakkımızda</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#faq">SSS</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#contact">İletişim</a>
                        </li>
                    </ul>
                    <div class="d-flex align-items-center">
                    <div class="me-5 flex-shrink-0 d-none d-lg-block">
                        <a class="btn nav-btn" href="{{ route('login') }}">
                            Giriş Yap
                        </a>
                    </div>
                </div>
                </div>
            </div><!-- End container -->
        </nav>
        <!-- End Navbar -->
        
        <!-- Start Home -->
        <section class="section home" id="home">
            <div class="container">
                <div class="row">   
                    <div class="col-lg-12">
                        <div class="mt-5 pt-lg-5 text-center">
                                <h3 data-aos="fade-up">İnsan Kaynakları Yönetiminde Tek Platform</h3>
                            <p class="text-muted fs-18 mb-0" data-aos="fade-up" data-aos-delay="150">İşe alımdan bordroya, PDKS'den izin yönetimine kadar tüm İK süreçlerinizi
                                tek çatı altında yönetin.</p>
                        <div class="row justify-content-center mt-5" data-aos="fade-up" data-aos-delay="300">
                            <div class="col-lg-12 hstack gap-3 justify-content-center">
                                <div class="d-grid d-sm-block gap-3">
                                    <a href="javascript:void(0);" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#demoModal" data-aos="zoom-in" data-aos-delay="400">Ücretsiz Demo</a>
                                </div>
                                </div>
                                <!-- END MODAL -->
                            </div><!-- END col -->
                        </div><!-- END row -->
                        <img class="buy-about-img my-5 img-fluid" src="{{ asset('assets/images/reqruit-screen.jpg') }}" alt="Reqruit Dashboard" data-aos="zoom-in" data-aos-delay="500">
                        </div>
                    </div><!-- end col-->
                </div><!-- end row-->
            </div><!-- end container-->
            <div class="container-fluid">
                <div class="row">
                    <div class="home-shape-arrow">
                        <a href="#features" class="mouse-down"><i class="mdi mdi-arrow-down arrow-icon text-dark h5"></i></a>
                    </div>
                </div><!--end row-->
            </div><!--end container-->
        </section>
        <!-- End Home -->

        <!-- Start features -->
        <section class="section features features-bg" id="features">
            <div class="container">
                <div class="row justify-content-center" data-aos="fade-up">
                    <div class="col-lg-7">
                        <div class="text-center mb-5">
                            <h3 class="heading">Modüller</h3>
                            <p class="text-muted fs-17">İnsan kaynakları süreçlerinizi dijitalleştiren güçlü modüllerle tanışın.</p>
                        </div>
                    </div><!-- end col-->
                </div><!-- end row-->
                <div class="row">
                    <div class="col-lg-4 col-md-6" data-aos="fade-right" data-aos-delay="100">
                        <div class="card features-card border-primary">
                            <div class="card-body">
                                <div class="avatar-md mb-4">
                                    <div class="avatar-title bg-primary rounded-circle">
                                        <i class="mdi mdi-account-group"></i>
                                    </div>
                                </div>
                                <h5>İşe Alım <span class="badge bg-primary text-white ms-2">AI Destekli</span></h5>
                                <p class="text-muted">Sürükle-bırak form oluşturucu ile iş ilanlarınızı yayınlayın. <strong>Yapay zeka destekli değerlendirme</strong> ile başvuruları otomatik analiz edin, AI yorumları ve puanlamasıyla adaylarınızı hızla değerlendirin.</p>
                            </div>
                        </div>
                    </div><!-- end col -->
                    <div class="col-lg-4 col-md-6" data-aos="fade-right" data-aos-delay="200">
                        <div class="card features-card">
                            <div class="card-body">
                                <div class="avatar-md mb-4">
                                    <div class="avatar-title bg-primary rounded-circle">
                                        <i class="mdi mdi-card-account-details"></i>
                                    </div>
                                </div>
                                <h5>Çalışan Yönetimi</h5>
                                <p class="text-muted">Dijital personel dosyaları, belge yönetimi ve tüm çalışan bilgilerinizi tek platformda güvenle saklayın.</p>
                            </div>
                        </div>
                    </div><!-- end col -->
                    <div class="col-lg-4 col-md-6" data-aos="fade-right" data-aos-delay="300">
                        <div class="card features-card">
                            <div class="card-body">
                                <div class="avatar-md mb-4">
                                    <div class="avatar-title bg-primary rounded-circle">
                                        <i class="mdi mdi-calendar-check"></i>
                                    </div>
                                </div>
                                <h5>İzin Yönetimi</h5>
                                <p class="text-muted">Otomatik izin hesaplama, çoklu onay akışları ve takvim entegrasyonu ile izin süreçlerinizi kolayca yönetin.</p>
                            </div>
                        </div>
                    </div><!-- end col -->
                    <div class="col-lg-4 col-md-6" data-aos="fade-left" data-aos-delay="100">
                        <div class="card features-card">
                            <div class="card-body">
                                <div class="avatar-md mb-4">
                                    <div class="avatar-title bg-primary rounded-circle">
                                        <i class="mdi mdi-cash-multiple"></i>
                                    </div>
                                </div>
                                <h5>Bordro ve Maaş</h5>
                                <p class="text-muted">SGK, gelir vergisi, damga vergisi hesaplamalarını otomatik yapın, bordroları tek tıkla oluşturun.</p>
                            </div>
                        </div>
                    </div><!-- end col -->
                    <div class="col-lg-4 col-md-6" data-aos="fade-left" data-aos-delay="200">
                        <div class="card features-card">
                            <div class="card-body">
                                <div class="avatar-md mb-4">
                                    <div class="avatar-title bg-primary rounded-circle">
                                        <i class="mdi mdi-qrcode-scan"></i>
                                    </div>
                                </div>
                                <h5>PDKS</h5>
                                <p class="text-muted">QR kod ile giriş-çıkış, vardiya yönetimi ve fazla mesai takibi ile devam yönetimini dijitalleştirin.</p>
                            </div>
                        </div>
                    </div><!-- end col -->
                    <div class="col-lg-4 col-md-6" data-aos="fade-left" data-aos-delay="300">
                        <div class="card features-card">
                            <div class="card-body">
                                <div class="avatar-md mb-4">
                                    <div class="avatar-title bg-primary rounded-circle">
                                        <i class="mdi mdi-wallet-outline"></i>
                                    </div>
                                </div>
                                <h5>Avans Yönetimi</h5>
                                <p class="text-muted">Taksitli avans ödeme planları, otomatik kesinti hesaplama ve şeffaf avans takibi sağlayın.</p>
                            </div>
                        </div>
                    </div><!-- end col -->
                </div><!-- end row -->
            </div><!-- end container -->
        </section>
        <!-- end Features -->

        <!-- Start AI Feature Highlight -->
        <section class="section" style="background: linear-gradient(135deg, #208df1 0%, #1a3365 100%);" data-aos="fade-up">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6" data-aos="fade-right" data-aos-duration="800">
                        <div class="text-white mb-4 mb-lg-0">
                            <div class="mb-3" data-aos="fade-down" data-aos-delay="100">
                                <span class="badge bg-light text-primary px-3 py-2 fs-14">
                                    <i class="mdi mdi-robot me-1"></i> Yapay Zeka Entegrasyonu
                                </span>
                            </div>
                            <h2 class="fw-bold mb-3" style="font-size: 2rem;" data-aos="fade-right" data-aos-delay="200">AI Destekli İşe Alım</h2>
                            <p class="mb-4" style="font-size: 1.1rem; opacity: 0.9;" data-aos="fade-right" data-aos-delay="300">
                                Başvurularınızı yapay zeka ile değerlendirin. Her başvuru için otomatik <strong>AI yorumu</strong> ve 
                                <strong>puanlama</strong> ile adaylarınızı hızla karşılaştırın, doğru kararları verin.
                            </p>
                            <ul class="list-unstyled mb-4" data-aos="fade-right" data-aos-delay="400">
                                <li class="mb-2" data-aos="fade-right" data-aos-delay="450">
                                    <i class="mdi mdi-check-circle text-white me-2"></i>
                                    Otomatik CV analizi ve puanlama
                                </li>
                                <li class="mb-2" data-aos="fade-right" data-aos-delay="500">
                                    <i class="mdi mdi-check-circle text-white me-2"></i>
                                    Adaylar için AI destekli yorumlar
                                </li>
                                <li class="mb-2" data-aos="fade-right" data-aos-delay="550">
                                    <i class="mdi mdi-check-circle text-white me-2"></i>
                                    Pozisyon gereksinimlerine göre eşleştirme
                                </li>
                                <li class="mb-2" data-aos="fade-right" data-aos-delay="600">
                                    <i class="mdi mdi-check-circle text-white me-2"></i>
                                    Hızlı ve tutarlı değerlendirme süreci
                                </li>
                            </ul>
                            <a href="javascript:void(0);" class="btn btn-light btn-lg" data-bs-toggle="modal" data-bs-target="#demoModal" data-aos="zoom-in" data-aos-delay="700">
                                <i class="mdi mdi-rocket-launch me-2"></i>Hemen Başlayın
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200">
                        <div class="p-4">
                            <div class="bg-white rounded-4 p-5 shadow-lg" data-aos="zoom-in" data-aos-delay="300">
                                <div class="mb-4">
                                    <i class="mdi mdi-robot" style="font-size: 5rem; color: #208df1;"></i>
                                </div>
                                <h5 class="fw-bold text-dark mb-3">AI Değerlendirme Motoru</h5>
                                <div class="d-flex justify-content-center gap-3 mb-3">
                                    <div class="text-center" data-aos="zoom-in" data-aos-delay="400">
                                        <div class="display-6 fw-bold text-primary">95%</div>
                                        <small class="text-muted">Doğruluk</small>
                                    </div>
                                    <div class="text-center" data-aos="zoom-in" data-aos-delay="500">
                                        <div class="display-6 fw-bold text-primary">10x</div>
                                        <small class="text-muted">Hız Artışı</small>
                                    </div>
                                </div>
                                <p class="text-muted mb-0">Yapay zeka destekli değerlendirme ile işe alım sürecinizi hızlandırın.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- End AI Feature Highlight -->

        <!-- start about -->
        <section class="section" id="about" data-aos="fade-up">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-7">
                        <div class="text-center mb-lg-5" data-aos="fade-up">
                            <h3 class="heading">Neden Reqruit?</h3>
                        <p class="text-muted fs-17 mb-0">Teknoloji ve mevzuat bilgisini bir araya getirerek İK süreçlerinizi kolaylaştırıyoruz.</p>
                        </div>
                    </div><!--  end col  -->
                </div><!--  end row  -->
                <div class="row align-items-center justify-content-between" data-aos="fade-right" data-aos-delay="100">
                    <div class="col-lg-6" data-aos="zoom-in" data-aos-delay="200">
                        <div class="card border-0">
                            <img src="{{ asset('assets/images/reqruit-mockup.png') }}" alt="Reqruit Hakkında">
                        </div>
                    </div><!--  end col  -->
                    <div class="col-lg-5" data-aos="fade-left" data-aos-delay="300">
                        <div class="card border-0">
                            <div class="card-body">
                                <div class="about-title">
                                    <span></span>
                                    <h6 class="text-uppercase">Neden Biz?</h6>
                                </div>
                                <h4>Hızlı, Güvenilir, Kolay</h4>
                                <p class="text-muted lh-base">Bulut tabanlı altyapımız ile her yerden erişin. 7/24 kesintisiz hizmet,
                                    anlık veri senkronizasyonu ve üst düzey güvenlik standartları.</p>
                                <ul class="list-unstyled mt-3">
                                    <li class="mb-2" data-aos="fade-up" data-aos-delay="400"><i class="mdi mdi-check-circle text-primary me-2"></i>Bulut tabanlı - Her yerden erişim</li>
                                    <li class="mb-2" data-aos="fade-up" data-aos-delay="450"><i class="mdi mdi-check-circle text-primary me-2"></i>%99.9 uptime garantisi</li>
                                    <li class="mb-2" data-aos="fade-up" data-aos-delay="500"><i class="mdi mdi-check-circle text-primary me-2"></i>256-bit SSL şifreleme</li>
                                </ul>
                            </div>
                        </div>
                    </div><!--  end col  -->
                </div><!--  end row  -->
                <div class="row my-4 align-items-center justify-content-between" data-aos="fade-left" data-aos-delay="100">
                    <div class="col-lg-5" data-aos="fade-right" data-aos-delay="200">
                        <div class="card border-0">
                            <div class="card-body">
                                <div class="me-lg-5">
                                    <div class="about-title">
                                        <span></span>
                                        <h6 class="text-uppercase">Hakkımızda</h6>
                                    </div>
                                        <h4>İK Yönetiminde Uzman Kadro</h4>
                                        <p class="text-muted">Yıllardır İK süreçlerini dijitalleştiren uzman kadromuz, işletmenizin
                                            ihtiyaçlarına özel çözümler sunuyor. Verimliliğinizi artırın, maliyetlerinizi azaltın.</p>
                                            <div class="about-link">
                                                <a href="#contact">İletişime Geç <i class="mdi mdi-arrow-right"></i></a>
                                            </div>
                                </div>
                            </div><!-- End card-body -->
                        </div><!-- End card -->
                    </div><!--  end col  -->
                    <div class="col-lg-6" data-aos="zoom-in" data-aos-delay="300">
                        <img src="{{ asset('assets/images/hr-team-about.jpg') }}" class="img-fluid rounded-4 shadow" alt="İK Yönetimi">
                    </div><!--  end col  -->
                </div><!--  end row  -->
                <div class="row align-items-center justify-content-between pt-lg-5" data-aos="fade-right" data-aos-delay="100">
                    <div class="col-lg-6" data-aos="zoom-in" data-aos-delay="200">
                        <div class="buy-about-img">
                            <img src="{{ asset('assets/images/hr-dashboard.jpg') }}" class="img-fluid rounded-4 shadow" alt="Çalışan Yönetimi">
                        </div>
                    </div><!-- End col -->
                    <div class="col-lg-5" data-aos="fade-left" data-aos-delay="300">
                        <div class="ms-lg-5">
                            <div class="about-title">
                                <span></span>
                                <h6 class="text-uppercase">%100 Güvenli Platform</h6>
                            </div>
                            <h4>Çalışanlarınızı Kolayca Yönetin</h4>
                            <p class="text-muted">Tüm çalışan bilgilerinizi güvenli bir ortamda saklayın. Rol bazlı erişim kontrolü
                                ile verilerinizi koruma altına alın.</p>
                                <div class="about-link">
                                    <a href="#features">Keşfet <i class="mdi mdi-arrow-right"></i></a>
                                </div>
                        </div>
                    </div><!-- End col -->
                </div><!-- End row -->
            </div><!--  end container  -->
        </section>
        <!--  end about  -->

        <!-- start counter -->
        <section class="bg-counter w-100" style="background-image: url({{ asset('assets/images/kasy/counter-bg.png') }});">  
            <div class="bg-overlay"></div>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="text-center" data-aos="fade-up">
                            <h3 class="heading">Tüm İK süreçlerinizi tek platformda yönetin</h3>
                            <p class="text-muted">İş süreçlerinizi hızlandırın, verimliliğinizi artırın.</p>
                        </div>
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->
                <div class="row justify-content-lg-between justify-content-center">
                    <div class="col-lg-3 col-md-6">
                        <div class="mt-5 text-center" data-aos="zoom-in" data-aos-delay="100">
                            <h1 class="fw-semibold display-6 mb-3">
                                <span class="counter_value" data-target="6">0</span>
                                <span>+</span>
                            </h1>
                            <p class="mb-0 fs-17 text-muted">Kapsamlı Modül</p>
                        </div>
                    </div><!--end col-->
                    <div class="col-lg-3 col-md-6">
                        <div class="mt-5 text-center" data-aos="zoom-in" data-aos-delay="200">
                            <h1 class="fw-semibold display-6 mb-3">
                                <span class="counter_value" data-target="500">0</span>
                                <span>+</span>
                            </h1>
                            <p class="mb-0 fs-17 text-muted">Mutlu Müşteri</p>
                        </div>
                    </div><!--end col-->
                    <div class="col-lg-3 col-md-6">
                        <div class="mt-5 text-center" data-aos="zoom-in" data-aos-delay="300">
                            <h1 class="fw-semibold display-6 mb-3">
                                <span class="counter_value" data-target="99">0</span>
                                <span>%</span>
                            </h1>
                            <p class="mb-0 fs-17 text-muted">Müşteri Memnuniyeti</p>
                        </div>
                    </div><!--end col-->
                    <div class="col-lg-12">
                        <div class="d-flex justify-content-center">
                            <div class="mt-5" data-aos="fade-up" data-aos-delay="400">
                                <a class="btn btn-outline-dark" href="#features">Keşfet <i class="mdi mdi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div><!--end col-->
                </div><!--emd row-->
            </div><!--end container-->
        </section>
        <!-- end counter -->

        <!-- START FAQ -->
        <section class="section faq" id="faq" data-aos="fade-up">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="text-center mb-5" data-aos="fade-up">
                            <h3 class="heading">Sıkça Sorulan Sorular</h3>
                            <p class="text-muted fs-17">Reqruit hakkında merak edilenlerin yanıtları.</p>
                        </div>
                    </div><!-- End col -->
                </div><!-- End row -->
                <div class="row justify-content-center">
                    <div class="col-lg-9">
                        <div class="accordion" id="faqAccordion">
                            <div class="card border-0 mb-3 shadow-sm" data-aos="slide-down" data-aos-delay="100">
                                <div class="card-header bg-white border-0 p-0" id="faqHeading1">
                                    <button class="btn btn-link text-dark w-100 text-start p-4 fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse1" aria-expanded="false" aria-controls="faqCollapse1">
                                        Reqruit nedir ve kimler için uygundur?
                                        <i class="mdi mdi-chevron-down float-end"></i>
                                    </button>
                                </div>
                                <div id="faqCollapse1" class="collapse" aria-labelledby="faqHeading1" data-bs-parent="#faqAccordion">
                                    <div class="card-body pt-0 px-4 pb-4">
                                        <p class="text-muted mb-0">Reqruit; işe alım, çalışan yönetimi, PDKS, bordro ve daha fazlasını tek platformda sunan bir insan kaynakları yazılımıdır. Küçük ekiplerden büyük organizasyonlara kadar tüm şirketlere uygundur.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card border-0 mb-3 shadow-sm" data-aos="slide-down" data-aos-delay="200">
                                <div class="card-header bg-white border-0 p-0" id="faqHeading2">
                                    <button class="btn btn-link text-dark w-100 text-start p-4 fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse2" aria-expanded="false" aria-controls="faqCollapse2">
                                        Kurulum ve geçiş süreci nasıl işliyor?
                                        <i class="mdi mdi-chevron-down float-end"></i>
                                    </button>
                                </div>
                                <div id="faqCollapse2" class="collapse" aria-labelledby="faqHeading2" data-bs-parent="#faqAccordion">
                                    <div class="card-body pt-0 px-4 pb-4">
                                        <p class="text-muted mb-0">Uzman ekibimiz kurulum ve veri taşıma sürecinde size uçtan uca eşlik eder. Çoğu şirket birkaç gün içinde tüm süreçlerini Reqruit'e taşıyabilir.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card border-0 mb-3 shadow-sm" data-aos="slide-down" data-aos-delay="300">
                                <div class="card-header bg-white border-0 p-0" id="faqHeading3">
                                    <button class="btn btn-link text-dark w-100 text-start p-4 fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse3" aria-expanded="false" aria-controls="faqCollapse3">
                                        Verilerim güvende mi?
                                        <i class="mdi mdi-chevron-down float-end"></i>
                                    </button>
                                </div>
                                <div id="faqCollapse3" class="collapse" aria-labelledby="faqHeading3" data-bs-parent="#faqAccordion">
                                    <div class="card-body pt-0 px-4 pb-4">
                                        <p class="text-muted mb-0">Verileriniz uçtan uca şifrelenir ve KVKK uyumlu güvenli sunucularda saklanır. Rol bazlı yetkilendirme ile yalnızca yetkili kullanıcılar bilgilere erişebilir.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card border-0 mb-3 shadow-sm" data-aos="slide-down" data-aos-delay="400">
                                <div class="card-header bg-white border-0 p-0" id="faqHeading4">
                                    <button class="btn btn-link text-dark w-100 text-start p-4 fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse4" aria-expanded="false" aria-controls="faqCollapse4">
                                        Mevcut sistemlerimle entegre olabilir mi?
                                        <i class="mdi mdi-chevron-down float-end"></i>
                                    </button>
                                </div>
                                <div id="faqCollapse4" class="collapse" aria-labelledby="faqHeading4" data-bs-parent="#faqAccordion">
                                    <div class="card-body pt-0 px-4 pb-4">
                                        <p class="text-muted mb-0">Evet. Reqruit, API ve webhook desteği sayesinde muhasebe, ERP ve diğer iş yazılımlarınızla kolayca entegre olur. Kurumsal ihtiyaçlarınız için özel entegrasyonlar da sunuyoruz.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card border-0 mb-3 shadow-sm" data-aos="slide-down" data-aos-delay="500">
                                <div class="card-header bg-white border-0 p-0" id="faqHeading5">
                                    <button class="btn btn-link text-dark w-100 text-start p-4 fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse5" aria-expanded="false" aria-controls="faqCollapse5">
                                        Eğitim ve destek sağlıyor musunuz?
                                        <i class="mdi mdi-chevron-down float-end"></i>
                                    </button>
                                </div>
                                <div id="faqCollapse5" class="collapse" aria-labelledby="faqHeading5" data-bs-parent="#faqAccordion">
                                    <div class="card-body pt-0 px-4 pb-4">
                                        <p class="text-muted mb-0">Evet. Tüm kullanıcılarımıza başlangıç eğitimi, kapsamlı dokümantasyon ve 7/24 destek sunuyoruz. Kurumsal müşterilerimiz için ayrıca özel hesap yöneticisi atanır.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card border-0 mb-3 shadow-sm" data-aos="slide-down" data-aos-delay="600">
                                <div class="card-header bg-white border-0 p-0" id="faqHeading6">
                                    <button class="btn btn-link text-dark w-100 text-start p-4 fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse6" aria-expanded="false" aria-controls="faqCollapse6">
                                        Özel ihtiyaçlarım için ne yapabilirim?
                                        <i class="mdi mdi-chevron-down float-end"></i>
                                    </button>
                                </div>
                                <div id="faqCollapse6" class="collapse" aria-labelledby="faqHeading6" data-bs-parent="#faqAccordion">
                                    <div class="card-body pt-0 px-4 pb-4">
                                        <p class="text-muted mb-0">İhtiyacınıza özel modüller, raporlar ve entegrasyonlar için <a href="#contact" class="text-decoration-underline">iletişime geçebilirsiniz</a>. Ekibimiz sizin için en uygun çözümü birlikte planlar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><!-- End col -->
                </div><!-- End row -->
            </div><!-- End container -->
        </section>
        <!-- END FAQ -->

        <!-- testimonial -->
        <section class="section testimonial" data-aos="fade-up">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-7">
                        <div class="text-center mb-5" data-aos="fade-up">
                            <h3 class="heading">Müşterilerimiz Ne Diyor?</h3>
                        <p class="text-muted fs-17">Reqruit'i kullanan İK profesyonellerinin deneyimlerini keşfedin.</p>
                        </div>
                    </div><!-- End col -->
                </div><!-- End row -->
                <div class="row justify-content-between" data-aos="fade-up" data-aos-delay="200">
                    <div class="col-lg-3">
                        <h4 data-aos="fade-right">Onları Dinleyin</h4>
                        <p class="fs-14 text-muted" data-aos="fade-right" data-aos-delay="100">Doğrudan kullanıcılarımızdan dinleyin, deneyimlerini öğrenin.</p>
                        <button class="carousel-control-prev d-none d-lg-block" type="button" data-bs-target="#carouselTestimonials" data-bs-slide="prev" data-aos="fade-in" data-aos-delay="200">
                            <i class="mdi mdi-arrow-left"></i>
                        </button>
                        <button class="carousel-control-next d-none d-lg-block" type="button" data-bs-target="#carouselTestimonials" data-bs-slide="next" data-aos="fade-in" data-aos-delay="300">
                            <i class="mdi mdi-arrow-right"></i>
                        </button>
                    </div>
                    <div class="col-lg-8">
                        <div id="carouselTestimonials" class="carousel slide" data-bs-ride="carousel" data-aos="fade-up" data-aos-delay="200">
                            <div class="carousel-indicators mb-0" data-aos="fade-in">
                                <button type="button" data-bs-target="#carouselTestimonials" data-bs-slide-to="0" class="" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselTestimonials" data-bs-slide-to="1" class="active" aria-current="true" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselTestimonials" data-bs-slide-to="2" class="" aria-label="Slide 3"></button>
                            </div>

                            <div class="carousel-inner">
                                <div class="carousel-item">
                                    <div class="card testimonial-box h-100">
                                        <div class="card-body">
                                            <img class="mb-4" src="{{ asset('assets/images/kasy/quote.png') }}" alt="">
                                            <p class="text-muted">"Reqruit sayesinde İK süreçlerimizi %60 hızlandırdık. Özellikle bordro yönetimi ve PDKS modülleri hayat kurtarıcı."</p>
                                            <div class="d-flex align-items-center">
                                                <div class="flex-shrink-0">
                                                    <img class="avatar-sm rounded-circle img-fluid" src="{{ asset('assets/images/kasy/user/user1.png') }}" alt="">
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-0">Ayşe Yılmaz</h6>
                                                    <p class="text-muted mb-0 fs-14">İK Müdürü, TechCorp</p>
                                                </div>
                                            </div>
                                        </div><!-- End card-body -->
                                    </div><!-- End card -->
                                </div>
                                
                                <div class="carousel-item active">
                                    <div class="card testimonial-box h-100">
                                        <div class="card-body">
                                            <img class="mb-4" src="{{ asset('assets/images/kasy/quote.png') }}" alt="">
                                            <p class="text-muted">"Küçük bir ekiple büyürken Reqruit bize kurumsal İK deneyimi sundu. İşe alım sürecimiz artık çok daha verimli."</p>
                                            <div class="d-flex align-items-center">
                                                <div class="flex-shrink-0">
                                                    <img class="avatar-sm rounded-circle img-fluid" src="{{ asset('assets/images/kasy/user/user.png') }}" alt="">
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-0">Mehmet Kaya</h6>
                                                    <p class="text-muted mb-0 fs-14">Genel Müdür, StartupX</p>
                                                </div>
                                            </div>
                                        </div><!-- End card-body -->
                                    </div><!-- End card -->
                                </div>
                                
                                <div class="carousel-item">
                                    <div class="card testimonial-box h-100">
                                        <div class="card-body">
                                            <img class="mb-4" src="{{ asset('assets/images/kasy/quote.png') }}" alt="">
                                            <p class="text-muted">"AI destekli ön eleme özelliği ile doğru adaylara çok daha hızlı ulaşıyoruz. Kesinlikle tavsiye ediyorum."</p>
                                            <div class="d-flex align-items-center">
                                                <div class="flex-shrink-0">
                                                    <img class="avatar-sm rounded-circle img-fluid" src="{{ asset('assets/images/kasy/user/user2.png') }}" alt="">
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-0">Zeynep Demir</h6>
                                                    <p class="text-muted mb-0 fs-14">İK Uzmanı, GlobalTech</p>
                                                </div>
                                            </div>
                                        </div><!-- End card-body -->
                                    </div><!-- End card -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div><!-- End container -->
        </section>
        <!-- testimonial -->

        <!-- Start contact -->
        <section class="section" id="contact" data-aos="fade-up">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-6">
                        <div class="text-center mb-5" data-aos="zoom-in">
                            <h3 class="heading">Bize Ulaşın</h3>
                            <p class="text-muted mt-2">Sorularınız veya demo talepleriniz için bizimle iletişime geçin.</p>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-around">
                    <div class="col-lg-6" data-aos="slide-right" data-aos-delay="200">
                        <form method="post" action="{{ route('contact.submit') }}">
                            @csrf
                            <span id="error-msg"></span>
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="position-relative mb-3" data-aos="slide-up" data-aos-delay="300">
                                        <span class="input-group-text"><i class="mdi mdi-account-outline"></i></span>
                                        <input name="name" id="name" type="text" class="form-control" placeholder="Ad Soyad*">
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="position-relative mb-3" data-aos="slide-up" data-aos-delay="350">
                                        <span class="input-group-text"><i class="mdi mdi-email-outline"></i></span>
                                        <input name="email" id="email" type="email" class="form-control" placeholder="E-posta*">
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="position-relative mb-3" data-aos="slide-up" data-aos-delay="400">
                                        <span class="input-group-text"><i class="mdi mdi-file-document-outline"></i></span>
                                        <input name="subject" id="subject" type="text" class="form-control" placeholder="Konu">
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="position-relative mb-3" data-aos="slide-up" data-aos-delay="450">
                                    <span class="input-group-text align-items-start"><i class="mdi mdi-comment-text-outline"></i></span>
                                        <textarea name="comments" id="comments" rows="4" class="form-control" placeholder="Mesajınız*"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12" data-aos="zoom-in" data-aos-delay="500">
                                    <input type="submit" id="submit" name="send" class="btn btn-primary" value="Mesaj Gönder">
                                </div>
                            </div>
                        </form>
                        <!--end form-->
                    </div>
                    <div class="col-lg-4" data-aos="slide-left" data-aos-delay="300">
                        <div class="contact-details mb-4 mb-lg-0">
                            <p class="mb-3" data-aos="fade-up" data-aos-delay="350"><i class="mdi mdi-email-outline align-middle text-muted fs-20 me-2"></i> <span class="fw-medium">info@reqruit.com</span></p>
                            <p class="mb-3" data-aos="fade-up" data-aos-delay="400"><i class="mdi mdi-web align-middle text-muted fs-20 me-2"></i> <span class="fw-medium">www.reqruit.com</span></p>
                            <p class="mb-3" data-aos="fade-up" data-aos-delay="450"><i class="mdi mdi-phone align-middle text-muted fs-20 me-2"></i> <span class="fw-medium">+90 (212) 555 0000</span></p>
                            <p class="mb-3" data-aos="fade-up" data-aos-delay="500"><i class="mdi mdi-hospital-building text-muted fs-20 me-2"></i> <span class="fw-medium">09:00 - 18:00</span></p>
                            <p class="mb-3" data-aos="fade-up" data-aos-delay="550"><i class="mdi mdi-map-marker-outline text-muted fs-20 me-2"></i> <span class="fw-medium">İstanbul, Türkiye</span></p>
                        </div>
                        <!--end contact-details-->
                    </div>
                </div>
            </div>
        </section>
        <!-- End contact -->

        <!-- START FOOTER -->
        <footer class="section bg-footer" data-aos="fade-up">
            <div class="container">
                <div class="row g-sm-4">
                    <div class="col-lg-12" data-aos="zoom-in">
                        <div class="mb-3 mb-sm-0">
                            <img src="{{ asset('assets/images/kasy/logo-dark.png') }}" class="logo-dark" alt="Reqruit" height="22">
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-4 col-6" data-aos="fade-up" data-aos-delay="100">
                        <h6 class="text-uppercase fw-semibold">Hakkımızda</h6>
                        <ul class="list-unstyled footer-link mt-3 mb-0 fs-14">
                            <li><a href="#about">Hakkımızda</a></li>
                            <li><a href="#features">Özellikler</a></li>
                            <li><a href="#faq">SSS</a></li>
                            <li><a href="#contact">İletişim</a></li>
                        </ul>
                    </div><!-- End col -->

                    <div class="col-lg-3 col-md-4 col-6" data-aos="fade-up" data-aos-delay="200">
                        <h6 class="text-uppercase fw-semibold">Modüller</h6>
                        <ul class="list-unstyled footer-link mt-3 mb-0 fs-14">
                            <li><a href="#features">İşe Alım</a></li>
                            <li><a href="#features">Çalışan Yönetimi</a></li>
                            <li><a href="#features">İzin Yönetimi</a></li>
                            <li><a href="#features">Bordro ve Maaş</a></li>
                            <li><a href="#features">PDKS</a></li>
                            <li><a href="#features">Avans Yönetimi</a></li>
                        </ul>
                    </div><!-- End col -->

                    <div class="col-lg-3 col-md-4 col-6 d-none d-sm-block" data-aos="fade-up" data-aos-delay="300">
                        <h6 class="text-uppercase fw-semibold">Destek</h6>
                        <ul class="list-unstyled footer-link mt-3 mb-0 fs-14">
                            <li><a href="#contact">Yardım Merkezi</a></li>
                            <li><a href="#contact">Dökümantasyon</a></li>
                            <li><a href="#contact">API Referansı</a></li>
                            <li><a href="#contact">Sistem Durumu</a></li>
                        </ul>
                    </div><!-- End col -->
                    <div class="col-lg-3 col-10" data-aos="fade-up" data-aos-delay="400">
                        <h6 class="text-uppercase fw-semibold">Sosyal Medya
                            <span class="text-primary text-uppercase fs-18">Reqruit</span></h6>
                            <p class="mt-md-3 pt-3 pt-md-2 fs-14">Bizi takip edin, en güncel haberlerden haberdar olun.</p>
                        <div class="footer-subcribe text-end shadow-sm d-inline-block" data-aos="slide-up" data-aos-delay="450">
                            <form action="javascript:void(0)">
                                <input placeholder="E-posta Adresiniz" type="email">
                                <button type="submit" class="btn btn-primary"><i class="mdi mdi-bell-ring"></i></button>
                            </form>
                        </div>
                            <div class="mt-md-4 mt-3">
                                <ul class="list-inline footer-social mb-0">
                                    <li class="list-inline-item" data-aos="zoom-in" data-aos-delay="500">
                                        <a href="javascript:void(0)" class="rounded">
                                            <i class="mdi mdi-facebook text-dark"></i>
                                        </a>
                                    </li>

                                    <li class="list-inline-item" data-aos="zoom-in" data-aos-delay="550">
                                        <a href="javascript:void(0)" class="rounded">
                                            <i class="mdi mdi-linkedin text-dark"></i>
                                        </a>
                                    </li>

                                    <li class="list-inline-item" data-aos="zoom-in" data-aos-delay="600">
                                        <a href="javascript:void(0)" class="rounded">
                                            <i class="mdi mdi-pinterest text-dark"></i>
                                        </a>
                                    </li>

                                    <li class="list-inline-item" data-aos="zoom-in" data-aos-delay="650">
                                        <a href="javascript:void(0)" class="rounded">
                                            <i class="mdi mdi-twitter text-dark"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                    </div>
                </div><!-- End row -->
            </div><!-- End container -->
        </footer>
        <!-- END FOOTER -->

        <!-- FOOTER-ALT -->
        <div class="footer-alt pt-3 pb-3" data-aos="fade-up">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="text-center">
                            <p class="mb-0 text-white">&copy; {{ date('Y') }} Reqruit HRMS. Tüm hakları saklıdır.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END FOOTER-ALT -->

        <!--start back-to-top-->
        <button onclick="topFunction()" id="back-to-top">
            <i class="mdi mdi-arrow-up"></i>
        </button>
        <!--end back-to-top-->

        <!-- Demo Modal -->
        <div class="modal fade" id="demoModal" tabindex="-1" aria-labelledby="demoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0 pt-4">
                        <div class="modal-title">
                            <h5 class="fw-bold mb-1">Ücretsiz Demo Talebi</h5>
                            <p class="text-muted fs-14 mb-0">14 günlük ücretsiz denemeyle Reqruit'i keşfedin.</p>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        @if (session('success'))
                            <div class="alert alert-success text-center fs-14">{{ session('success') }}</div>
                        @endif
                        <form method="post" action="{{ route('demo.submit') }}">
                            @csrf
                            <div class="row">
                                <div class="col-12 mb-3">
                                    <div class="position-relative">
                                        <input name="name" type="text" class="form-control" placeholder="Ad Soyad*" required>
                                    </div>
                                </div>
                                <div class="col-12 mb-3">
                                    <div class="position-relative">
                                        <input name="email" type="email" class="form-control" placeholder="E-posta*" required>
                                    </div>
                                </div>
                                <div class="col-12 mb-3">
                                    <div class="position-relative">
                                        <input name="phone" type="tel" class="form-control" placeholder="Telefon">
                                    </div>
                                </div>
                                <div class="col-12 mb-3">
                                    <div class="position-relative">
                                        <input name="company" type="text" class="form-control" placeholder="Şirket Adı">
                                    </div>
                                </div>
                                <div class="col-12 mb-4">
                                    <div class="position-relative">
                                        <textarea name="comments" rows="3" class="form-control" placeholder="Mesajınız"></textarea>
                                    </div>
                                </div>
                                <div class="col-12 d-grid">
                                    <button type="submit" class="btn btn-primary">Demo Talebi Gönder</button>
                                </div>
                                <div class="col-12 mt-3 text-center">
                                    <p class="fs-14 text-muted mb-0">Zaten hesabınız var mı? <a href="{{ route('login') }}" class="text-primary fw-medium">Giriş Yapın</a></p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Demo Modal -->


        <!-- AOS JS -->
        <script src="{{ asset('assets/js/kasy/aos.js') }}"></script>

        <!--Custom js-->
        <script src="{{ asset('assets/js/kasy/counter.js') }}"></script>

        <script src="{{ asset('assets/js/kasy/swiper-bundle.min.js') }}"></script>

        <!--Bootstrap Js-->
        <script src="{{ asset('assets/js/kasy/bootstrap.bundle.min.js') }}"></script>

        <!-- App Js -->
        <script src="{{ asset('assets/js/kasy/app.js') }}"></script>

    </body>
</html>
