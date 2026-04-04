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
            pageHeader={{
                title: 'Devam Raporları',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Raporlar', url: route('admin.reports.index') },
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                ],
                newUrl: route('admin.attendance.index'),
            }}
        >
            <Head title="Devam Raporları" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    {/* Rapor Panel Kartları */}
                    <div className="d-grid d-grid-cols-1 gap-4 mb-8">
                        {/* Toplam Devam Eden */}
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="d-flex align-items-center">
                                <div className="p-3 rounded bg-success bg-opacity-10">
                                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="fs-sm fw-medium text-muted">Devam Eden</p>
                                    <p className="fs-2 fw-bold text-dark">{statistics.present_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Toplam Devam Dışı */}
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="d-flex align-items-center">
                                <div className="p-3 rounded bg-danger bg-opacity-10">
                                    <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="fs-sm fw-medium text-muted">Devam Dışı</p>
                                    <p className="fs-2 fw-bold text-dark">{statistics.absent_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Toplam Geç Kalma */}
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="d-flex align-items-center">
                                <div className="p-3 rounded bg-warning bg-opacity-10">
                                    <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="fs-sm fw-medium text-muted">Geç Kalan</p>
                                    <p className="fs-2 fw-bold text-dark">{statistics.late_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Toplam Fazla Mesai */}
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="d-flex align-items-center">
                                <div className="p-3 rounded bg-primary bg-opacity-10">
                                    <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="fs-sm fw-medium text-muted">Fazla Mesai</p>
                                    <p className="fs-2 fw-bold text-dark">{statistics.overtime_duration || '00:00'} sa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hızlı Rapor Girişi */}
                    <div className="bg-white rounded-3 shadow-sm-md p-4 mb-8">
                        <h5 className="fw-medium">Rapor Türleri</h5>
                        
                        <div className="d-grid d-grid-cols-1 gap-3">
                            <Link
                                href={route('admin.attendance-reports.daily')}
                                className="d-flex d-flex-column align-items-center justify-content-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3 shadow-sm-md hover:shadow-sm-lg transform -all"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="fw-medium fs-sm">Günlük Rapor</span>
                            </Link>

                            <Link
                                href={route('admin.attendance-reports.monthly')}
                                className="d-flex d-flex-column align-items-center justify-content-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-3 shadow-sm-md hover:shadow-sm-lg transform -all"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="fw-medium fs-sm">Aylık Rapor</span>
                            </Link>

                            <Link
                                href={route('admin.attendance-reports.overtime')}
                                className="d-flex d-flex-column align-items-center justify-content-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-3 shadow-sm-md hover:shadow-sm-lg transform -all"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="fw-medium fs-sm">Fazla Mesai</span>
                            </Link>

                            <Link
                                href={route('admin.attendance-reports.export')}
                                className="d-flex d-flex-column align-items-center justify-content-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3 shadow-sm-md hover:shadow-sm-lg transform -all"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="fw-medium fs-sm">Dışa Aktar</span>
                            </Link>
                            
                            <Link
                                href={route('admin.attendance-reports.index')}
                                className="d-flex d-flex-column align-items-center justify-content-center p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-3 shadow-sm-md hover:shadow-sm-lg transform -all"
                            >
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="fw-medium fs-sm">Detaylı Rapor</span>
                            </Link>
                        </div>
                    </div>

                    {/* Rapor Özeti */}
                    {reportsSummary && reportsSummary.length > 0 && (
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <h5 className="fw-medium">En Son Raporlar</h5>
                            
                            <div className="overflow-auto">
                                <table className="w-100 divide-y divide-gray-200">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Rapor Tipi</th>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Tarih</th>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Statü</th>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Çalışan</th>
                                            <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">Toplam saat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reportsSummary.map((report, index) => (
                                            <tr key={index} className="hover:table-light">
                                                <td className="px-4 py-3 text-nowrap">
                                                    <span className="fs-sm fw-medium text-dark">{report.report_type}</span>
                                                </td>
                                                <td className="px-4 py-3 text-nowrap">
                                                    <span className="fs-sm text-dark">{report.date}</span>
                                                </td>
                                                <td className="px-4 py-3 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        report.status === 'completed' 
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : 'bg-warning bg-opacity-10 text-warning'
                                                    }`}>
                                                        {report.status === 'completed' ? 'Tamamlandı' : 'Hazırlandı'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-nowrap fs-sm text-dark">
                                                    {report.employee_count || 'N/A'} kişi
                                                </td>
                                                <td className="px-4 py-3 text-nowrap text-right fs-sm fw-medium text-dark">
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
                    <div className="mt-8 bg-white rounded-3 shadow-sm-md p-4">
                        <h5 className="fw-medium">Filtreleme Seçenekleri</h5>
                        
                        <div className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Zaman Aralığı</label>
                                <select className="form-control" value={reportFilters.period}
                                    onChange={(e) => setReportFilters({...reportFilters, period: e.target.value})}
                                >
                                    <option value="current_day">Bugün</option>
                                    <option value="current_week">Bu Hafta</option>
                                    <option value="current_month">Bu Ay</option>
                                    <option value="last_30_days">Son 30 Gün</option>
                                    <option value="custom">Özel Tarih</option>
                                </select>
                            </div>

                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Personel</label>
                                <select className="form-control" value={reportFilters.employee_id}
                                    onChange={(e) => setReportFilters({...reportFilters, employee_id: e.target.value})}
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