import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDate, formatCurrency } from '@/Utils/formatters';
import { showSuccess, showError, confirmDelete } from '@/Utils/sweetAlert';
import { getStatusBadgeClass } from '@/Utils/commonUtils';

export default function Show({ advance }) {
    const handleApprove = () => {
        confirmDelete('Bu avans talebini onaylamak istediğinizden emin misiniz?', () => {
            router.post(route('admin.advances.approve', advance.id), {}, {
                onSuccess: () => showSuccess('Avans talebi onaylandı.'),
                onError: () => showError('Avans talebi onaylanırken bir hata oluştu.'),
            });
        });
    };

    const handleReject = () => {
        const reason = prompt('Reddetme sebebini giriniz:');
        if (reason) {
            router.post(route('admin.advances.reject', advance.id), { reason }, {
                onSuccess: () => showSuccess('Avans talebi reddedildi.'),
                onError: () => showError('Avans talebi reddedilirken bir hata oluştu.'),
            });
        }
    };

    const handleMarkAsPaid = () => {
        confirmDelete('Bu avansın ödendiğini işaretlemek istediğinizden emin misiniz?', () => {
            router.post(route('admin.advances.markAsPaid', advance.id), {}, {
                onSuccess: () => showSuccess('Avans ödendi olarak işaretlendi.'),
                onError: () => showError('Avans ödenmiş olarak işaretlenirken bir hata oluştu.'),
            });
        });
    };

    const handleCancel = () => {
        confirmDelete('Bu avans talebini iptal etmek istediğinizden emin misiniz?', () => {
            router.post(route('admin.advances.cancel', advance.id), {}, {
                onSuccess: () => showSuccess('Avans talebi iptal edildi.'),
                onError: () => showError('Avans talebi iptal edilirken bir hata oluştu.'),
            });
        });
    };



    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Bekliyor',
            approved: 'Onaylandı',
            rejected: 'Reddedildi',
            paid: 'Ödendi',
            cancelled: 'İptal Edildi',
        };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: `Avans Talebi #${advance.id}`,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Avans Talepleri', url: route('admin.advances.index') },
                    { label: `#${advance.id}`, url: route('admin.advances.show', advance.id) },
                ],
                backUrl: route('admin.advances.index'),
            }}
        >
            <Head title={`Avans Talebi #${advance.id}`} />

            <div className="row">
                <div className="col-lg-8">
                    {/* Durum Card */}
                    <div className="card border-primary mb-4">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <span className={`badge ${getStatusBadgeClass(advance.status, 'advanced_request')} fs-6`}>
                                    {getStatusLabel(advance.status)}
                                </span>
                                <small className="text-muted ms-3">
                                    #{advance.id}
                                </small>
                            </div>
                            <div className="fs-3 fw-bold text-primary">
                                {formatCurrency(advance.amount)}
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Talep Bilgileri */}
                        <div className="col-md-6">
                            <div className="card border-light h-100">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0 fw-bold">
                                        <i className="ti ti-file-text me-1"></i> Talep Bilgileri
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <table className="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted">Durum:</td>
                                                <td className="text-end">
                                                    <span className={`badge ${getStatusBadgeClass(advance.status, 'advanced_request')}`}>
                                                        {getStatusLabel(advance.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Tutar:</td>
                                                <td className="text-end fw-bold">{formatCurrency(advance.amount)}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Talep Tarihi:</td>
                                                <td className="text-end">{formatDate(advance.requested_date)}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Nedeni:</td>
                                                <td className="text-end">{advance.reason || '-'}</td>
                                            </tr>
                                            {advance.notes && (
                                                <tr>
                                                    <td className="text-muted">Notlar:</td>
                                                    <td className="text-end">{advance.notes}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Çalışan Bilgileri */}
                        <div className="col-md-6">
                            <div className="card border-light h-100">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0 fw-bold">
                                        <i className="ti ti-user me-1"></i> Çalışan Bilgileri
                                    </h6>
                                </div>
                                <div className="card-body">
                                    {advance.employee ? (
                                        <table className="table table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted">Ad Soyad:</td>
                                                    <td className="text-end fw-medium">
                                                        {advance.employee.first_name} {advance.employee.last_name}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">E-Posta:</td>
                                                    <td className="text-end">{advance.employee.email || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Telefon:</td>
                                                    <td className="text-end">{advance.employee.phone || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Pozisyon:</td>
                                                    <td className="text-end">{advance.employee.position_title || '-'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-muted text-center py-3">Çalışan bilgisi bulunamadı</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reddetme Nedeni */}
                    {advance.rejection_reason && advance.status === 'rejected' && (
                        <div className="card border-danger mt-4">
                            <div className="card-header bg-danger text-white">
                                <h6 className="mb-0 fw-bold">
                                    <i className="ti ti-x me-1"></i> Reddetme Nedeni
                                </h6>
                            </div>
                            <div className="card-body">
                                <p className="mb-0 text-danger">{advance.rejection_reason}</p>
                            </div>
                        </div>
                    )}

                    {/* Ödeme Bilgileri */}
                    {advance.payment_date && (
                        <div className="card border-success mt-4">
                            <div className="card-header bg-success text-white">
                                <h6 className="mb-0 fw-bold">
                                    <i className="ti ti-coin me-1"></i> Ödeme Bilgileri
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Ödeme Tarihi:</span>
                                    <span className="fw-medium">{formatDate(advance.payment_date)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* İşlem Butonları */}
                    <div className="card mt-4">
                        <div className="card-body d-flex gap-2 justify-content-end">
                            {advance.status === 'pending' && (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        className="btn btn-success"
                                    >
                                        <i className="ti ti-check me-1"></i> Onayla
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="btn btn-danger"
                                    >
                                        <i className="ti ti-x me-1"></i> Reddet
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="btn btn-secondary"
                                    >
                                        <i className="ti ti-ban me-1"></i> İptal Et
                                    </button>
                                </>
                            )}
                            
                            {advance.status === 'approved' && (
                                <>
                                    <button
                                        onClick={handleMarkAsPaid}
                                        className="btn btn-primary"
                                    >
                                        <i className="ti ti-coin me-1"></i> Ödendi İşaretle
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="btn btn-secondary"
                                    >
                                        <i className="ti ti-ban me-1"></i> İptal Et
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sağ Panel */}
                <div className="col-lg-4">
                    <div className="card border-primary mb-4">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Talep Detayları
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Talep ID</label>
                                <div className="fw-bold">#{advance.id}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Oluşturulma Tarihi</label>
                                <div className="fw-medium">{formatDate(advance.created_at)}</div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Son Güncelleme</label>
                                <div className="fw-medium">{formatDate(advance.updated_at)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-info">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-help-circle me-1"></i> Yardım
                            </h6>
                        </div>
                        <div className="card-body">
                            <p className="mb-2 small">
                                <strong>Bekliyor:</strong> Talep onay bekliyor
                            </p>
                            <p className="mb-2 small">
                                <strong>Onaylandı:</strong> Talep onaylandı, ödeme bekleniyor
                            </p>
                            <p className="mb-0 small">
                                <strong>Ödendi:</strong> Avans ödendi olarak işaretlendi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
