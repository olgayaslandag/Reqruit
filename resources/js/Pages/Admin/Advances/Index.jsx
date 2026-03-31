import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency } from '@/Utils/formatters';

/**
 * Avans talepleri listesi
 * GET /admin/advances
 */
export default function Index({ advances, filters, pendingCount, approvedCount, rejectedCount }) {
    const { props } = usePage();
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    // Arama
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.advances.index'), {
            ...(statusFilter && { status: statusFilter }),
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre
    const handleFilterChange = (key, value) => {
        router.get(route('admin.advances.index'), {
            ...(key === 'status' ? { status: value } : { [key]: value }),
            search: searchTerm,
        }, { replace: true });
    };

    // Silme (iptal)
    const handleCancel = (id) => {
        confirmDelete('Bu avans talebini iptal etmek istediğinize emin misiniz?', () => {
            router.post(route('admin.advances.cancel', id), {}, {
                onSuccess: () => showSuccess('Avans talebi iptal edildi.'),
            });
        });
    };

    // Durum badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Beklemede', class: 'bg-warning bg-opacity-10 text-warning' },
            approved: { label: 'Onaylandı', class: 'bg-success bg-opacity-10 text-success' },
            rejected: { label: 'Reddedildi', class: 'bg-danger bg-opacity-10 text-danger' },
            cancelled: { label: 'İptal', class: 'bg-light text-dark' },
            paid: { label: 'Ödendi', class: 'bg-primary bg-opacity-10 text-info' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-light text-dark' };
        
        return (
            <span className={`px-2 py-1 fs-xs fw-medium rounded-pill ${config.class}`}>
                {config.label}
            </span>
        );
    };

    // Avans türü etiketi
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

    // Onayla
    const handleApprove = (id) => {
        confirmDelete('Bu avans talebini onaylamak istediğinize emin misiniz?', () => {
            router.post(route('admin.advances.approve', id), {}, {
                onSuccess: () => showSuccess('Avans onaylandı.'),
            });
        });
    };

    // Reddet
    const handleReject = (id) => {
        const reason = prompt('Reddetme nedeni:');
        if (reason) {
            router.post(route('admin.advances.reject', id), { reason }, {
                onSuccess: () => showSuccess('Avans reddedildi.'),
                onError: () => showError('İşlem sırasında hata oluştu.'),
            });
        }
    };

    // Ödendi işaretle
    const handleMarkAsPaid = (id) => {
        router.post(route('admin.advances.mark-as-paid', id), {}, {
            onSuccess: () => showSuccess('Avans ödendi olarak işaretlendi.'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Avans Talepleri
                    </h5>
                        <Link
                            href={route('admin.advances.create')}
                            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                        >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Talep
                    </Link>
                </div>
            }
        >
            <Head title="Avans Talepleri" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* İstatistikler */}
                    <div className="d-grid d-grid-cols-1 gap-3 mb-5">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Bekleyen</div>
                            <div className="fs-2 fw-bold text-warning">{pendingCount || 0}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Onaylanan</div>
                            <div className="fs-2 fw-bold text-success">{approvedCount || 0}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Reddedilen</div>
                            <div className="fs-2 fw-bold text-danger">{rejectedCount || 0}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Ödenen</div>
                            <div className="fs-2 fw-bold text-info">{advances?.data?.filter(a => a.status === 'paid').reduce((sum, a) => sum + parseFloat(a.amount), 0) || 0} TL</div>
                        </div>
                    </div>

                    {/* Arama ve Filtre */}
                    <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                        <form onSubmit={handleSearch} className="d-flex d-flex-wrap gap-3 align-items-end">
                            <div className="d-flex-1 min-w-[200px]">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Ara
                                </label>
                                <input className="form-control" type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Çalışan adı, TC Kimlik No..."
                                />
                            </div>

                            <div className="w-40">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Durum
                                </label>
                                <select className="form-control" value={statusFilter}
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

                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                            >
                                Ara
                            </button>
                        </form>
                    </div>

                    {/* Tablo */}
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                        <table className="w-100 divide-y divide-gray-200">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Çalışan
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Tür
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Tutar
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Taksit
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Talep Tarihi
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Durum
                                    </th>
                                    <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {advances?.data?.length > 0 ? (
                                    advances.data.map((advance) => (
                                        <tr key={advance.id} className="hover:table-light">
                                            <td className="px-4 py-3">
                                                <div className="fs-sm fw-medium text-dark">
                                                    {advance.employee_name}
                                                </div>
                                                <div className="fs-xs text-muted">
                                                    {advance.employee_identity_no}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="fs-sm text-dark">
                                                    {getTypeLabel(advance.type)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="fs-sm fw-bold text-dark">
                                                    {formatCurrency(advance.amount)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="fs-sm text-dark">
                                                    {advance.installments || 1} taksit
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {formatDate(advance.request_date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {getStatusBadge(advance.status)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Link
                                                        href={route('admin.advances.show', advance.id)}
                                                        className="p-1 text-muted hover:text-primary"
                                                        title="Görüntüle"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    
                                                    {advance.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(advance.id)}
                                                                className="p-1 text-success hover:text-success"
                                                                title="Onayla"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(advance.id)}
                                                                className="p-1 text-danger hover:text-danger"
                                                                title="Reddet"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    {advance.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleMarkAsPaid(advance.id)}
                                                            className="p-1 text-info hover:text-info"
                                                            title="Ödendi"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    
                                                    {advance.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancel(advance.id)}
                                                            className="p-1 text-muted hover:text-danger"
                                                            title="İptal"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center fs-sm text-muted">
                                            Avans talebi bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {advances?.meta && advances.meta.last_page > 1 && (
                        <div className="mt-4 d-flex justify-content-center">
                            <div className="d-flex gap-1">
                                {advances.meta.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 border rounded ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-dark hover:table-light'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={!link.url}
                                    >
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
