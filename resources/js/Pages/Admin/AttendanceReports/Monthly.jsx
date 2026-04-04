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
            pageHeader={{
                title: 'Aylık Devam Raporu',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Raporlar', url: route('admin.reports.index') },
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                    { label: 'Aylık Rapor', url: route('admin.attendance-reports.monthly') },
                ],
            }}
        >
            <Head title="Aylık Devam Raporu" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-3 shadow-sm-md mb-5 p-4">
                        <div className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Yıl Seçimi
                                </label>
                                <select className="form-control" value={localFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
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
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Ay Seçimi
                                </label>
                                <select className="form-control" value={localFilters.month}
                                    onChange={(e) => handleFilterChange('month', e.target.value)}
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
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Personel
                                </label>
                                <select className="form-control" value={localFilters.employee_id}
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

                    {/* Aylık Rapor Kartları */}
                    <div className="d-grid d-grid-cols-1 gap-3 mb-5">
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Toplam İş Günü</div>
                            <div className="fs-2 fw-bold text-dark">{monthlyReport.total_workdays || 0} gün</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Devam Oranı</div>
                            <div className="fs-2 fw-bold text-success">{monthlyReport.attendance_rate || '0'}%</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Ort. Mesai</div>
                            <div className="fs-2 fw-bold text-info">{monthlyReport.avg_overtime || '00'} sa</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Toplam Mesai</div>
                            <div className="fs-2 fw-bold text-orange-600">{monthlyReport.total_overtime || '00'} sa</div>
                        </div>
                    </div>

                    {/* Devam Grafiği */}
                    <div className="bg-white rounded-3 shadow-sm-md p-4 mb-5">
                        <h5 className="fw-medium">Aylık Devam Grafiği</h5>
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
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Aylık Devam Ayrıntısı</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Giriş
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Çıkış
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Normal Saat
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Fazla Mesai
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Statü
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlyReport.daily_details && monthlyReport.daily_details.length > 0 ? (
                                        monthlyReport.daily_details.map((dayEntry, index) => (
                                            <tr key={index} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {new Date(dayEntry.date).toLocaleDateString('tr-TR', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            weekday: 'short' 
                                                        })}
                                                    </div>
                                                    <div className="fs-xs text-muted">
                                                        {new Date(dayEntry.date).toLocaleDateString('tr-TR', { 
                                                            weekday: 'long' 
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {dayEntry.clock_in ? new Date(dayEntry.clock_in).toLocaleTimeString('tr-TR', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    }) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {dayEntry.clock_out ? new Date(dayEntry.clock_out).toLocaleTimeString('tr-TR', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    }) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm">
                                                    <span className={`d-inline-d-flex align-items-center px-2 rounded-pill fs-xs fw-medium ${
                                                        dayEntry.working_hours && parseInt(dayEntry.working_hours.split(':')[0]) >= 8
                                                            ? 'bg-success bg-opacity-10 text-success'
                                                            : dayEntry.working_hours && parseInt(dayEntry.working_hours.split(':')[0]) > 0
                                                                ? 'bg-warning bg-opacity-10 text-warning'
                                                                : 'bg-light text-dark'
                                                    }`}>
                                                        {dayEntry.working_hours || '00:00'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm">
                                                    <span className={`d-inline-d-flex align-items-center px-2 rounded-pill fs-xs fw-medium ${
                                                        dayEntry.overtime && parseFloat(dayEntry.overtime) > 0
                                                            ? 'bg-danger bg-opacity-10 text-danger'
                                                            : 'bg-light text-dark'
                                                    }`}>
                                                        {dayEntry.overtime || '0.0'} sa
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        dayEntry.status === 'present' 
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : dayEntry.status === 'absent' 
                                                                ? 'bg-danger bg-opacity-10 text-danger'
                                                                : dayEntry.status === 'late'
                                                                    ? 'bg-warning bg-opacity-10 text-warning'
                                                                    : dayEntry.status === 'early_departure'
                                                                        ? 'bg-orange-100 text-orange-800'
                                                                        : 'bg-light text-dark'
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
                                            <td colSpan="6" className="px-6 py-12 text-center fs-sm text-muted">
                                                Bu ay için veri bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Özet Bilgiler */}
                    <div className="mt-6 d-grid d-grid-cols-1 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                            <div className="d-flex">
                                <div className="d-flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h5 className="fw-medium">Aylık Özet</h5>
                                    <div className="mt-2 fs-sm text-info">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Belirlenen {monthlyReport.total_workdays || 0} iş günü içinde {monthlyReport.attendance_days || 0} gün çalışılmıştır.</li>
                                            <li>Toplamda {monthlyReport.total_overtime || 0} saat fazla mesai yapılmıştır.</li>
                                            <li>Ortalama günlük çalışma süresi {(monthlyReport.avg_daily_hours || 0).toFixed(2)} saattir.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                            <div className="d-flex">
                                <div className="d-flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h5 className="fw-medium">Dikkat Edilecekler</h5>
                                    <div className="mt-2 fs-sm text-warning">
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