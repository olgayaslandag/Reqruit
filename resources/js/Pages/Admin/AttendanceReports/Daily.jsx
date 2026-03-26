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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Günlük Devam Raporu
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExport('excel')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center gap-2"
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tarih Seçimi
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.date}
                                    onChange={(e) => handleFilterChange('date', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Personel
                                </label>
                                <select
                                    value={localFilters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Toplam Personel</div>
                            <div className="text-2xl font-bold text-gray-900">{dailyReport.total_employees || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Devam Eden</div>
                            <div className="text-2xl font-bold text-green-600">{dailyReport.present_count || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Devam Dışı</div>
                            <div className="text-2xl font-bold text-red-600">{dailyReport.absent_count || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Ortalama</div>
                            <div className="text-2xl font-bold text-blue-600">{dailyReport.average_attendance_rate || '0%'}%</div>
                        </div>
                    </div>

                    {/* Devam Tablosu */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Tüm Personel Devam Kayıtları</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Durum
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giriş Saati
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Çıkış Saati
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Toplam Saat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fazla Mesai
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dailyReport.daily_data && dailyReport.daily_data.length > 0 ? (
                                        dailyReport.daily_data.map((entry, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {entry.employee?.first_name} {entry.employee?.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {entry.employee?.position_title} | {entry.employee?.identity_no}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        entry.status === 'present' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : entry.status === 'absent' 
                                                                ? 'bg-red-100 text-red-800'
                                                                : entry.status === 'late'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {entry.status === 'present' ? 'Devrede' : 
                                                         entry.status === 'absent' ? 'Devre Dışı' :
                                                         entry.status === 'late' ? 'Geç Giriş' : 'Diğer'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {entry.clock_in ? formatTime(entry.clock_in) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {entry.clock_out ? formatTime(entry.clock_out) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {entry.working_hours || '00:00'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`${entry.overtime > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
                                                        {entry.overtime || '0.0'} sa
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Bu tarih için herhangi bir devam kaydı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Özet Notlar */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Günlük Rapor Notları</h3>
                                <div className="mt-2 text-sm text-blue-700">
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