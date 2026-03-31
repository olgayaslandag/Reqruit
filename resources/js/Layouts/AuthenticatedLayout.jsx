import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const appName = usePage().props.appName || 'Reqruit';
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentRoute = usePage().url;

    const isActive = (href) => currentRoute === href || currentRoute.startsWith(href + '?');

    const menuGroups = [
        {
            title: 'Ana Sayfa',
            items: [
            { title: 'Dashboard', icon: 'ti ti-dashboard', href: route('dashboard') },
            ],
        },
        {
            title: 'İnsan Kaynakları',
            items: [
            { title: 'Başvurular', icon: 'ti ti-clipboard-list', href: route('admin.submissions.index') },
            { title: 'Formlar', icon: 'ti ti-file-text', href: route('admin.forms.index') },
            { title: 'Departmanlar', icon: 'ti ti-building', href: route('admin.departments.index') },
            { title: 'Çalışanlar', icon: 'ti ti-users', href: route('admin.employees.index') },
            { title: 'Kullanıcılar', icon: 'ti ti-user-cog', href: route('admin.users.index') },
            ],
        },
        {
            title: 'Zaman Yönetimi',
            items: [
            { title: 'Devam Takibi', icon: 'ti ti-clock-check', href: route('admin.attendance.index') },
            { title: 'QR Giriş/Çıkış', icon: 'ti ti-qrcode', href: route('admin.attendance.scan') },
            { title: 'Vardiyalar', icon: 'ti ti-clock-hour-3', href: route('admin.shifts.index') },
            { title: 'Vardiya Takvimi', icon: 'ti ti-calendar-week', href: route('admin.shifts.schedules') },
            { title: 'Düzeltme Talepleri', icon: 'ti ti-edit', href: route('admin.adjustments.index') },
            { title: 'Çalışma Takvimleri', icon: 'ti ti-calendar-event', href: route('admin.work-calendars.index') },
            { title: 'Resmi Tatiller', icon: 'ti ti-confetti', href: route('admin.holidays.index') },
            ],
        },
        {
            title: 'İzin Yönetimi',
            items: [
            { title: 'İzin Talepleri', icon: 'ti ti-calendar-check', href: route('admin.leave.requests.index') },
            { title: 'İzin Türleri', icon: 'ti ti-tags', href: route('admin.leave.types.index') },
            { title: 'İzin Hakları', icon: 'ti ti-list-check', href: route('admin.leave.entitlements.index') },
            ],
        },
        {
            title: 'Bordro ve Maaş',
            items: [
            { title: 'Bordrolar', icon: 'ti ti-cash-banknote', href: route('admin.payrolls.index') },
            { title: 'Maaş Bileşenleri', icon: 'ti ti-calculator', href: route('admin.salary-components.index') },
            { title: 'Avans Talepleri', icon: 'ti ti-hand-click', href: route('admin.advances.index') },
            ],
        },
        {
            title: 'Raporlar',
            items: [
            { title: 'Bordro Raporları', icon: 'ti ti-chart-bar', href: route('admin.payroll-reports.index') },
            { title: 'Yıllık Özet', icon: 'ti ti-chart-dots', href: route('admin.payroll-reports.annual') },
            { title: 'Karşılaştırma', icon: 'ti ti-arrows-diff', href: route('admin.payroll-reports.compare') },
            { title: 'Devam Raporları', icon: 'ti ti-file-analytics', href: route('admin.attendance-reports.index') },
            { title: 'Günlük Rapor', icon: 'ti ti-journal', href: route('admin.attendance-reports.daily') },
            { title: 'Aylık Rapor', icon: 'ti ti-calendar-stats', href: route('admin.attendance-reports.monthly') },
            { title: 'Fazla Mesai', icon: 'ti ti-hourglass', href: route('admin.attendance-reports.overtime') },
            ],
        },
        ];

    return (
        <>
            <nav className={`pc-sidebar ${sidebarOpen ? '' : 'pc-sidebar-hide'}`}>
                <div className="navbar-wrapper">
                    <div className="m-header">
                        <Link href={route('dashboard')}>
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
                                            >
                                                <span className='pc-micon'>
                                                    <i className={`bi ${item.icon}`}></i>
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
                                                <i className="bi bi-person"></i> Hesap
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active">
                                            <Link href={route('profile.edit')} className="dropdown-item">
                                                <i className="bi bi-person"></i>
                                                <span>Profil</span>
                                            </Link>
                                            <Link href={route('logout')} method="post" className="dropdown-item">
                                                <i className="bi bi-box-arrow-right"></i>
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
                    {header && (
                        <div className="page-header mb-4">
                            <h4 className="page-title mb-1">{header}</h4>
                        </div>
                    )}

                    {children}
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="container-fluid text-center">
                    <p className="mb-0 text-muted small">
                        Copyright © {new Date().getFullYear()} {appName}. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
        </>
    );
}
