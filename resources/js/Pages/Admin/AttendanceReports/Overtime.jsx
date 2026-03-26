import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { formatDate, formatTime, getOvertimeHours, calculateWorkingHours } from '@/Utils/attendanceHelpers.jsx';

export default function Overtime({ overtimeReport = {}, filters = {}, employees = [] }) {
    const { props } = usePage();
    const flash = props.flash;
    const [localFilters, setLocalFilters] = useState({
        year: filters?.year || new Date().getFullYear(),
        month: filters?.month || '',
        employee_id: filters?.employee_id || '',
        department_id: filters?.department_id || ''
    });
    
    // Filtre değiştirme
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Inertia ile filtrelenmiş verileri yükle
        router.get(route('admin.attendance-reports.overtime'), newFilters, {
            replace: true
        });
    };

    // Excel/PDF dışa aktarma fonksiyonu
    const handleExport = (format) => {
        const params = new URLSearchParams({
            ...localFilters,
            format: format
        });
        window.open(`${route('admin.attendance-reports.overtime.export')}?${params}`, '_blank');
    };

    // Grafik verileri
    const overtimeData = overtimeReport.chart_data || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Fazla Mesai Raporu
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
            <Head title="Fazla Mesai Raporu" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Yıl Seçimi
                                </label>
                                <select
                                    value={localFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {Array.from({length: 5}, (_, i) => {
                                        const year = new Date().getFullYear() - 2 + i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ay Seçimi
                                </label>
                                <select
                                    value={localFilters.month}
                                    onChange={(e) => handleFilterChange('month', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    <option value="01">Ocak</option>
                                    <option value="02">Şubat</option>
                                    <option value="03">Mart</option>
                                    <option value="04">Nisan</option>
                                    <option value="05">Mayıs</option>
                                    <option value="06">Haziran</option>
                                    <option value="07">Temmuz</option>
                                    <option value="08">Ağustos</option>
                                    <option value="09">Eylül</option>
                                    <option value="10">Ekim</option>
                                    <option value="11">Kasım</option>
                                    <option value="12">Aralık</option>
                                </select>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departman
                                </label>
                                <select
                                    value={localFilters.department_id}
                                    onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {props.departments?.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Fazla Mesai Kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Toplam Fazla Mesai</div>
                            <div className="text-2xl font-bold text-orange-600">{overtimeReport.total_overtime || '0.00'} sa</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Ort. Fazla Mesai</div>
                            <div className="text-2xl font-bold text-blue-600">{(overtimeReport.avg_overtime || 0).toFixed(2)} sa</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Toplam Çalışan</div>
                            <div className="text-2xl font-bold text-green-600">{overtimeReport.total_employees || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Fazla Mesai Yapan</div>
                            <div className="text-2xl font-bold text-purple-600">{overtimeReport.overtime_employees || 0}</div>
                        </div>
                    </div>

                    {/* Grafikler */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Fazla Mesai Dağılımı */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Aylık Fazla Mesai Dağılımı</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={overtimeData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} saat`, 'Fazla Mesai']} />
                                        <Legend />
                                        <Bar dataKey="total_overtime" name="Toplam Fazla Mesai" fill="#f59e0b" />
                                        <Bar dataKey="avg_overtime" name="Ortalama Fazla Mesai" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* En Çok Fazla Mesai Yapan Personeller */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Fazla Mesailerin % Dağılımı</h3>
                            <div className="flex items-center justify-center h-80">
                                <div className="grid grid-cols-1 gap-2">
                                    {overtimeReport.top_overtime_employees?.slice(0, 5).map((employee, index) => (
                                        <div key={employee.employee_id} className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-800">
                                                {index + 1}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {employee.first_name} {employee.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">{employee.total} sa</div>
                                            </div>
                                            <div className="ml-auto">
                                                <div className="text-sm font-medium text-gray-900">{employee.percentage}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detaylı Tablo */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Fazla Mesai Detayları</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statü
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Toplam Mesai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ort. Günlük
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mesai Görevli mi?
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {overtimeReport.overtime_details && overtimeReport.overtime_details.length > 0 ? (
                                        overtimeReport.overtime_details.map((detail, index) => (
                                            <tr key={detail.employee_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {detail.first_name} {detail.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {detail.position_title || 'Pozisyon Yok'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {detail.department_title || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        detail.employment_status === 'contract' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {detail.employment_status === 'contract' ? 'Sözleşmeli' : 'Daimi'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {detail.total_overtime} saat
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {detail.overtime_days} gün
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {(detail.avg_daily_overtime || 0).toFixed(2)} sa
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        detail.overtime_eligible 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {detail.overtime_eligible ? 'Evet' : 'Hayır'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Fazla mesai kaydı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Özet Notları */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-orange-800">Fazla Mesai Özeti</h3>
                                    <div className="mt-2 text-sm text-orange-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Toplam {overtimeReport.total_overtime || 0} saat fazla mesai yapılmıştır.</li>
                                            <li>Fazla mesai yapan çalışan sayısı: {overtimeReport.overtime_employees || 0}</li>
                                            <li>Aylık ortalama fazla mesai: {(overtimeReport.avg_overtime || 0).toFixed(2)} saat</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Mesai Ücretleri Hesabı</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Hedeflenen maksimum fazla mesai oranı: %20</li>
                                            <li>Uyarı seviyesi aşan çalışan sayısı: {overtimeReport.exceed_employee_count || 0}</li>
                                            <li>Toplam mesai ücreti tahmini: {overtimeReport.est_cost || 'N/A'}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}