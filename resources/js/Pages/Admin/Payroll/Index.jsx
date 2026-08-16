import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency, formatMonthYear } from '@/Utils/formatters';

export default function Index({ payrollPeriods, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.payrolls.index'), {
            ...(statusFilter && { status: statusFilter }),
            search: searchTerm,
        }, { replace: true, only: ['payrollPeriods', 'filters'] });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.payrolls.index'), {
            ...(key === 'status' ? { status: value } : { [key]: value }),
            search: searchTerm,
        }, { replace: true, only: ['payrollPeriods', 'filters'] });
    };

    const handleDelete = (id) => {
        confirmDelete('Bu bordro dönemini silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.payrolls.destroy', id), {
                onSuccess: () => showSuccess('Bordro dönemi başarıyla silindi.'),
            });
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'draft': return 'bg-light text-dark border';
            case 'pending': return 'bg-warning text-dark';
            case 'approved': return 'bg-success';
            case 'paid': return 'bg-primary';
            case 'locked': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Taslak',
            pending: 'Beklemede',
            approved: 'Onaylandı',
            paid: 'Ödendi',
            locked: 'Kilitli',
        };
        return labels[status] || status;
    };

    // İstatistikler
    const payrollArray = Array.isArray(payrollPeriods) ? payrollPeriods : (payrollPeriods?.data || []);
    const stats = {
        total: payrollArray.length || 0,
        draft: payrollArray.filter(p => p.status === 'draft').length || 0,
        approved: payrollArray.filter(p => p.status === 'approved').length || 0,
        paid: payrollArray.filter(p => p.status === 'paid').length || 0,
        totalGross: payrollArray.reduce((sum, p) => sum + (parseFloat(p.total_gross) || 0), 0),
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Bordro Dönemleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Bordro Dönemleri', url: route('admin.payrolls.index') },
                ],
                newUrl: route('admin.payrolls.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Bordro Dönemleri" />

            {/* Collapse Filtre Paneli */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-search me-1"></i> Dönem Ara
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Dönem adı..."
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-toggle-right me-1"></i> Durum
                                    </label>
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            handleFilterChange('status', e.target.value);
                                        }}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="draft">Taslak</option>
                                        <option value="pending">Beklemede</option>
                                        <option value="approved">Onaylandı</option>
                                        <option value="paid">Ödendi</option>
                                        <option value="locked">Kilitli</option>
                                    </select>
                                </div>

                                <div className="col-md-2 d-flex align-items-end">
                                    <button type="submit" className="btn btn-primary w-100">
                                        <i className="ti ti-filter me-1"></i> Filtrele
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <i className="ti ti-calendar fs-2 text-primary mb-2"></i>
                            <h6 className="text-primary fw-medium">Toplam Dönem</h6>
                            <h3 className="fw-bold text-primary">{stats.total}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-light">
                        <div className="card-body text-center">
                            <i className="ti ti-file fs-2 text-secondary mb-2"></i>
                            <h6 className="text-secondary fw-medium">Taslak</h6>
                            <h3 className="fw-bold text-secondary">{stats.draft}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-check fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Onaylanan</h6>
                            <h3 className="fw-bold text-success">{stats.approved}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <i className="ti ti-coin fs-2 text-info mb-2"></i>
                            <h6 className="text-info fw-medium">Ödenen</h6>
                            <h3 className="fw-bold text-info">{stats.paid}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toplam Brüt Card */}
            <div className="card border-primary mb-4">
                <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="text-primary fw-medium mb-1">
                            <i className="ti ti-calculator me-2"></i> Toplam Brüt Ücret
                        </h6>
                        <h3 className="fw-bold text-primary">{formatCurrency(stats.totalGross)}</h3>
                    </div>
                    <div className="bg-primary bg-opacity-10 rounded p-3">
                        <i className="ti ti-moneybag fs-1 text-primary"></i>
                    </div>
                </div>
            </div>

            {/* Bordro Tablosu */}
            <div className="card">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-calendar-event me-2"></i> Bordro Dönemleri Listesi
                    </h5>
                    <Link href={route('admin.payrolls.create')} className="btn btn-primary btn-sm">
                        <i className="ti ti-plus me-1"></i> Yeni Dönem
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Dönem</th>
                                    <th className="fw-medium">Tarih Aralığı</th>
                                    <th className="fw-medium text-center">Çalışma Günü</th>
                                    <th className="fw-medium text-center">Çalışan</th>
                                    <th className="fw-medium text-end">Toplam Brüt</th>
                                    <th className="fw-medium text-center">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrollArray.length > 0 ? (
                                    payrollArray.map((period) => (
                                        <tr key={period.id}>
                                            <td>
                                                <Link
                                                    href={route('admin.payrolls.show', period.id)}
                                                    className="fw-medium text-primary"
                                                >
                                                    {period.name}
                                                </Link>
                                                <small className="text-muted d-block">
                                                    {formatMonthYear(period.start_date)}
                                                </small>
                                            </td>
                                            <td>
                                                <span className="text-dark">
                                                    {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-light text-dark border">
                                                    {period.work_days || 0} gün
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-info">
                                                    {period.employee_count || 0}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <span className="fw-medium">
                                                    {formatCurrency(period.total_gross)}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(period.status)}`}>
                                                    {getStatusLabel(period.status)}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Link
                                                        href={route('admin.payrolls.show', period.id)}
                                                        className="btn btn-sm btn-outline-info"
                                                        title="Görüntüle"
                                                        aria-label="Görüntüle"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Link>

                                                    {period.status === 'draft' && (
                                                        <>
                                                            <Link
                                                                href={route('admin.payrolls.edit', period.id)}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="Düzenle"
                                                                aria-label="Düzenle"
                                                            >
                                                                <i className="ti ti-edit"></i>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(period.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Sil"
                                                                aria-label="Sil"
                                                            >
                                                                <i className="ti ti-trash"></i>
                                                            </button>
                                                        </>
                                                    )}

                                                    {['pending', 'approved'].includes(period.status) && (
                                                        <Link
                                                            href={route('admin.payrolls.approve', period.id)}
                                                            className="btn btn-sm btn-outline-success"
                                                            title="Onayla"
                                                            aria-label="Onayla"
                                                        >
                                                            <i className="ti ti-check"></i>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">
                                            <EmptyState
                                                title="Bordro dönemi bulunamadı"
                                                description={filters.search || filters.start_year ? 
                                                    "Aradığınız kriterlere uygun bordro dönemi bulunamadı." : 
                                                    "Henüz hiç bordro dönemi oluşturulmamış. İlk döneminizi oluşturmak için aşağıdaki butona tıklayabilirsiniz."
                                                }
                                                icon={<i className="ti ti-calendar-off"></i>}
                                                actionUrl={filters.search || filters.start_year ?
                                                    route('admin.payrolls.index') :
                                                    route('admin.payrolls.create')
                                                }
                                                linkText={filters.search || filters.start_year ?
                                                    "Filtreleri Temizle" :
                                                    "Yeni Bordro Dönemi Oluştur"
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {payrollPeriods?.meta && payrollPeriods.meta.last_page > 1 && (
                    <div className="card-footer bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-muted">
                                    {payrollPeriods.meta.from} - {payrollPeriods.meta.to} arası, toplam {payrollPeriods.meta.total} öğe
                                </small>
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    {payrollPeriods.meta.links.filter(link => link.url).map(link => (
                                        <li key={link.url || link.label} className={`page-item ${link.active ? 'active' : ''}`}>
                                            <Link
                                                href={link.url}
                                                className="page-link"
                                                data={{ only: ['payrollPeriods', 'filters'] }}
                                            >
                                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
