import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children, pageHeader }) {
    const user = usePage().props.auth.user;
    const appName = usePage().props.appName || 'Reqruit';
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentRoute = usePage().url;
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

    const isActive = (href) => currentRoute === href || currentRoute.startsWith(href + '?');

    const renderBreadcrumb = () => {
        // pageHeader.breadcrumbs varsa onu kullan
        if (pageHeader?.breadcrumbs && (pageHeader.breadcrumbs || []).length > 0) {
            return (pageHeader.breadcrumbs || []).map((crumb, index) => (
                <li key={index} className="breadcrumb-item">
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
                    >
                        <i className="ti ti-arrow-left"></i>
                        <span style={{ position: "relative", top: "-1.5px" }}>Geri</span>
                    </Link>
                )}

                {/* Excel Butonu */}
                {pageHeader.exportUrl && (
                    <Link
                        href={pageHeader.exportUrl}
                        className="btn btn-outline-success btn-sm me-2"
                        title="Excel İndir"
                    >
                        <i className="ti ti-download"></i>
                    </Link>
                )}

                {/* Filtre Butonu */}
                {pageHeader.filterCollapse && (
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-2"
                        data-bs-toggle="collapse"
                        data-bs-target="#filterCollapse"
                        aria-expanded="false"
                        style={{ marginTop: "2px" }}
                    >
                        <i className="ti ti-filter"></i>
                    </button>
                )}

                {/* Yeni Butonu */}
                {pageHeader.newUrl && (
                    <Link
                        href={pageHeader.newUrl}
                        className="btn btn-primary pt-2"
                    >
                        <i className="ti ti-plus"></i>
                        <span style={{ position: "relative", top: "-1.5px" }}>Yeni</span>
                    </Link>
                )}
            </div>
        );
    };

    // Header'ın string mi React element mi olduğunu kontrol et
    const isHeaderString = typeof header === 'string';
    const headerTitle = isHeaderString ? header : (pageHeader?.title || '');

    const menuGroups = [
        {
            title: 'Ana Sayfa',
            items: [
            { title: 'Dashboard', icon: 'dashboard', href: window.route('dashboard') },
            ],
        },
        {
            title: 'İnsan Kaynakları',
            items: [
            { title: 'Başvurular', icon: 'clipboard-list', href: window.route('admin.submissions.index') },
            { title: 'Formlar', icon: 'file-text', href: window.route('admin.forms.index') },
            { title: 'Departmanlar', icon: 'building', href: window.route('admin.departments.index') },
            { title: 'Çalışanlar', icon: 'users', href: window.route('admin.employees.index') },
            { title: 'Kullanıcılar', icon: 'users', href: window.route('admin.users.index') },
            ],
        },
        {
            title: 'Zaman Yönetimi',
            items: [
            { title: 'Devam Takibi', icon: 'clock', href: window.route('admin.attendance.index') },
            { title: 'QR Giriş/Çıkış', icon: 'qrcode', href: window.route('admin.attendance.scan') },
            { title: 'Vardiyalar', icon: 'clock', href: window.route('admin.shifts.index') },
            { title: 'Vardiya Takvimi', icon: 'calendar-event', href: window.route('admin.shifts.schedules') },
            { title: 'Düzeltme Talepleri', icon: 'edit', href: window.route('admin.adjustments.index') },
            { title: 'Çalışma Takvimleri', icon: 'calendar-event', href: window.route('admin.work-calendars.index') },
            { title: 'Resmi Tatiller', icon: 'confetti', href: window.route('admin.holidays.index') },
            ],
        },
        {
            title: 'İzin Yönetimi',
            items: [
            { title: 'İzin Talepleri', icon: 'calendar-event', href: window.route('admin.leave.requests.index') },
            { title: 'İzin Türleri', icon: 'tag', href: window.route('admin.leave.types.index') },
            { title: 'İzin Hakları', icon: 'clipboard-check', href: window.route('admin.leave.entitlements.index') },
            ],
        },
        {
            title: 'Bordro ve Maaş',
            items: [
            { title: 'Bordrolar', icon: 'cash-banknote', href: window.route('admin.payrolls.index') },
            { title: 'Maaş Bileşenleri', icon: 'calculator', href: window.route('admin.salary-components.index') },
            { title: 'Avans Talepleri', icon: 'hand-finger', href: window.route('admin.advances.index') },
            ],
        },
        {
            title: 'Raporlar',
            items: [
            { title: 'Bordro Raporları', icon: 'chart-bar', href: window.route('admin.payroll-reports.index') },
            { title: 'Yıllık Özet', icon: 'chart-dots', href: window.route('admin.payroll-reports.annual') },
            { title: 'Karşılaştırma', icon: 'arrows-left-right', href: window.route('admin.payroll-reports.compare') },
            { title: 'Devam Raporları', icon: 'file-analytics', href: window.route('admin.attendance-reports.index') },
            { title: 'Günlük Rapor', icon: 'journal', href: window.route('admin.attendance-reports.daily') },
            { title: 'Aylık Rapor', icon: 'calendar-stats', href: window.route('admin.attendance-reports.monthly') },
            { title: 'Fazla Mesai', icon: 'clock', href: window.route('admin.attendance-reports.overtime') },
            ],
        },
    ];

    return (
        <>
            <nav className={`pc-sidebar ${sidebarOpen ? '' : 'pc-sidebar-hide'}`}>
                <div className="navbar-wrapper">
                    <div className="m-header">
                        <Link href={window.route('dashboard')}>
                            <span style={{ fontSize: "1.3rem", fontWeight: "bold", textTransform: "uppercase" }}>
                                {appName}
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-content">
                        <ul className='pc-navbar'>
                            {menuGroups.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    <li className="pc-item pc-caption">
                                        {sidebarOpen && (
                                            <label>{group.title}</label>
                                        )}
                                    </li>
                                    {group.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="pc-item">
                                            <Link
                                                href={item.href}
                                                className={`pc-link${isActive(item.href) ? ' active' : ''}`}
                                                preserveScroll
                                            >
                                                <span className='pc-micon'>
                                                    <i className={`ti ti-${item.icon}`}></i>
                                                </span>
                                                {sidebarOpen && <span className='pc-mtext'>{item.title}</span>}
                                            </Link>
                                        </li>
                                    ))}
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            <header className='pc-header'>
                <div className="header-wrapper">
                    <div className="me-auto pc-mob-drp">
                        <ul className="list-unstyled">
                            <li className="pc-h-item pc-sidebar-collapse">
                                <a href="#" className="pc-head-link ms-0" id="sidebar-hide" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                    <i className="ti ti-menu-2"></i>
                                </a>
                            </li>
                            <li className="pc-h-item pc-sidebar-popup">
                                <a href="#" className="pc-head-link ms-0" id="mobile-collapse">
                                    <i className="ti ti-menu-2"></i>
                                </a>
                            </li>
                        </ul>
                    </div>


                    <div className="ms-auto">
                        <ul className="list-unstyled">
                            {/* Bildirimler */}
                            <li className="dropdown pc-h-item">

                                <a href='#!' className="pc-head-link dropdown-toggle arrow-none" data-bs-toggle="dropdown">
                                    <i className='ti ti-bell'></i>
                                    <span className="badge-dot"></span>
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
                                <a href='#!' className="pc-head-link dropdown-toggle arrow-none" data-bs-toggle="dropdown">
                                    <div className="user-avatar-sm">
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
                                            <button className="nav-link active" data-bs-toggle="tab">
                                                <i className="ti ti-user"></i> Hesap
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active">
                                                 <Link href={window.route('profile.edit')} className="dropdown-item">
                                                <i className="ti ti-user"></i>
                                                <span>Profil</span>
                                            </Link>
                                                 <Link href={window.route('logout')} method="post" className="dropdown-item">
                                                <i className="ti ti-logout"></i>
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
            <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {toasts.map((toast) => {
                    const colors = {
                        success: { bg: '#d1e7dd', border: '#0f5132', text: '#0f5132', icon: '✓' },
                        error: { bg: '#f8d7da', border: '#842029', text: '#842029', icon: '✕' },
                        warning: { bg: '#fff3cd', border: '#664d03', text: '#664d03', icon: '!' },
                        info: { bg: '#cff4fc', border: '#055160', text: '#055160', icon: 'i' },
                    };
                    const c = colors[toast.type] || colors.info;
                    return (
                        <div
                            key={toast.id}
                            onClick={() => removeToast(toast.id)}
                            style={{
                                background: c.bg,
                                borderLeft: `4px solid ${c.border}`,
                                color: c.text,
                                padding: '12px 16px',
                                borderRadius: 6,
                                fontSize: 14,
                                fontWeight: 500,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                cursor: 'pointer',
                                minWidth: 280,
                                maxWidth: 400,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                animation: 'slideIn 0.3s ease',
                            }}
                        >
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: c.border,
                                color: c.bg,
                                fontSize: 12,
                                fontWeight: 700,
                                flexShrink: 0,
                            }}>{c.icon}</span>
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
