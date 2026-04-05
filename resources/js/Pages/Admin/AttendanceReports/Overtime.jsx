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

export default function Overtime({ overtimeReport = {}, filters = {}, employees = [] }) {
    const { props } = usePage();
    const [localFilters, setLocalFilters] = useState({
        year: filters?.year || new Date().getFullYear(),
        month: filters?.month || '',
        employee_id: filters?.employee_id || '',
        department_id: filters?.department_id || ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.attendance-reports.overtime'), newFilters, { replace: true });
    };

    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const overtimeData = overtimeReport.chart_data || [];

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Fazla Mesai Raporu',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                    { label: 'Fazla Mesai', url: '#' },
                ],
                backUrl: route('admin.attendance-reports.index'),
            }}
        >
            <Head title="Fazla Mesai Raporu" />

            <div className="container-fluid py-4">
                {/* Filtreleme */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Yıl</label>
                                <select className="form-select" value={localFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}>
                                    {Array.from({length: 5}, (_, i) => {
                                        const year = new Date().getFullYear() - 2 + i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Ay</label>
                                <select className="form-select" value={localFilters.month}
                                    onChange={(e) => handleFilterChange('month', e.target.value)}>
                                    <option value="">Tümü</option>
                                    {months.map((m, i) => (
                                        <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Personel</label>
                                <select className="form-select" value={localFilters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}>
                                    <option value="">Tümü</option>
                                    {employees?.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.first_name} {employee.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Departman</label>
                                <select className="form-select" value={localFilters.department_id}
                                    onChange={(e) => handleFilterChange('department_id', e.target.value)}>
                                    <option value="">Tümü</option>
                                    {props.departments?.map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Özet Kartlar */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card border-warning">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Fazla Mesai</h6>
                                <h3 className="mb-0 fw-bold text-warning">{overtimeReport.total_overtime || 0} sa</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-info">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Ortalama</h6>
                                <h3 className="mb-0 fw-bold text-info">{(overtimeReport.avg_overtime || 0).toFixed(2)} sa</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-success">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Çalışan</h6>
                                <h3 className="mb-0 fw-bold text-success">{overtimeReport.total_employees || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-primary">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Fazla Mesai Yapan</h6>
                                <h3 className="mb-0 fw-bold text-primary">{overtimeReport.overtime_employees || 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafik */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-chart-bar me-2"></i>Aylık Dağılım</h5>
                    </div>
                    <div className="card-body">
                        <div className="graph-height">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={overtimeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} saat`, 'Fazla Mesai']} />
                                    <Legend />
                                    <Bar dataKey="total_overtime" name="Toplam" fill="#f59e0b" />
                                    <Bar dataKey="avg_overtime" name="Ortalama" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-users me-2"></i>Detaylar</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Personel</th>
                                        <th>Departman</th>
                                        <th>Statü</th>
                                        <th className="text-end">Toplam</th>
                                        <th className="text-end">Ort. Günlük</th>
                                        <th>Uygun</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overtimeReport.overtime_details && overtimeReport.overtime_details.length > 0 ? (
                                        overtimeReport.overtime_details.map((detail, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="fw-semibold">{detail.first_name} {detail.last_name}</div>
                                                    <div className="small text-muted">{detail.position_title}</div>
                                                </td>
                                                <td>{detail.department_title || '-'}</td>
                                                <td>
                                                    <span className={`badge ${detail.employment_status === 'contract' ? 'bg-info' : 'bg-success'}`}>
                                                        {detail.employment_status === 'contract' ? 'Sözleşmeli' : 'Daimi'}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="fw-semibold">{detail.total_overtime} sa</div>
                                                    <div className="small text-muted">{detail.overtime_days} gün</div>
                                                </td>
                                                <td className="text-end">{(detail.avg_daily_overtime || 0).toFixed(2)} sa</td>
                                                <td>
                                                    <span className={`badge ${detail.overtime_eligible ? 'bg-success' : 'bg-danger'}`}>
                                                        {detail.overtime_eligible ? 'Evet' : 'Hayır'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6} className="text-center text-muted py-4">Kayıt bulunamadı</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Notlar */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="alert alert-warning">
                            <i className="ti ti-clock me-2"></i>
                            <strong>Özet:</strong> Toplam {overtimeReport.total_overtime || 0} saat fazla mesai, {overtimeReport.overtime_employees || 0} çalışan.
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="alert alert-info">
                            <i className="ti ti-calculator me-2"></i>
                            <strong>Maliyet:</strong> Uyarı seviyesi aşan: {overtimeReport.exceed_employee_count || 0} çalışan.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}