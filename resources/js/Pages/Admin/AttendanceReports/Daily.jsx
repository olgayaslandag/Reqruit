import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Daily({ dailyReport = {}, filters = {}, employees = [] }) {
    const { props } = usePage();
    const flash = props.flash;
    const [localFilters, setLocalFilters] = useState({
        date: filters?.date || new Date().toISOString().split('T')[0],
        employee_id: filters?.employee_id || ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.attendance-reports.daily'), newFilters, { replace: true });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            present: { class: 'bg-success', label: 'Devrede' },
            absent: { class: 'bg-danger', label: 'Devre Dışı' },
            late: { class: 'bg-warning', label: 'Geç Giriş' },
            leave: { class: 'bg-info', label: 'İzinli' },
        };
        const s = statusMap[status] || { class: 'bg-secondary', label: 'Diğer' };
        return `<span class="badge ${s.class}">${s.label}</span>`;
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Günlük Devam Raporu',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                    { label: 'Günlük Rapor', url: '#' },
                ],
                backUrl: route('admin.attendance-reports.index'),
            }}
        >
            <Head title="Günlük Devam Raporu" />

            <div className="container-fluid py-4">
                {/* Filtreleme */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Tarih</label>
                                <input type="date" className="form-control" value={localFilters.date}
                                    onChange={(e) => handleFilterChange('date', e.target.value)} />
                            </div>
                            <div className="col-md-4">
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
                        </div>
                    </div>
                </div>

                {/* Özet Kartlar */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Personel</h6>
                                <h3 className="mb-0 fw-bold">{dailyReport.total_employees || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-success">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Devam Eden</h6>
                                <h3 className="mb-0 fw-bold text-success">{dailyReport.present_count || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-danger">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Devam Dışı</h6>
                                <h3 className="mb-0 fw-bold text-danger">{dailyReport.absent_count || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-info">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Ortalama</h6>
                                <h3 className="mb-0 fw-bold text-info">{dailyReport.average_attendance_rate || 0}%</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-users me-2"></i>Personel Devam Kayıtları</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Personel</th>
                                        <th>Durum</th>
                                        <th>Giriş</th>
                                        <th>Çıkış</th>
                                        <th className="text-end">Toplam Saat</th>
                                        <th className="text-end">Fazla Mesai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dailyReport.daily_data && dailyReport.daily_data.length > 0 ? (
                                        dailyReport.daily_data.map((entry, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="fw-semibold">{entry.employee?.first_name} {entry.employee?.last_name}</div>
                                                    <div className="small text-muted">{entry.employee?.position_title}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        entry.status === 'present' ? 'bg-success' :
                                                        entry.status === 'absent' ? 'bg-danger' :
                                                        entry.status === 'late' ? 'bg-warning' : 'bg-secondary'
                                                    }`}>
                                                        {entry.status === 'present' ? 'Devrede' :
                                                         entry.status === 'absent' ? 'Devre Dışı' :
                                                         entry.status === 'late' ? 'Geç Giriş' : 'Diğer'}
                                                    </span>
                                                </td>
                                                <td>{entry.clock_in ? entry.clock_in.substring(0, 5) : '-'}</td>
                                                <td>{entry.clock_out ? entry.clock_out.substring(0, 5) : '-'}</td>
                                                <td className="text-end">{entry.working_hours || '00:00'}</td>
                                                <td className={`text-end ${entry.overtime > 0 ? 'text-danger fw-semibold' : 'text-muted'}`}>
                                                    {entry.overtime || '0.0'} sa
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
                <div className="alert alert-info mt-4">
                    <i className="ti ti-info-circle me-2"></i>
                    <strong>Özet:</strong> {dailyReport.present_count || 0} personel devrede, {dailyReport.late_count || 0} geç geldi.
                    Ortalama çalışma: {(dailyReport.avg_working_hours || 0).toFixed(2)} saat.
                </div>
            </div>
        </AuthenticatedLayout>
    );
}