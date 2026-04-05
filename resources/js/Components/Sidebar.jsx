import React, { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const currentRoute = usePage().url;

    const [openMenus, setOpenMenus] = useState({});

    // isActive must be defined BEFORE menuGroups and useEffect (arrow functions don't hoist)
    const isActive = (href) => currentRoute === href || currentRoute.startsWith(href + '?');

    const menuGroups = useMemo(() => [
        {
            title: 'Ana Sayfa',
            icon: 'home',
            items: [
                { title: 'Dashboard', href: window.route('dashboard') },
            ],
        },
        {
            title: 'İnsan Kaynakları',
            icon: 'users',
            items: [
                { title: 'Başvurular', href: window.route('admin.submissions.index') },
                { title: 'Formlar', href: window.route('admin.forms.index') },
                { title: 'Departmanlar', href: window.route('admin.departments.index') },
                { title: 'Çalışanlar', href: window.route('admin.employees.index') },
                { title: 'Kullanıcılar', href: window.route('admin.users.index') },
            ],
        },
        {
            title: 'Zaman Yönetimi',
            icon: 'clock',
            items: [
                { title: 'Devam Takibi', href: window.route('admin.attendance.index') },
                { title: 'Vardiyalar', href: window.route('admin.shifts.index') },
                { title: 'Vardiya Takvimi', href: window.route('admin.shifts.schedules') },
                { title: 'Düzeltme Talepleri', href: window.route('admin.adjustments.index') },
                { title: 'Çalışma Takvimleri', href: window.route('admin.work-calendars.index') },
                { title: 'Resmi Tatiller', href: window.route('admin.holidays.index') },
            ],
        },
        {
            title: 'İzin Yönetimi',
            icon: 'calendar-event',
            items: [
                { title: 'İzin Talepleri', href: window.route('admin.leave.requests.index') },
                { title: 'İzin Türleri', href: window.route('admin.leave.types.index') },
                { title: 'İzin Hakları', href: window.route('admin.leave.entitlements.index') },
            ],
        },
        {
            title: 'Bordro ve Maaş',
            icon: 'cash-banknote',
            items: [
                { title: 'Bordrolar', href: window.route('admin.payrolls.index') },
                { title: 'Maaş Bileşenleri', href: window.route('admin.salary-components.index') },
                { title: 'Avans Talepleri', href: window.route('admin.advances.index') },
            ],
        },
        {
            title: 'Raporlar',
            icon: 'chart-bar',
            items: [
                { title: 'Bordro Raporları', href: window.route('admin.payroll-reports.index') },
                { title: 'Devam Raporları', href: window.route('admin.attendance-reports.index') },
            ],
        },
    ], []);

    // Auto-open menu that contains active route
    useEffect(() => {
        const initialOpen = {};
        menuGroups.forEach((group) => {
            const hasActiveItem = group.items.some((item) => isActive(item.href));
            if (hasActiveItem) {
                initialOpen[group.title] = true;
            }
        });
        setOpenMenus(initialOpen);
    }, [currentRoute]);

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
                    <Link href={window.route('dashboard')}>
                        <span className="font-size-1-3rem font-bold text-transform-uppercase">
                            {usePage().props.appName || 'Reqruit'}
                        </span>
                    </Link>
                </div>

                <div className="navbar-content">
                    <ul className='pc-navbar'>
                        {menuGroups.map((group) => {
                            const isOpen = openMenus[group.title] || false;
                            const isSingleItem = group.items.length === 1;
                            const shouldBeDropdown = !(group.title === 'Ana Sayfa' && isSingleItem);

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
