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
            pageHeader={{
                title: 'Fazla Mesai Raporu',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Raporlar', url: route('admin.reports.index') },
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                    { label: 'Fazla Mesai', url: route('admin.attendance-reports.overtime') },
                ],
            }}
        >
            <Head title="Fazla Mesai Raporu" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-3 shadow-sm-md mb-5 p-4">
                        <div className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Yıl Seçimi
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={localFilters.year}
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
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={localFilters.month}
                                    onChange={(e) => handleFilterChange('month', e.target.value)}
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
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Personel
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={localFilters.employee_id}
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
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Departman
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={localFilters.department_id}
                                    onChange={(e) => handleFilterChange('department_id', e.target.value)}
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
                    <div className="d-grid d-grid-cols-1 gap-3 mb-5">
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Toplam Fazla Mesai</div>
                            <div className="fs-2 fw-bold text-orange-600">{overtimeReport.total_overtime || '0.00'} sa</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Ort. Fazla Mesai</div>
                            <div className="fs-2 fw-bold text-info">{(overtimeReport.avg_overtime || 0).toFixed(2)} sa</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Toplam Çalışan</div>
                            <div className="fs-2 fw-bold text-success">{overtimeReport.total_employees || 0}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <div className="fs-sm text-muted">Fazla Mesai Yapan</div>
                            <div className="fs-2 fw-bold text-purple-600">{overtimeReport.overtime_employees || 0}</div>
                        </div>
                    </div>

                    {/* Grafikler */}
                    <div className="d-grid d-grid-cols-1 gap-4 mb-5">
                        {/* Fazla Mesai Dağılımı */}
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <h5 className="fw-medium">Aylık Fazla Mesai Dağılımı</h5>
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
                        <div className="bg-white rounded-3 shadow-sm-md p-4">
                            <h5 className="fw-medium">Fazla Mesailerin % Dağılımı</h5>
                            <div className="d-flex align-items-center justify-content-center h-80">
                                <div className="d-grid d-grid-cols-1 gap-2">
                                    {overtimeReport.top_overtime_employees?.slice(0, 5).map((employee, index) => (
                                        <div key={employee.employee_id} className="d-flex align-items-center">
                                            <div className="w-8 h-8 rounded-pill bg-indigo-100 d-flex align-items-center justify-content-center fs-xs fw-medium text-indigo-800">
                                                {index + 1}
                                            </div>
                                            <div className="ml-3">
                                                <div className="fs-sm fw-medium text-dark">
                                                    {employee.first_name} {employee.last_name}
                                                </div>
                                                <div className="fs-sm text-muted">{employee.total} sa</div>
                                            </div>
                                            <div className="ml-auto">
                                                <div className="fs-sm fw-medium text-dark">{employee.percentage}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detaylı Tablo */}
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Fazla Mesai Detayları</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Statü
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Mesai
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Ort. Günlük
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Mesai Görevli mi?
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {overtimeReport.overtime_details && overtimeReport.overtime_details.length > 0 ? (
                                        overtimeReport.overtime_details.map((detail, index) => (
                                            <tr key={detail.employee_id} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="d-flex align-items-center">
                                                        <div className="d-flex-shrink-0 h-10 w-10">
                                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="fs-sm fw-medium text-dark">
                                                                {detail.first_name} {detail.last_name}
                                                            </div>
                                                            <div className="fs-sm text-muted">
                                                                {detail.position_title || 'Pozisyon Yok'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm text-dark">
                                                        {detail.department_title || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        detail.employment_status === 'contract' 
                                                            ? 'bg-primary bg-opacity-10 text-info' 
                                                            : 'bg-success bg-opacity-10 text-success'
                                                    }`}>
                                                        {detail.employment_status === 'contract' ? 'Sözleşmeli' : 'Daimi'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {detail.total_overtime} saat
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {detail.overtime_days} gün
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {(detail.avg_daily_overtime || 0).toFixed(2)} sa
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        detail.overtime_eligible 
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : 'bg-danger bg-opacity-10 text-danger'
                                                    }`}>
                                                        {detail.overtime_eligible ? 'Evet' : 'Hayır'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center fs-sm text-muted">
                                                Fazla mesai kaydı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Özet Notları */}
                    <div className="mt-6 d-grid d-grid-cols-1 gap-4">
                        <div className="bg-orange-50 border border-orange-200 rounded p-4">
                            <div className="d-flex">
                                <div className="d-flex-shrink-0">
                                    <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h5 className="fw-medium">Fazla Mesai Özeti</h5>
                                    <div className="mt-2 fs-sm text-orange-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Toplam {overtimeReport.total_overtime || 0} saat fazla mesai yapılmıştır.</li>
                                            <li>Fazla mesai yapan çalışan sayısı: {overtimeReport.overtime_employees || 0}</li>
                                            <li>Aylık ortalama fazla mesai: {(overtimeReport.avg_overtime || 0).toFixed(2)} saat</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                            <div className="d-flex">
                                <div className="d-flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h5 className="fw-medium">Mesai Ücretleri Hesabı</h5>
                                    <div className="mt-2 fs-sm text-info">
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