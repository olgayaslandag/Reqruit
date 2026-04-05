import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmptyState from '@/Components/EmptyState';
import { showError, showSuccess, confirmAction } from '@/Utils/sweetAlert';
import { getStatusBadgeClass, getTypeBadgeClass } from '@/Utils/commonUtils';
import { formatDate, formatTime } from '@/Utils/attendanceHelpers';
import { useFlashWithToast } from '@/Hooks/useFlash';

export default function Index({ adjustments, filters = {} }) {
    const flash = useFlashWithToast();

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || '',
        type: filters?.type || ''
    });

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.adjustments.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true, only: ['adjustments', 'filters'] });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.adjustments.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true, only: ['adjustments', 'filters'] });
    };

    // Talebi Güncelle (Approve/Reject)
    const updateAdjustmentStatus = (id, status) => {
        router.put(route('admin.adjustments.update-status', id), { status }, {
            onSuccess: () => {
                const actionName = status === 'approved' ? 'onaylandı' : 'reddedildi';
                showSuccess(`Düzeltme talebi ${actionName}.`);
            },
            onError: () => showError('Düzeltme talebi güncellenirken bir hata oluştu.')
        });
    };

    // Yeni Düzeltme Talebi Başlat
    const requestNewAdjustment = () => {
        router.get(route('admin.adjustments.create'));
    };



    const getTypeLabel = (type) => {
        switch (type) {
            case 'clock_in':
                return 'Giriş Saati';
            case 'clock_out':
                return 'Çıkış Saati';
            case 'both':
                return 'Giriş+Çıkış';
            default:
                return 'Süre Düzeltmesi';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning text-dark';
            case 'approved':
                return 'bg-success';
            case 'rejected':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return 'Bekliyor';
            case 'approved':
                return 'Onaylandı';
            case 'rejected':
                return 'Reddedildi';
            default:
                return 'İptal';
        }
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Düzeltme Talepleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Düzeltme Talepleri', url: route('admin.adjustments.index') },
                ],
                newUrl: route('admin.adjustments.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Devam Düzeltme Talepleri" />

            {/* Collapse Filter Panel */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-medium">Arama</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Personel adı, açıklama..."
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-medium">Durum</label>
                                    <select
                                        className="form-select"
                                        value={localFilters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="pending">Bekliyor</option>
                                        <option value="approved">Onaylandı</option>
                                        <option value="rejected">Reddedildi</option>
                                        <option value="cancelled">İptal Edildi</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-medium">Tür</label>
                                    <select
                                        className="form-select"
                                        value={localFilters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="clock_in">Giriş Düzeltmesi</option>
                                        <option value="clock_out">Çıkış Düzeltmesi</option>
                                        <option value="both">Giriş ve Çıkış Düzeltmesi</option>
                                        <option value="duration">Çalışma Süresi Düzeltmesi</option>
                                    </select>
                                </div>

                                <div className="col-md-2 d-flex align-items-end">
                                    <button type="submit" className="btn btn-primary w-100">
                                        <i className="ti ti-search me-1"></i> Ara
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
                            <h6 className="text-warning fw-medium">Bekliyor</h6>
                            <h3 className="fw-bold text-warning">
                                {adjustments?.data?.filter(a => a.status === 'pending').length || 0}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <h6 className="text-success fw-medium">Onaylandı</h6>
                            <h3 className="fw-bold text-success">
                                {adjustments?.data?.filter(a => a.status === 'approved').length || 0}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-danger">
                        <div className="card-body text-center">
                            <h6 className="text-danger fw-medium">Reddedildi</h6>
                            <h3 className="fw-bold text-danger">
                                {adjustments?.data?.filter(a => a.status === 'rejected').length || 0}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <h6 className="text-info fw-medium">Toplam</h6>
                            <h3 className="fw-bold text-info">
                                {adjustments?.data?.length || 0}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-calendar-time me-2"></i> Düzeltme Talepleri Listesi
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Personel</th>
                                    <th className="fw-medium">Tarih</th>
                                    <th className="fw-medium">Değişim Türü</th>
                                    <th className="fw-medium">Orijinal Saat</th>
                                    <th className="fw-medium">Yeni Saat</th>
                                    <th className="fw-medium">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adjustments?.data && adjustments.data.length > 0 ? (
                                    adjustments.data.map((adjustment) => (
                                        <tr key={adjustment.id}>
                                            <td>
                                                <div className="fw-medium">
                                                    {adjustment.employee?.first_name} {adjustment.employee?.last_name}
                                                </div>
                                                <small className="text-muted">
                                                    {adjustment.employee?.identity_no}
                                                </small>
                                            </td>
                                            <td>
                                                <div className="fw-medium">
                                                    {new Date(adjustment.adjustment_date || adjustment.date).toLocaleDateString('tr-TR')}
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(adjustment.created_at).toLocaleTimeString('tr-TR')}
                                                </small>
                                            </td>
                                            <td>
                                                <span className={`badge ${getTypeBadgeClass(adjustment.type)}`}>
                                                    {getTypeLabel(adjustment.type)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-medium">
                                                    {adjustment.from_time || adjustment.original_clock_in || '-'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-medium">
                                                    {adjustment.to_time || adjustment.new_clock_in || '-'}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(adjustment.status, 'advanced_request')}`}>
                                                    {getStatusLabel(adjustment.status)}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link
                                                        href={route('admin.adjustments.show', adjustment.id)}
                                                        className="btn btn-sm btn-outline-info"
                                                    >
                                                        <i className="ti ti-eye me-1"></i> Görüntüle
                                                    </Link>

                                                    {adjustment.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateAdjustmentStatus(adjustment.id, 'approved')}
                                                                className="btn btn-sm btn-outline-success"
                                                            >
                                                                <i className="ti ti-check me-1"></i> Onayla
                                                            </button>
                                                            <button
                                                                onClick={() => updateAdjustmentStatus(adjustment.id, 'rejected')}
                                                                className="btn btn-sm btn-outline-danger"
                                                            >
                                                                <i className="ti ti-x me-1"></i> Reddet
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">
                                            <EmptyState
                                                title="Devam düzeltme talebi bulunamadı"
                                                description={filters.search || filters.status || filters.type ? 
                                                    "Aradığınız kriterlere uygun devam düzeltme talebi bulunamadı." : 
                                                    "Henüz hiç devam düzeltme talebi oluşturulmamış. Yeni bir talep başlatmak için aşağıdaki linki kullanabilirsiniz."
                                                }
                                                icon={<i className="ti ti-adjustments-alt"></i>}
                                                actionUrl={filters.search || filters.status || filters.type ?
                                                    route('admin.adjustments.index') :
                                                    route('admin.adjustments.create')
                                                }
                                                linkText={filters.search || filters.status || filters.type ?
                                                    "Filtreleri Temizle" :
                                                    "Yeni Düzeltme Talebi Başlat"
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
                {adjustments?.meta && adjustments.meta.last_page > 1 && (
                    <div className="card-footer bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-muted">
                                    {adjustments.meta.from} - {adjustments.meta.to} arası, toplam {adjustments.meta.total} öğe
                                </small>
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    {adjustments.meta.links.filter(link => link.url).map(link => (
                                        <li key={link.url || link.label} className={`page-item ${link.active ? 'active' : ''}`}>
                                            <Link
                                                href={link.url}
                                                className="page-link"
                                                data={{ only: ['adjustments', 'filters'] }}
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
