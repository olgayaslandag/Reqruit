import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatTime, formatDate } from '@/Utils/attendanceHelpers.jsx';
import { formatDateTime } from '@/Utils/formatters.jsx';

export default function Daily({ dailyReport = {}, filters = {}, employees = [] }) {
    const { props } = usePage();
    const flash = props.flash;
    const [localFilters, setLocalFilters] = useState({
        date: filters?.date || new Date().toISOString().split('T')[0],
        employee_id: filters?.employee_id || ''
    });

    // Filtre değiştirme
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Inertia ile filtrelenmiş verileri yükle
        router.get(route('admin.attendance-reports.daily'), newFilters, {
            replace: true
        });
    };

    // Excel/PDF dışa aktarma fonksiyonu
    const handleExport = (format) => {
        const params = new URLSearchParams({
            ...localFilters,
            format: format
        });
        window.open(`${route('admin.attendance-reports.daily.export')}?${params}`, '_blank');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Günlük Devam Raporu
                    </h5>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => handleExport('excel')}
                            className="btn btn-success btn-sm d-flex align-items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="btn btn-danger btn-sm d-flex align-items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Günlük Devam Raporu" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-3 shadow-sm-md mb-5 p-4">
                        <div className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Tarih Seçimi
                                </label>
                                <input className="form-control w-100" type="date"
                                    value={localFilters.date}
                                    onChange={(e) => handleFilterChange('date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Personel
                                </label>
                                <select className="form-control w-100" value={localFilters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {employees?.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.first_name} {employee.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Günlük Rapor Kartı */}
                    <div className="d-grid d-grid-cols-1 gap-3 mb-5">
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Toplam Personel</div>
                            <div className="fs-2 fw-bold text-dark">{dailyReport.total_employees || 0}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Devam Eden</div>
                            <div className="fs-2 fw-bold text-success">{dailyReport.present_count || 0}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Devam Dışı</div>
                            <div className="fs-2 fw-bold text-danger">{dailyReport.absent_count || 0}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Ortalama</div>
                            <div className="fs-2 fw-bold text-info">{dailyReport.average_attendance_rate || '0%'}%</div>
                        </div>
                    </div>

                    {/* Devam Tablosu */}
                    <div className="bg-white rounded-3 shadow-sm-md">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Tüm Personel Devam Kayıtları</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Durum
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Giriş Saati
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Çıkış Saati
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Saat
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Fazla Mesai
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dailyReport.daily_data && dailyReport.daily_data.length > 0 ? (
                                        dailyReport.daily_data.map((entry, index) => (
                                            <tr key={index} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="d-flex align-items-center">
                                                        <div className="d-flex-shrink-0 h-10 w-10">
                                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="fs-sm fw-medium text-dark">
                                                                {entry.employee?.first_name} {entry.employee?.last_name}
                                                            </div>
                                                            <div className="fs-sm text-muted">
                                                                {entry.employee?.position_title} | {entry.employee?.identity_no}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        entry.status === 'present' 
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : entry.status === 'absent' 
                                                                ? 'bg-danger bg-opacity-10 text-danger'
                                                                : entry.status === 'late'
                                                                    ? 'bg-warning bg-opacity-10 text-warning'
                                                                    : 'bg-light text-dark'
                                                    }`}>
                                                        {entry.status === 'present' ? 'Devrede' : 
                                                         entry.status === 'absent' ? 'Devre Dışı' :
                                                         entry.status === 'late' ? 'Geç Giriş' : 'Diğer'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {entry.clock_in ? formatTime(entry.clock_in) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {entry.clock_out ? formatTime(entry.clock_out) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {entry.working_hours || '00:00'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    <span className={`${entry.overtime > 0 ? 'text-danger fw-semibold' : 'text-muted'}`}>
                                                        {entry.overtime || '0.0'} sa
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center fs-sm text-muted">
                                                Bu tarih için herhangi bir devam kaydı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Özet Notlar */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
                        <div className="d-flex">
                            <div className="d-flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h5 className="fw-medium">Günlük Rapor Notları</h5>
                                <div className="mt-2 fs-sm text-info">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Bugün {dailyReport.present_count || 0} personel devredeydi.</li>
                                        <li>{dailyReport.late_count || 0} personel geç geldi.</li>
                                        <li>Günlük ortalama iş başı süresi {(dailyReport.avg_working_hours || 0).toFixed(2)} saattir.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}