import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ statistics = {}, reportsSummary = {}, filters = {}, employees = [] }) {
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
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                ],
            }}
        >
            <Head title="Devam Raporları" />

            <div className="container-fluid py-4">
                {/* İstatistik Kartları */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card border-success">
                            <div className="card-body text-center">
                                <i className="ti ti-check fs-1 text-success mb-2 d-block"></i>
                                <h6 className="text-muted mb-1">Devam Eden</h6>
                                <h3 className="mb-0 fw-bold">{statistics.present_count || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-danger">
                            <div className="card-body text-center">
                                <i className="ti ti-x fs-1 text-danger mb-2 d-block"></i>
                                <h6 className="text-muted mb-1">Devam Dışı</h6>
                                <h3 className="mb-0 fw-bold">{statistics.absent_count || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-warning">
                            <div className="card-body text-center">
                                <i className="ti ti-clock fs-1 text-warning mb-2 d-block"></i>
                                <h6 className="text-muted mb-1">Geç Kalan</h6>
                                <h3 className="mb-0 fw-bold">{statistics.late_count || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-primary">
                            <div className="card-body text-center">
                                <i className="ti ti-bolt fs-1 text-primary mb-2 d-block"></i>
                                <h6 className="text-muted mb-1">Fazla Mesai</h6>
                                <h3 className="mb-0 fw-bold">{statistics.overtime_duration || '00:00'} sa</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rapor Türleri */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0"><i className="ti ti-chart-bar me-2"></i>Rapor Türleri</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <Link href={route('admin.attendance-reports.daily')} className="btn btn-primary w-100 p-3">
                                            <i className="ti ti-calendar-event fs-2 d-block mb-2"></i>
                                            <strong>Günlük Rapor</strong>
                                        </Link>
                                    </div>
                                    <div className="col-md-3">
                                        <Link href={route('admin.attendance-reports.monthly')} className="btn btn-success w-100 p-3">
                                            <i className="ti ti-calendar-stats fs-2 d-block mb-2"></i>
                                            <strong>Aylık Rapor</strong>
                                        </Link>
                                    </div>
                                    <div className="col-md-3">
                                        <Link href={route('admin.attendance-reports.overtime')} className="btn btn-warning w-100 p-3">
                                            <i className="ti ti-bolt fs-2 d-block mb-2"></i>
                                            <strong>Fazla Mesai</strong>
                                        </Link>
                                    </div>
                                    <div className="col-md-3">
                                        <Link href={route('admin.attendance-reports.export')} className="btn btn-info w-100 p-3">
                                            <i className="ti ti-download fs-2 d-block mb-2"></i>
                                            <strong>İhracat</strong>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtreleme */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0"><i className="ti ti-filter me-2"></i>Filtreleme</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Zaman Aralığı</label>
                                        <select className="form-select" value={reportFilters.period}
                                            onChange={(e) => setReportFilters({...reportFilters, period: e.target.value})}
                                        >
                                            <option value="current_day">Bugün</option>
                                            <option value="current_week">Bu Hafta</option>
                                            <option value="current_month">Bu Ay</option>
                                            <option value="last_30_days">Son 30 Gün</option>
                                            <option value="custom">Özel Tarih</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Personel</label>
                                        <select className="form-select" value={reportFilters.employee_id}
                                            onChange={(e) => setReportFilters({...reportFilters, employee_id: e.target.value})}
                                        >
                                            <option value="">Tümü</option>
                                            {employees?.map((emp) => (
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}