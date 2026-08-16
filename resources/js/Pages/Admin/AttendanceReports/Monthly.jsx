import { useMemo, useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ReactApexChart from 'react-apexcharts';

export default function Monthly({ monthlyReport = {}, filters = {}, employees = [] }) {
    const [localFilters, setLocalFilters] = useState({
        year: filters?.year || new Date().getFullYear(),
        month: filters?.month || String(new Date().getMonth() + 1).padStart(2, '0'),
        employee_id: filters?.employee_id || ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.attendance-reports.monthly'), newFilters, { replace: true });
    };

    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const attendanceData = monthlyReport.chart_data || [];

    const monthlyChartOptions = useMemo(() => ({
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '55%',
            },
        },
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
        xaxis: {
            categories: attendanceData.map((item) => item.day),
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { min: 0 },
        colors: ['#3b82f6', '#f59e0b'],
        grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
    }), [attendanceData]);

    const monthlyChartSeries = useMemo(
        () => [
            { name: 'Çalışma', data: attendanceData.map((item) => item.worked_hours ?? 0) },
            { name: 'Fazla Mesai', data: attendanceData.map((item) => item.overtime ?? 0) },
        ],
        [attendanceData],
    );

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Aylık Devam Raporu',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                    { label: 'Aylık Rapor', url: '#' },
                ],
                backUrl: route('admin.attendance-reports.index'),
            }}
        >
            <Head title="Aylık Devam Raporu" />

            <div className="container-fluid py-4">
                {/* Filtreleme */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Yıl</label>
                                <select className="form-select" value={localFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}>
                                    {Array.from({length: 5}, (_, i) => {
                                        const year = new Date().getFullYear() - 2 + i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Ay</label>
                                <select className="form-select" value={localFilters.month}
                                    onChange={(e) => handleFilterChange('month', e.target.value)}>
                                    {months.map((m, i) => (
                                        <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                                    ))}
                                </select>
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
                                <h6 className="text-muted mb-2">İş Günü</h6>
                                <h3 className="mb-0 fw-bold">{monthlyReport.total_workdays || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-success">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Devam Oranı</h6>
                                <h3 className="mb-0 fw-bold text-success">{monthlyReport.attendance_rate || 0}%</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-info">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Ort. Mesai</h6>
                                <h3 className="mb-0 fw-bold text-info">{monthlyReport.avg_overtime || 0} sa</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-warning">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Mesai</h6>
                                <h3 className="mb-0 fw-bold text-warning">{monthlyReport.total_overtime || 0} sa</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafik */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-chart-bar me-2"></i>Aylık Grafik</h5>
                    </div>
                    <div className="card-body">
                        <div className="graph-height">
                            <ReactApexChart options={monthlyChartOptions} series={monthlyChartSeries} type="bar" height={300} />
                        </div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-list me-2"></i>Günlük Detay</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Tarih</th>
                                        <th>Giriş</th>
                                        <th>Çıkış</th>
                                        <th className="text-end">Saat</th>
                                        <th className="text-end">Mesai</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyReport.daily_details && monthlyReport.daily_details.length > 0 ? (
                                        monthlyReport.daily_details.map((dayEntry, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="fw-semibold">
                                                        {new Date(dayEntry.date).toLocaleDateString('tr-TR')}
                                                    </div>
                                                </td>
                                                <td>{dayEntry.clock_in ? new Date(dayEntry.clock_in).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                                <td>{dayEntry.clock_out ? new Date(dayEntry.clock_out).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                                <td className="text-end">{dayEntry.working_hours || '00:00'}</td>
                                                <td className="text-end">{dayEntry.overtime || '0.0'} sa</td>
                                                <td>
                                                    <span className={`badge ${
                                                        dayEntry.status === 'present' ? 'bg-success' :
                                                        dayEntry.status === 'absent' ? 'bg-danger' :
                                                        dayEntry.status === 'late' ? 'bg-warning' :
                                                        dayEntry.status === 'on_leave' ? 'bg-info' : 'bg-secondary'
                                                    }`}>
                                                        {dayEntry.status === 'present' ? 'Devrede' :
                                                         dayEntry.status === 'absent' ? 'Devre Dışı' :
                                                         dayEntry.status === 'late' ? 'Geç Giriş' :
                                                         dayEntry.status === 'on_leave' ? 'İzinli' : 'Diğer'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6} className="text-center text-muted py-4">Veri bulunamadı</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Notlar */}
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="alert alert-info">
                            <i className="ti ti-info-circle me-2"></i>
                            <strong>Özet:</strong> {monthlyReport.total_workdays || 0} iş günü içinde {monthlyReport.attendance_days || 0} gün çalışılmış.
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="alert alert-warning">
                            <i className="ti ti-alert-triangle me-2"></i>
                            <strong>Dikkat:</strong> {monthlyReport.late_arrivals || 0} geç giriş, {monthlyReport.absences || 0} devamsızlık.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}