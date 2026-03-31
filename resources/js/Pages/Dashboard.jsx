import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, weeklySubmissions }) {
    const menuItems = [
        {
            title: 'Başvurular',
            description: 'Gelen başvuruları görüntüle ve yönet',
            href: '/admin/submissions',
            icon: '📋',
            color: 'bg-light',
        },
        {
            title: 'Formlar',
            description: 'Başvuru formlarını oluştur ve yönet',
            href: '/admin/forms',
            icon: '📝',
            color: 'bg-light',
        },
        {
            title: 'Departmanlar',
            description: 'Departmanları yönet',
            href: '/admin/departments',
            icon: '🏢',
            color: 'bg-light',
        },
    ];

    const statsData = [
        { label: 'Toplam Başvuru', value: stats?.totalSubmissions ?? 0, icon: '📝', color: 'text-primary' },
        { label: 'Yeni Başvuru', value: stats?.pendingSubmissions ?? 0, icon: '🆕', color: 'text-warning' },
        { label: 'Aktif Form', value: stats?.activeForms ?? 0, icon: '📄', color: 'text-success' },
        { label: 'Departman', value: stats?.departments ?? 0, icon: '🏢', color: 'text-primary' },
    ];

    const maxCount = Math.max(...(weeklySubmissions?.map(d => d.count) ?? [1]), 1);

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Ana Ekran',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                ],
            }}
        >
            <Head title="Ana Ekran" />

            <div className="py-5">
                <div className="container-xl">
                    <div className="mb-4">
                        <h1 className="display-5 fw-bold text-dark">Hoş Geldiniz</h1>
                        <p className="fs-6 text-muted">Başvuru Yönetim Sistemi</p>
                    </div>

                    {/* Haftalık Grafik */}
                    <div className="card border-0 shadow-sm p-4 mb-4">
                        <h5 className="fw-medium">Son 7 Günlük Başvurular</h5>
                        <div className="d-flex align-items-end justify-content-between" style={{ height: '192px' }}>
                            {(weeklySubmissions || []).map((day, index) => (
                                <div key={index} className="d-flex-1 text-center">
                                    <div className="w-100 d-flex d-flex-column align-items-center justify-content-end" style={{ height: '144px' }}>
                                        <span className="small fw-medium text-body-secondary mb-1">{day.count}</span>
                                        <div
                                            className="w-100 bg-primary rounded-top"
                                            style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '8px' : '2px' }}
                                        />
                                    </div>
                                    <span className="small text-body-secondary mt-2">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                        {(statsData || []).map((stat, index) => {
                            let href = '#';
                            if (stat.label === 'Toplam Başvuru' || stat.label.includes('Başvuru')) {
                                href = '/admin/submissions';
                            } else if (stat.label === 'Yeni Başvuru') {
                                href = '/admin/submissions?status=new';
                            } else if (stat.label === 'Aktif Form') {
                                href = '/admin/forms';
                            } else if (stat.label === 'Departman') {
                                href = '/admin/departments';
                            }
                            
                            return (
                                <div key={index} className="col">
                                    <Link href={href} className="card border-0 shadow-sm p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="fs-4 me-3">{stat.icon}</div>
                                            <div>
                                                <p className="small text-body-secondary mb-1">{stat.label}</p>
                                                <p className={`fs-3 fw-bold ${stat.color}`}>{stat.value}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {(menuItems || []).map((item, index) => (
                            <div key={index} className="col">
                                <Link
                                    href={item.href}
                                    className={`${item.color} card border-0 shadow-sm p-4 text-decoration-none`}
                                >
                                    <div className="fs-2 mb-3 text-dark">{item.icon}</div>
                                    <h5 className="fw-medium">{item.title}</h5>
                                    <p className="small text-body-secondary mb-0">{item.description}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
