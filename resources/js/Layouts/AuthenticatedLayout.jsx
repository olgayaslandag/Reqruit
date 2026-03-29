import { useState, useEffect, useRef } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import Flash from '@/Components/Flash';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

import { PageActionProvider } from '@/Context/PageActionContext';

export default function AuthenticatedLayout({ header, children, pageActions = {} }) {
    const user = usePage().props.auth.user;
    const flash = usePage().props.flash;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [payrollDropdownOpen, setPayrollDropdownOpen] = useState(false);
    const [attendanceDropdownOpen, setAttendanceDropdownOpen] = useState(false);
    const [leaveDropdownOpen, setLeaveDropdownOpen] = useState(false);

    // Click outside reference for desktop dropdowns
    const payrollDropdownRef = useRef(null);
    const attendanceDropdownRef = useRef(null);

    // Close payroll dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (payrollDropdownRef.current && !payrollDropdownRef.current.contains(event.target)) {
                setPayrollDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close attendance dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (attendanceDropdownRef.current && !attendanceDropdownRef.current.contains(event.target)) {
                setAttendanceDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setShowingNavigationDropdown(false);
    }, [usePage().url]);

    // Helper: Check if any payroll route is active
    const isPayrollActive = () => {
        return route().current('admin.payrolls.*') ||
               route().current('admin.salaryComponents.*') ||
               route().current('admin.advances.*') ||
               route().current('admin.payroll-reports.*');
    };

    // Helper: Check if any attendance route is active
    const isAttendanceActive = () => {
        return route().current('admin.attendance.*') ||
               route().current('admin.attendance-reports.*') ||
               route().current('admin.shifts.*') ||
               route().current('admin.work-calendars.*') ||
               route().current('admin.holidays.*') ||
               route().current('admin.adjustments.*');
    };

    // Helper: Check if any leave route is active
    const isLeaveActive = () => {
        return route().current('admin.leave.*');
    };

    return (
        <PageActionProvider actions={pageActions}>
            <div className="min-h-screen bg-gray-100">
                <Flash flash={flash} />

                <nav className="border-b border-gray-100 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">

                            {/* Left Side: Logo + Navigation */}
                            <div className="flex">
                                {/* Logo */}
                                <div className="flex shrink-0 items-center">
                                    <Link href={route('dashboard')}>
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                    </Link>
                                </div>

                                {/* Desktop Navigation - FLEX EKLENDİ */}
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex sm:items-center">
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                         style={{ display: 'none' }}
                                    >
                                        Ana Ekran
                                    </NavLink>

                                    <NavLink
                                        href={route('admin.submissions.index')}
                                        active={route().current('admin.submissions.*')}
                                    >
                                        Başvurular
                                    </NavLink>

                                    <NavLink
                                        href={route('admin.forms.index')}
                                        active={route().current('admin.forms.*')}
                                    >
                                        Formlar
                                    </NavLink>

                                    <NavLink
                                        href={route('admin.departments.index')}
                                        active={route().current('admin.departments.*')}
                                    >
                                        Departmanlar
                                    </NavLink>

                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.*')}
                                    >
                                        Kullanıcılar
                                    </NavLink>

                                    <NavLink
                                        href={route('admin.employees.index')}
                                        active={route().current('admin.employees.*')}
                                    >
                                        Çalışanlar
                                    </NavLink>

                                    {/* Bordro Dropdown - Desktop */}
                                    <div className="relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${
                                                            isPayrollActive()
                                                                ? 'text-gray-900 bg-gray-100'
                                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                        style={{ marginTop: 3 }}
                                                    >
                                                        Bordro
                                                        <svg
                                                            className="-me-0.5 ms-2 h-4 w-4 transition-transform"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content align="left">
                                                <Dropdown.Link href={route('admin.payrolls.index')}>
                                                    Dönemler
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.salary-components.index')}>
                                                    Maaş Kalemleri
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.advances.index')}>
                                                    Avans Talepleri
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.payroll-reports.index')}>
                                                    Raporlar
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>

                                     {/* Devam Kontrolü Dropdown - Desktop */}
                                     <div className="relative">
                                         <Dropdown>
                                             <Dropdown.Trigger>
                                                 <span className="inline-flex rounded-md">
                                                     <button
                                                         type="button"
                                                         className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${
                                                             isAttendanceActive()
                                                                 ? 'text-gray-900 bg-gray-100'
                                                                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                         }`}
                                                         style={{ marginTop: 3 }}
                                                     >
                                                         Devam
                                                         <svg
                                                             className="-me-0.5 ms-2 h-4 w-4 transition-transform"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             viewBox="0 0 20 20"
                                                             fill="currentColor"
                                                         >
                                                             <path
                                                                 fillRule="evenodd"
                                                                 d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                 clipRule="evenodd"
                                                             />
                                                         </svg>
                                                     </button>
                                                 </span>
                                             </Dropdown.Trigger>

                                             <Dropdown.Content align="left">
                                                 <Dropdown.Link href={route('admin.attendance.index')}>
                                                     Devam Kayıtları
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.attendance.scan')}>
                                                     QR Tarayıcı
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.attendance-reports.index')}>
                                                     Raporlar
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.shifts.index')}>
                                                     Vardiyalar
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.work-calendars.index')}>
                                                     Takvimler
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.holidays.index')}>
                                                     Tatiller
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.adjustments.index')}>
                                                     Düzeltmeler
                                                 </Dropdown.Link>
                                             </Dropdown.Content>
                                         </Dropdown>
                                     </div>
                                     
                                     {/* Corrected leave dropdown menus to remove problematic code */}
                                     <div className="relative">
                                         <Dropdown>
                                             <Dropdown.Trigger>
                                                 <span className="inline-flex rounded-md">
                                                     <button
                                                         type="button"
                                                         className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${
                                                             isLeaveActive()
                                                                 ? 'text-gray-900 bg-gray-100'
                                                                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                         }`}
                                                         style={{ marginTop: 3 }}
                                                     >
                                                         İzinler & Tatiller
                                                         <svg
                                                             className="-me-0.5 ms-2 h-4 w-4 transition-transform"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             viewBox="0 0 20 20"
                                                             fill="currentColor"
                                                         >
                                                             <path
                                                                 fillRule="evenodd"
                                                                 d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                 clipRule="evenodd"
                                                             />
                                                         </svg>
                                                     </button>
                                                 </span>
                                             </Dropdown.Trigger>

                                             <Dropdown.Content align="left">
                                                 <Dropdown.Link href={route('admin.leave.types.index')}>
                                                     İzin Türleri
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.leave.entitlements.index')}>
                                                     İzin Hakları
                                                 </Dropdown.Link>
                                                 <Dropdown.Link href={route('admin.leave.requests.index')}>
                                                     İzin Talepleri
                                                 </Dropdown.Link>
                                             </Dropdown.Content>
                                         </Dropdown>
                                     </div>
                                </div>
                            </div>

                            {/* Right Side: User Dropdown */}
                            <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profil
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Çıkış Yap
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            {/* Mobile Hamburger Button */}
                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Ana Ekran
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('admin.submissions.index')}
                                active={route().current('admin.submissions.*')}
                            >
                                Başvurular
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('admin.forms.index')}
                                active={route().current('admin.forms.*')}
                            >
                                Formlar
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('admin.departments.index')}
                                active={route().current('admin.departments.*')}
                            >
                                Departmanlar
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('admin.users.index')}
                                active={route().current('admin.users.*')}
                            >
                                Kullanıcılar
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('admin.employees.index')}
                                active={route().current('admin.employees.*')}
                            >
                                Çalışanlar
                            </ResponsiveNavLink>

                            {/* Mobile Bordro Submenu - Toggle ile */}
                            <div className="border-t border-gray-200 pt-4 pb-2">
                                <button
                                    onClick={() => setPayrollDropdownOpen(!payrollDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:outline-none"
                                >
                                    <span>Bordro</span>
                                    <svg
                                        className={`h-4 w-4 transition-transform ${payrollDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {payrollDropdownOpen && (
                                    <div className="pl-4 space-y-1 bg-gray-50">
                                        <ResponsiveNavLink
                                            href={route('admin.payrolls.index')}
                                            active={route().current('admin.payrolls.*')}
                                        >
                                            Dönemler
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route('admin.salary-components.index')}
                                            active={route().current('admin.salary-components.*')}
                                        >
                                            Maaş Kalemleri
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route('admin.advances.index')}
                                            active={route().current('admin.advances.*')}
                                        >
                                            Avans Talepleri
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route('admin.payroll-reports.index')}
                                            active={route().current('admin.payroll-reports.*')}
                                        >
                                            Raporlar
                                        </ResponsiveNavLink>
                                    </div>
                                 )}
                             </div>
                             
                             {/* Mobile İşe Devam Submenu - Toggle ile */}
                             <div className="border-t border-gray-200 pt-2 pb-2">
                                 <button
                                     onClick={() => setAttendanceDropdownOpen(!attendanceDropdownOpen)}
                                     className="w-full flex items-center justify-between px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:outline-none"
                                 >
                                     <span>İşe Devam</span>
                                     <svg
                                         className={`h-4 w-4 transition-transform ${attendanceDropdownOpen ? 'rotate-180' : ''}`}
                                         fill="none"
                                         stroke="currentColor"
                                         viewBox="0 0 24 24"
                                     >
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                     </svg>
                                 </button>

                                 {attendanceDropdownOpen && (
                                     <div className="pl-4 space-y-1 bg-gray-50">
                                         <ResponsiveNavLink
                                             href={route('admin.attendance.index')}
                                             active={route().current('admin.attendance.*')}
                                         >
                                             Devam Kayıtları
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.attendance.scan')}
                                             active={route().current('admin.attendance.scan')}
                                         >
                                             QR Tarayıcı
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.attendance-reports.index')}
                                             active={route().current('admin.attendance-reports.*')}
                                         >
                                             Raporlar
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.shifts.index')}
                                             active={route().current('admin.shifts.*')}
                                         >
                                             Vardiyalar
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.work-calendars.index')}
                                             active={route().current('admin.work-calendars.*')}
                                         >
                                             Takvimler
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.holidays.index')}
                                             active={route().current('admin.holidays.*')}
                                         >
                                             Tatiller
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.adjustments.index')}
                                             active={route().current('admin.adjustments.*')}
                                         >
                                             Düzeltmeler
                                         </ResponsiveNavLink>
                                     </div>
                                 )}
                             </div>
                             
                             {/* Mobile İzin & Tatil Submenu - Toggle ile */}
                             <div className="border-t border-gray-200 pt-2 pb-2">
                                 <button
                                     onClick={() => setLeaveDropdownOpen(!leaveDropdownOpen)}
                                     className="w-full flex items-center justify-between px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:outline-none"
                                 >
                                     <span>İzinler & Tatiller</span>
                                     <svg
                                         className={`h-4 w-4 transition-transform ${leaveDropdownOpen ? 'rotate-180' : ''}`}
                                         fill="none"
                                         stroke="currentColor"
                                         viewBox="0 0 24 24"
                                     >
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                     </svg>
                                 </button>

                                 {leaveDropdownOpen && (
                                     <div className="pl-4 space-y-1 bg-gray-50">
                                         <ResponsiveNavLink
                                             href={route('admin.leave.types.index')}
                                             active={route().current('admin.leave.types.*')}
                                         >
                                             İzin Türleri
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.leave.entitlements.index')}
                                             active={route().current('admin.leave.entitlements.*')}
                                         >
                                             İzin Hakları
                                         </ResponsiveNavLink>
                                         <ResponsiveNavLink
                                             href={route('admin.leave.requests.index')}
                                             active={route().current('admin.leave.requests.*')}
                                         >
                                             İzin Talepleri
                                         </ResponsiveNavLink>
                                     </div>
                                 )}
                             </div>
                        </div>

                        {/* Mobile User Section */}
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Profil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    Çıkış Yap
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Header */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main>{children}</main>
            </div>
        </PageActionProvider>
    );
}
