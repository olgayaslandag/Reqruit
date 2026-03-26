import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Chart from 'react-chartjs-2';
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
import { formatDate, calculateWorkingHours } from '@/Utils/attendanceHelpers.jsx';

export default function Monthly({ monthlyReport = {}, filters = {}, employees = [] }) {
    const { props } = usePage();
    const flash = props.flash;
    const [localFilters, setLocalFilters] = useState({
        year: filters?.year || new Date().getFullYear(),
        month: filters?.month || String(new Date().getMonth() + 1).padStart(2, '0'),
        employee_id: filters?.employee_id || ''
    });

    // Filtre değiştirme
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Inertia ile filtrelenmiş verileri yükle
        router.get(route('admin.attendance-reports.monthly'), newFilters, {
            replace: true
        });
    };

    // Excel/PDF dışa aktarma fonksiyonu
    const handleExport = (format) => {
        const params = new URLSearchParams({
            ...localFilters,
            format: format
        });
        window.open(`${route('admin.attendance-reports.monthly.export')}?${params}`, '_blank');
    };

    // Grafik verileri
    const attendanceData = monthlyReport.chart_data || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Aylık Devam Raporu
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
            <Head title="Aylık Devam Raporu" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </div>
                    </div>

                    {/* Aylık Rapor Kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Toplam İş Günü</div>
                            <div className="text-2xl font-bold text-gray-900">{monthlyReport.total_workdays || 0} gün</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Devam Oranı</div>
                            <div className="text-2xl font-bold text-green-600">{monthlyReport.attendance_rate || '0'}%</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Ort. Mesai</div>
                            <div className="text-2xl font-bold text-blue-600">{monthlyReport.avg_overtime || '00'} sa</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-500">Toplam Mesai</div>
                            <div className="text-2xl font-bold text-orange-600">{monthlyReport.total_overtime || '00'} sa</div>
                        </div>
                    </div>

                    {/* Devam Grafiği */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Aylık Devam Grafiği</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={attendanceData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="worked_hours" name="Çalışma Saati" fill="#3b82f6" />
                                    <Bar dataKey="overtime" name="Fazla Mesai" fill="#f59e0b" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ayrıntılı Tablo */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Aylık Devam Ayrıntısı</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giriş
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Çıkış
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Normal Saat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fazla Mesai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statü
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlyReport.daily_details && monthlyReport.daily_details.length > 0 ? (
                                        monthlyReport.daily_details.map((dayEntry, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {new Date(dayEntry.date).toLocaleDateString('tr-TR', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            weekday: 'short' 
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(dayEntry.date).toLocaleDateString('tr-TR', { 
                                                            weekday: 'long' 
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {dayEntry.clock_in ? new Date(dayEntry.clock_in).toLocaleTimeString('tr-TR', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    }) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {dayEntry.clock_out ? new Date(dayEntry.clock_out).toLocaleTimeString('tr-TR', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    }) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2 rounded-full text-xs font-medium ${
                                                        dayEntry.working_hours && parseInt(dayEntry.working_hours.split(':')[0]) >= 8
                                                            ? 'bg-green-100 text-green-800'
                                                            : dayEntry.working_hours && parseInt(dayEntry.working_hours.split(':')[0]) > 0
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {dayEntry.working_hours || '00:00'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2 rounded-full text-xs font-medium ${
                                                        dayEntry.overtime && parseFloat(dayEntry.overtime) > 0
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {dayEntry.overtime || '0.0'} sa
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        dayEntry.status === 'present' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : dayEntry.status === 'absent' 
                                                                ? 'bg-red-100 text-red-800'
                                                                : dayEntry.status === 'late'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : dayEntry.status === 'early_departure'
                                                                        ? 'bg-orange-100 text-orange-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {dayEntry.status === 'present' ? 'Devrede' :
                                                         dayEntry.status === 'absent' ? 'Devre Dışı' :
                                                         dayEntry.status === 'late' ? 'Geç Giriş' :
                                                         dayEntry.status === 'early_departure' ? 'Erken Çıkış' :
                                                         dayEntry.status === 'on_leave' ? 'İzinli' : 'Hatalı'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Bu ay için veri bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Özet Bilgiler */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Aylık Özet</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Belirlenen {monthlyReport.total_workdays || 0} iş günü içinde {monthlyReport.attendance_days || 0} gün çalışılmıştır.</li>
                                            <li>Toplamda {monthlyReport.total_overtime || 0} saat fazla mesai yapılmıştır.</li>
                                            <li>Ortalama günlük çalışma süresi {(monthlyReport.avg_daily_hours || 0).toFixed(2)} saattir.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Dikkat Edilecekler</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>{monthlyReport.late_arrivals || 0} gün geç Giriş</li>
                                            <li>{monthlyReport.early_departures || 0} gün erken çıkış</li>
                                            <li>{monthlyReport.absences || 0} gün devamsızlık</li>
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