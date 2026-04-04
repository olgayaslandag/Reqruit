import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency } from '@/Utils/formatters';

export default function Index({ advances, filters, pendingCount, approvedCount, rejectedCount }) {
    const { props } = usePage();

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.advances.index'), {
            ...(statusFilter && { status: statusFilter }),
            search: searchTerm,
        }, { replace: true });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.advances.index'), {
            ...(key === 'status' ? { status: value } : { [key]: value }),
            search: searchTerm,
        }, { replace: true });
    };

    const handleCancel = (id) => {
        confirmDelete('Bu avans talebini iptal etmek istediğinize emin misiniz?', () => {
            router.post(route('admin.advances.cancel', id), {}, {
                onSuccess: () => showSuccess('Avans talebi iptal edildi.'),
            });
        });
    };

    const handleApprove = (id) => {
        confirmDelete('Bu avans talebini onaylamak istediğinize emin misiniz?', () => {
            router.post(route('admin.advances.approve', id), {}, {
                onSuccess: () => showSuccess('Avans onaylandı.'),
            });
        });
    };

    const handleReject = (id) => {
        const reason = prompt('Reddetme nedeni:');
        if (reason) {
            router.post(route('admin.advances.reject', id), { reason }, {
                onSuccess: () => showSuccess('Avans reddedildi.'),
                onError: () => showError('İşlem sırasında hata oluştu.'),
            });
        }
    };

    const handleMarkAsPaid = (id) => {
        router.post(route('admin.advances.mark-as-paid', id), {}, {
            onSuccess: () => showSuccess('Avans ödendi olarak işaretlendi.'),
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'approved': return 'bg-success';
            case 'rejected': return 'bg-danger';
            case 'cancelled': return 'bg-secondary';
            case 'paid': return 'bg-primary';
            default: return 'bg-light text-dark';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Beklemede',
            approved: 'Onaylandı',
            rejected: 'Reddedildi',
            cancelled: 'İptal',
            paid: 'Ödendi',
        };
        return labels[status] || status;
    };

    const getTypeLabel = (type) => {
        const types = {
            salary: 'Maaş Avansı',
            emergency: 'Acil Durum',
            education: 'Eğitim',
            housing: 'Konut',
            other: 'Diğer',
        };
        return types[type] || type;
    };

    // Array kontrolü
    const advancesArray = Array.isArray(advances) ? advances : (advances?.data || []);
    
    // Toplam ödenen tutar
    const totalPaid = advancesArray
        .filter(a => a.status === 'paid')
        .reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Avans Talepleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Avans Talepleri', url: route('admin.advances.index') },
                ],
                newUrl: route('admin.advances.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Avans Talepleri" />

            {/* Collapse Filtre Paneli */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-search me-1"></i> Ara
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Çalışan adı, TC Kimlik No..."
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
                                        <option value="pending">Beklemede</option>
                                        <option value="approved">Onaylandı</option>
                                        <option value="rejected">Reddedildi</option>
                                        <option value="cancelled">İptal</option>
                                        <option value="paid">Ödendi</option>
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
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <i className="ti ti-clock fs-2 text-warning mb-2"></i>
                            <h6 className="text-warning fw-medium">Bekleyen</h6>
                            <h3 className="fw-bold text-warning">{pendingCount || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-check fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Onaylanan</h6>
                            <h3 className="fw-bold text-success">{approvedCount || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-danger">
                        <div className="card-body text-center">
                            <i className="ti ti-x fs-2 text-danger mb-2"></i>
                            <h6 className="text-danger fw-medium">Reddedilen</h6>
                            <h3 className="fw-bold text-danger">{rejectedCount || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <i className="ti ti-coin fs-2 text-info mb-2"></i>
                            <h6 className="text-info fw-medium">Ödenen Toplam</h6>
                            <h4 className="fw-bold text-info">{formatCurrency(totalPaid)}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Avans Tablosu */}
            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-hand-finger me-2"></i> Avans Talepleri Listesi
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Çalışan</th>
                                    <th className="fw-medium">Tür</th>
                                    <th className="fw-medium text-end">Tutar</th>
                                    <th className="fw-medium text-center">Taksit</th>
                                    <th className="fw-medium">Talep Tarihi</th>
                                    <th className="fw-medium text-center">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {advancesArray.length > 0 ? (
                                    advancesArray.map((advance) => (
                                        <tr key={advance.id}>
                                            <td>
                                                <div className="fw-medium">{advance.employee_name}</div>
                                                <small className="text-muted">{advance.employee_identity_no}</small>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border">
                                                    {getTypeLabel(advance.type)}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <span className="fw-bold">{formatCurrency(advance.amount)}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-secondary">{advance.installments || 1} taksit</span>
                                            </td>
                                            <td>
                                                <span className="text-dark">{formatDate(advance.request_date)}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(advance.status)}`}>
                                                    {getStatusLabel(advance.status)}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Link
                                                        href={route('admin.advances.show', advance.id)}
                                                        className="btn btn-sm btn-outline-info"
                                                        title="Görüntüle"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Link>

                                                    {advance.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(advance.id)}
                                                                className="btn btn-sm btn-outline-success"
                                                                title="Onayla"
                                                            >
                                                                <i className="ti ti-check"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(advance.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Reddet"
                                                            >
                                                                <i className="ti ti-x"></i>
                                                            </button>
                                                        </>
                                                    )}

                                                    {advance.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleMarkAsPaid(advance.id)}
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Ödendi"
                                                        >
                                                            <i className="ti ti-coin"></i>
                                                        </button>
                                                    )}

                                                    {advance.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancel(advance.id)}
                                                            className="btn btn-sm btn-outline-secondary"
                                                            title="İptal"
                                                        >
                                                            <i className="ti ti-ban"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            <i className="ti ti-hand-finger-off fs-1 d-block mb-2"></i>
                                            Avans talebi bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {advances?.meta && advances.meta.last_page > 1 && (
                    <div className="card-footer bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-muted">
                                    {advances.meta.from} - {advances.meta.to} arası, toplam {advances.meta.total} öğe
                                </small>
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    {advances.meta.links.filter(link => link.url).map((link, index) => (
                                        <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                                            <Link
                                                href={link.url}
                                                className="page-link"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
                                                }}
                                            />
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
