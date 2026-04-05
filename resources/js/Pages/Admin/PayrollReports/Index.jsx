import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDate } from '@/Utils/formatters';
import { useState } from 'react';

export default function Index({ periods, filters }) {
    const PAYROLL_STATUSES = [
        { value: 'published', label: 'Yayınlanmış' },
        { value: 'draft', label: 'Taslak' },
        { value: 'manager_approved', label: 'Yönetici Onayladı' },
        { value: 'hr_approved', label: 'İK Onayladı' },
        { value: 'accounting_approved', label: 'Muhasebe Onayladı' },
        { value: '', label: 'Tümü' },
    ];

    const [filterStatus, setFilterStatus] = useState(filters?.status !== undefined ? filters.status : 'published');
    const [filterStartDate, setFilterStartDate] = useState(filters?.start_date || '');
    const [filterEndDate, setFilterEndDate] = useState(filters?.end_date || '');

    const applyFilters = () => {
        const params = { status: filterStatus };
        if (filterStartDate) params.start_date = filterStartDate;
        if (filterEndDate) params.end_date = filterEndDate;
        router.get(route('admin.payroll-reports.index'), params);
    };

    const resetFilters = () => {
        setFilterStatus('published');
        setFilterStartDate('');
        setFilterEndDate('');
        router.get(route('admin.payroll-reports.index'));
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'bg-secondary',
            manager_approved: 'bg-info',
            hr_approved: 'bg-primary',
            accounting_approved: 'bg-warning',
            published: 'bg-success',
        };
        return badges[status] || 'bg-secondary';
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Bordro Raporları',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro Raporları', url: route('admin.payroll-reports.index') },
                ],
                filterCollapse: 'filterCollapse',
            }}
        >
            <Head title="Bordro Raporları" />

            <div className="container-fluid py-4">
                {/* Filtre Paneli */}
                <div className="card collapse mb-4" id="filterCollapse">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Durum</label>
                                <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    {PAYROLL_STATUSES.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Başlangıç Tarihi</label>
                                <input type="date" className="form-control" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Bitiş Tarihi</label>
                                <input type="date" className="form-control" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
                            </div>
                            <div className="col-12">
                                <button type="button" className="btn btn-primary me-2" onClick={applyFilters}>
                                    <i className="ti ti-search"></i> Filtrele
                                </button>
                                <button type="button" className="btn btn-outline-secondary" onClick={resetFilters}>
                                    Sıfırla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Genel Raporlar */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Genel Raporlar</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <Link
                                            href={route('admin.payroll-reports.compare')}
                                            className="btn btn-outline-primary w-100 p-3"
                                        >
                                            <i className="ti ti-arrows-left-right me-2"></i>
                                            <strong>Dönem Karşılaştırma</strong>
                                            <div className="small text-muted">Farklı dönemlerin maaş ve bordro verilerini karşılaştırın</div>
                                        </Link>
                                    </div>
                                    <div className="col-md-6">
                                        <Link
                                            href={route('admin.payroll-reports.annual')}
                                            className="btn btn-outline-primary w-100 p-3"
                                        >
                                            <i className="ti ti-calendar me-2"></i>
                                            <strong>Yıllık Özet</strong>
                                            <div className="small text-muted">Yıl bazında maaş ve kesintileri görüntüleyin</div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dönem Bazlı Raporlar */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h6 className="mb-0">Dönemler</h6>
                            </div>
                            <div className="card-body p-0 payroll-report-container">
                                {periods && periods.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {periods.map((period) => (
                                            <Link
                                                key={period.id}
                                                href={route('admin.payroll-reports.summary', period.id)}
                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <div className="fw-semibold">{period.name}</div>
                                                    <div className="small text-muted">
                                                        {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                                    </div>
                                                </div>
                                                <span className={`badge ${getStatusBadge(period.status)}`}>
                                                    {period.status}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 text-muted text-center">Dönem bulunmuyor</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card h-100">
                            <div className="card-header">
                                <h6 className="mb-0">Hızlı Rapor Erişimi</h6>
                            </div>
                            <div className="card-body">
                                {periods && periods.length > 0 ? (
                                    <div className="row g-3 text-center">
                                        <div className="col-4">
                                            <Link
                                                href={route('admin.payroll-reports.summary', periods[0]?.id)}
                                                className="btn btn-success btn-lg"
                                            >
                                                <i className="ti ti-chart-bar fs-1 d-block mb-2"></i>
                                                <div className="small">Özet Rapor</div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link
                                                href={route('admin.payroll-reports.taxSummary', periods[0]?.id)}
                                                className="btn btn-warning btn-lg"
                                            >
                                                <i className="ti ti-receipt fs-1 d-block mb-2"></i>
                                                <div className="small">Vergi ve SGK</div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link
                                                href={route('admin.payroll-reports.departmentSummary', periods[0]?.id)}
                                                className="btn btn-info btn-lg"
                                            >
                                                <i className="ti ti-building fs-1 d-block mb-2"></i>
                                                <div className="small">Departman</div>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-5">
                                        <i className="ti ti-info-circle fs-1 mb-2 d-block"></i>
                                        <div>Rapor görüntülemek için yayınlanmış dönem bulunmalıdır</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}