import React, { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const currentRoute = usePage().url;

    const [openMenus, setOpenMenus] = useState({});

    // Menu group'ları - href'ler relative path olarak tanımlanıyor (usePage().url ile karşılaştırılabilir olması için)
    const menuGroups = useMemo(() => [
        {
            title: 'Ana Sayfa',
            icon: 'home',
            items: [
                { title: 'Dashboard', href: '/dashboard' },
            ],
        },
        {
            title: 'İnsan Kaynakları',
            icon: 'users',
            items: [
                { title: 'Başvurular', href: '/admin/submissions' },
                { title: 'Formlar', href: '/admin/forms' },
                { title: 'Departmanlar', href: '/admin/departments' },
                { title: 'Kalifiye Elemanlar', href: '/admin/candidates' },
                { title: 'Çalışanlar', href: '/admin/employees' },
            ],
        },
        {
            title: 'Zaman Yönetimi',
            icon: 'clock',
            items: [
                { title: 'Devam Takibi', href: '/admin/attendance' },
                { title: 'Vardiyalar', href: '/admin/shifts' },
                { title: 'Vardiya Takvimi', href: route('admin.shifts.schedules').replace(window.location.origin, '') },
                { title: 'Düzeltme Talepleri', href: '/admin/adjustments' },
                { title: 'Çalışma Takvimleri', href: '/admin/work-calendars' },
                { title: 'Resmi Tatiller', href: '/admin/holidays' },
            ],
        },
        {
            title: 'İzin Yönetimi',
            icon: 'calendar-event',
            items: [
                { title: 'İzin Talepleri', href: '/admin/leave/requests' },
                { title: 'İzin Türleri', href: '/admin/leave/types' },
                { title: 'İzin Hakları', href: '/admin/leave/entitlements' },
            ],
        },
        {
            title: 'Bordro ve Maaş',
            icon: 'cash-banknote',
            items: [
                { title: 'Bordrolar', href: '/admin/payrolls' },
                { title: 'Maaş Bileşenleri', href: '/admin/salary-components' },
                { title: 'Avans Talepleri', href: '/admin/advances' },
            ],
        },
        {
            title: 'Raporlar',
            icon: 'chart-bar',
            items: [
                { title: 'Bordro Raporları', href: '/admin/payroll-reports' },
                { title: 'Devam Raporları', href: '/admin/attendance-reports' },
            ],
        },
        {
            title: 'Kullanıcılar',
            icon: 'user',
            items: [
                { title: 'Kullanıcılar', href: '/admin/users' },
            ],
        },
    ], []);

    // isActive: currentRoute ile href'i karşılaştırır
    const isActive = (href) => currentRoute === href || currentRoute.startsWith(href + '?') || currentRoute.startsWith(href + '/');

    // İlk mount kontrolü için ref
    const isInitialized = React.useRef(false);

    // Aktif menüyü her renderda kontrol et ve güncelle
    useEffect(() => {
        const initialOpen = {};
        menuGroups.forEach((group) => {
            const hasActiveItem = group.items.some((item) => isActive(item.href));
            if (hasActiveItem) {
                initialOpen[group.title] = true;
            }
        });

        // Menü durumunu güncelle
        setOpenMenus(prev => ({ ...prev, ...initialOpen }));
    }, [currentRoute, menuGroups]);

    const toggleMenu = (title) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <nav className={`pc-sidebar ${sidebarOpen ? '' : 'pc-sidebar-hide'}`}>
            <div className="navbar-wrapper">
                <div className="m-header">
                    <Link href="/dashboard">
                        <img
                            src="/assets/images/reqruit-logo.png"
                            alt="Reqruit"
                            height="35"
                        />
                    </Link>
                </div>

                <div className="navbar-content">
                    <ul className='pc-navbar'>
                        {menuGroups.map((group) => {
                            const isOpen = openMenus[group.title] || false;
                            const isSingleItem = group.items.length === 1;
                            const shouldBeDropdown = !isSingleItem;

                            if (!shouldBeDropdown) {
                                // Render as single link (Dashboard)
                                const item = group.items[0];
                                return (
                                    <li key={group.title} className={`pc-item ${isActive(item.href) ? 'active' : ''}`}>
                                        <Link
                                            href={item.href}
                                            className="pc-link"
                                            preserveScroll
                                        >
                                            <span className='pc-micon' aria-hidden="true">
                                                <i className={`ti ti-${group.icon}`} aria-hidden="true"></i>
                                            </span>
                                            {sidebarOpen && <span className='pc-mtext'>{group.title}</span>}
                                        </Link>
                                    </li>
                                );
                            }

                            // Render as dropdown
                            return (
                                <li
                                    key={group.title}
                                    className={`pc-item pc-hasmenu ${isOpen ? 'pc-trigger' : ''}`}
                                >
                                    <a
                                        href="#!"
                                        className="pc-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleMenu(group.title);
                                        }}
                                        aria-expanded={isOpen}
                                    >
                                        <span className='pc-micon' aria-hidden="true">
                                            <i className={`ti ti-${group.icon}`} aria-hidden="true"></i>
                                        </span>
                                        {sidebarOpen && <span className='pc-mtext'>{group.title}</span>}
                                        {sidebarOpen && (
                                            <span className='pc-arrow'>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    style={{
                                                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                                        transition: 'transform 0.2s ease-in-out'
                                                    }}
                                                >
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </span>
                                        )}
                                    </a>
                                    <ul className="pc-submenu">
                                        {group.items.map((item) => (
                                            <li key={item.title} className={`pc-item ${isActive(item.href) ? 'active' : ''}`}>
                                                <Link
                                                    href={item.href}
                                                    className="pc-link"
                                                    preserveScroll
                                                    onClick={() => {
                                                        if (window.innerWidth < 992) {
                                                            setSidebarOpen(false);
                                                        }
                                                    }}
                                                >
                                                    {sidebarOpen && <span className='pc-mtext'>{item.title}</span>}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
