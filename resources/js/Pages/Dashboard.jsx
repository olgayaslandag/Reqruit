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
            color: 'bg-blue-50 hover:bg-blue-100',
        },
        {
            title: 'Formlar',
            description: 'Başvuru formlarını oluştur ve yönet',
            href: '/admin/forms',
            icon: '📝',
            color: 'bg-green-50 hover:bg-green-100',
        },
        {
            title: 'Departmanlar',
            description: 'Departmanları yönet',
            href: '/admin/departments',
            icon: '🏢',
            color: 'bg-purple-50 hover:bg-purple-100',
        },
    ];

    const statsData = [
        { label: 'Toplam Başvuru', value: stats?.totalSubmissions ?? 0, icon: '📝', color: 'text-blue-600' },
        { label: 'Yeni Başvuru', value: stats?.pendingSubmissions ?? 0, icon: '🆕', color: 'text-yellow-600' },
        { label: 'Aktif Form', value: stats?.activeForms ?? 0, icon: '📄', color: 'text-green-600' },
        { label: 'Departman', value: stats?.departments ?? 0, icon: '🏢', color: 'text-purple-600' },
    ];

    const maxCount = Math.max(...(weeklySubmissions?.map(d => d.count) ?? [1]), 1);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Ana Ekran
                </h2>
            }
        >
            <Head title="Ana Ekran" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz</h1>
                        <p className="mt-2 text-gray-600">Başvuru Yönetim Sistemi</p>
                    </div>

                    {/* Haftalık Grafik */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Son 7 Günlük Başvurular</h3>
                        <div className="flex items-end justify-between h-48 gap-2">
                            {(weeklySubmissions || []).map((day, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div className="w-full flex flex-col items-center justify-end h-36">
                                        <span className="text-sm font-medium text-gray-700 mb-1">{day.count}</span>
                                        <div 
                                            className="w-full bg-indigo-500 rounded-t-md transition-all duration-300 hover:bg-indigo-600"
                                            style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '8px' : '2px' }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statsData.map((stat, index) => {
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
                                <Link key={index} href={href} className="bg-white overflow-hidden shadow rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-3">{stat.icon}</div>
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`${item.color} overflow-hidden shadow rounded-lg transition-all p-6`}
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
