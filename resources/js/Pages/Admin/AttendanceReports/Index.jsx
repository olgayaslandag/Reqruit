import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ statistics = {}, reportsSummary = {}, filters = {} }) {
    const { props } = usePage();
    const flash = props.flash;

    const [reportFilters, setReportFilters] = useState({
        period: filters?.period || 'current_month',
        date_range: filters?.date_range || {},
        employee_id: filters?.employee_id || '',
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Devam Raporları
                    </h2>
                </div>
            }
        >
            <Head title="Devam Raporları" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Rapor Panel Kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Toplam Devam Eden */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-100">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Devam Eden</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.present_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Toplam Devam Dışı */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-red-100">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Devam Dışı</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.absent_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Toplam Geç Kalma */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-yellow-100">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Geç Kalan</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.late_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Toplam Fazla Mesai */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-blue-100">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Fazla Mesai</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.overtime_duration || '00:00'} sa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hızlı Rapor Girişi */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Rapor Türleri</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            <Link
                                href={route('admin.attendance-reports.daily')}
                                className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium text-sm">Günlük Rapor</span>
                            </Link>

                            <Link
                                href={route('admin.attendance-reports.monthly')}
                                className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium text-sm">Aylık Rapor</span>
                            </Link>

                            <Link
                                href={route('admin.attendance-reports.overtime')}
                                className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="font-medium text-sm">Fazla Mesai</span>
                            </Link>

                            <Link
                                href={route('admin.attendance-reports.export')}
                                className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="font-medium text-sm">Dışa Aktar</span>
                            </Link>
                            
                            <Link
                                href={route('admin.attendance-reports.index')}
                                className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="font-medium text-sm">Detaylı Rapor</span>
                            </Link>
                        </div>
                    </div>

                    {/* Rapor Özeti */}
                    {reportsSummary && reportsSummary.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">En Son Raporlar</h3>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rapor Tipi</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statü</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Çalışan</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Toplam saat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reportsSummary.map((report, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">{report.report_type}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{report.date}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        report.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {report.status === 'completed' ? 'Tamamlandı' : 'Hazırlandı'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {report.employee_count || 'N/A'} kişi
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                    {report.total_duration || '00:00'} sa
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Filtreleme Paneli */}
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtreleme Seçenekleri</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zaman Aralığı</label>
                                <select
                                    value={reportFilters.period}
                                    onChange={(e) => setReportFilters({...reportFilters, period: e.target.value})}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="current_day">Bugün</option>
                                    <option value="current_week">Bu Hafta</option>
                                    <option value="current_month">Bu Ay</option>
                                    <option value="last_30_days">Son 30 Gün</option>
                                    <option value="custom">Özel Tarih</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personel</label>
                                <select
                                    value={reportFilters.employee_id}
                                    onChange={(e) => setReportFilters({...reportFilters, employee_id: e.target.value})}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {props.employees?.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}