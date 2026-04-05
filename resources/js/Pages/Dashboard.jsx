import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReactApexChart from 'react-apexcharts';

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

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 300,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '70%',
                distributed: true,
            }
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            categories: (weeklySubmissions || []).map(w => w.label),
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            title: { text: 'Başvuru Sayısı' },
            min: 0,
        },
        colors: ['#3b82f6'],
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
        },
    };

    const chartSeries = [
        {
            name: 'Başvurular',
            data: (weeklySubmissions || []).map(w => w.count),
        },
    ];

    return (
        <AuthenticatedLayout>
            <div className="py-5">
                <div className="container-xl">
                    <div className="mb-4">
                        <h1 className="display-5 fw-bold text-dark">Hoş Geldiniz</h1>
                        <p className="fs-6 text-muted">Başvuru Yönetim Sistemi</p>
                    </div>

                    {/* Haftalık Grafik */}
                    <div className="card border-0 shadow-sm p-4 mb-4">
                        <h5 className="fw-medium mb-3">Son 7 Haftalık Başvurular</h5>
                        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                        {(statsData || []).map((stat) => {
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
                            <div key={stat.label} className="col">
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
                        {(menuItems || []).map((item) => (
                            <div key={item.title} className="col">
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
