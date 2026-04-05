import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({ header, children, pageHeader }) {
    const user = usePage().props.auth.user;
    const appName = usePage().props.appName || 'Reqruit';
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    useEffect(() => {
        const handleToast = (e) => {
            const { message, type } = e.detail;
            const id = ++toastIdRef.current;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 3000);
        };
        window.addEventListener('toast:show', handleToast);
        return () => window.removeEventListener('toast:show', handleToast);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const renderBreadcrumb = () => {
        // pageHeader.breadcrumbs varsa onu kullan
        if (pageHeader?.breadcrumbs && (pageHeader.breadcrumbs || []).length > 0) {
            return (pageHeader.breadcrumbs || []).map((crumb) => (
                <li key={crumb.label} className="breadcrumb-item">
                    {crumb.url && crumb.url !== '#' ? (
                        <Link href={crumb.url}>{crumb.label}</Link>
                    ) : (
                        <span aria-current="page">{crumb.label}</span>
                    )}
                </li>
            ));
        }

        // Yoksa header'dan türet
        const title = typeof header === 'string' ? header : (pageHeader?.title || 'Dashboard');
        return (
            <li className="breadcrumb-item active" aria-current="page">
                {title}
            </li>
        );
    };

    const renderPageHeaderActions = () => {
        if (!pageHeader) return null;

        return (
            <div className="col text-end">
                {/* Fiş Yükle - sadece route tanımlıysa */}
                {/* {pageHeader.uploadExpenseFile && hasRoute && (
                    <div className="d-inline">
                        <form
                            action={window.route('expense.upload')}
                            method="post"
                            className="d-inline"
                            encType="multipart/form-data"
                        >
                            <input type="hidden" name="direction" value="2" />
                            <label
                                htmlFor="image"
                                className="btn btn-outline-dark btn-sm me-2 mb-0"
                                title="Fiş Yükle"
                            >
                                <i className="ti ti-upload"></i>
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                className="d-none"
                                onChange={() => document.getElementById('image').closest('form').submit()}
                            />
                        </form>
                    </div>
                )} */}

                {/* Geri Butonu */}
                {pageHeader.backUrl && (
                                <Link
                                    href={pageHeader.backUrl}
                                    className="btn btn-light-secondary pt-2 me-2"
                                    aria-label="Geri"
                                >
                                    <i className="ti ti-arrow-left" aria-hidden="true"></i>
                                <span className="relative-neg-top-1px">Geri</span>
                            </Link>
                )}

                {/* Excel Butonu */}
                {pageHeader.exportUrl && (
                        <Link
                            href={pageHeader.exportUrl}
                            className="btn btn-outline-success btn-sm me-2"
                            title="Excel İndir"
                            aria-label="Excel İndir"
                        >
                            <i className="ti ti-download" aria-hidden="true"></i>
                        </Link>
                )}

                {/* Filtre Butonu */}
                {pageHeader.filterCollapse && (
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-2 margin-top-2px"
                        data-bs-toggle="collapse"
                        data-bs-target="#filterCollapse"
                        aria-expanded="false"
                        aria-label="Filtre panelini aç/kapat"
                    >
                        <i className="ti ti-filter" aria-hidden="true"></i>
                    </button>
                )}

                {/* Yeni Butonu */}
                {pageHeader.newUrl && (
                    <Link
                        href={pageHeader.newUrl}
                        className="btn btn-primary pt-2"
                        aria-label="Yeni oluştur"
                    >
                        <i className="ti ti-plus" aria-hidden="true"></i>
                                <span className="relative-neg-top-1px">Yeni</span>
                    </Link>
                )}
            </div>
        );
    };

    // Header'ın string mi React element mi olduğunu kontrol et
    const isHeaderString = typeof header === 'string';
    const headerTitle = isHeaderString ? header : (pageHeader?.title || '');

    return (
        <>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <header className='pc-header'>
                <div className="header-wrapper">
                    <div className="me-auto pc-mob-drp">
                        <ul className="list-unstyled">
                            <li className="pc-h-item pc-sidebar-collapse">
                                <a href="#" className="pc-head-link ms-0" id="sidebar-hide" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Kenar çubuğunu aç/kapat">
                                    <i className="ti ti-menu-2" aria-hidden="true"></i>
                                </a>
                            </li>
                            <li className="pc-h-item pc-sidebar-popup">
                                <a href="#" className="pc-head-link ms-0" id="mobile-collapse" aria-label="Mobil menüyü aç">
                                    <i className="ti ti-menu-2" aria-hidden="true"></i>
                                </a>
                            </li>
                        </ul>
                    </div>


                    <div className="ms-auto">
                        <ul className="list-unstyled">
                            {/* Bildirimler */}
                            <li className="dropdown pc-h-item">

                                <a href='#!' className="pc-head-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" aria-label="Bildirimler">
                                    <i className='ti ti-bell' aria-hidden="true"></i>
                                    <span className="badge-dot" aria-hidden="true"></span>
                                </a>
                                <div className="dropdown-menu dropdown-notification dropdown-menu-end">
                                    <div className="dropdown-header d-flex align-items-center justify-content-between">
                                        <h5 className="m-0">Bildirimler</h5>
                                        <a href="#" className="text-primary">Tümünü Gör</a>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <div className="p-3 text-center text-muted">
                                        Yeni bildirim yok
                                    </div>
                                </div>
                            </li>

                            {/* Kullanıcı Profili */}
                            <li className="pc-h-item header-user-profile">
                                <a href='#!' className="pc-head-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" aria-label="Kullanıcı profili">
                                    <div className="user-avatar-sm" aria-hidden="true">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span>{user?.name || 'User'}</span>
                                </a>
                                <div className="dropdown-menu dropdown-user-profile dropdown-menu-end">
                                    <div className="dropdown-header">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="user-avtar wid-35">
                                                    {user?.name?.charAt(0) || 'U'}
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1">{user?.name || 'User'}</h6>
                                                <span className="text-muted">Kullanıcı</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="nav drp-tabs nav-fill nav-tabs">
                                        <li className="nav-item">
                                            <button className="nav-link active" data-bs-toggle="tab" aria-label="Hesap sekmesi">
                                                <i className="ti ti-user" aria-hidden="true"></i> Hesap
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active">
                                                 <Link href={window.route('profile.edit')} className="dropdown-item" aria-label="Profili düzenle">
                                                <i className="ti ti-user" aria-hidden="true"></i>
                                                <span>Profil</span>
                                            </Link>
                                                 <Link href={window.route('logout')} method="post" className="dropdown-item" aria-label="Çıkış yap">
                                                <i className="ti ti-logout" aria-hidden="true"></i>
                                                <span>Çıkış Yap</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            <div className="pc-container">
                <div className="pc-content">
                    {/* Blade'deki page-header yapısı */}
                    {(header || pageHeader) && (
                        <div className="page-header">
                            <div className="page-block">
                                <div className="row align-items-center">
                                    <div className="col-md-12">
                                        <ul className="breadcrumb">
                                            {renderBreadcrumb()}
                                        </ul>
                                    </div>

                                    <div className="col">
                                        <div className="page-header-title mt-1">
                                            <h2 className="mb-0 h4">
                                                {headerTitle}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="col text-end">
                                        {renderPageHeaderActions()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Eğer header bir React element ise onu render et (eski kullanım için) */}
                    {!isHeaderString && header && !pageHeader && header}

                    {children}
                </div>
                {/* Footer */}
            <footer className="footer pb-3">
                <div className="container-fluid text-center">
                    <p className="mb-0 text-muted small">
                        Copyright © {new Date().getFullYear()} {appName}. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
            </div>



            {/* Toast Container */}
            <div className="fixed-toast-container">
                {toasts.map((toast) => {
                    const bgClass = {
                        success: 'toast-item-bg-success toast-icon-bg-success',
                        error: 'toast-item-bg-error toast-icon-bg-error',
                        warning: 'toast-item-bg-warning toast-icon-bg-warning', 
                        info: 'toast-item-bg-info toast-icon-bg-info'
                    };
                    const toastClass = `toast-item-container ${bgClass[toast.type] || bgClass.info.split(' ')[0]}`;
                    return (
                        <div
                            key={toast.id}
                            onClick={() => removeToast(toast.id)}
                            className={toastClass}
                        >
                            <span className={`toast-icon ${bgClass[toast.type]?.split(' ')[1] || bgClass.info.split(' ')[1]}`}>
                                {toast.type === 'success' && '✓'}
                                {toast.type === 'error' && '✕'}
                                {toast.type === 'warning' && '!'}
                                {toast.type === 'info' && 'i'}
                                {!['success', 'error', 'warning', 'info'].includes(toast.type) && 'i'}
                            </span>
                            {toast.message}
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </>
    );
}
