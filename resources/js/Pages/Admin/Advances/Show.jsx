import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDate, formatCurrency } from '@/Utils/formatters';
import { showSuccess, showError } from '@/Utils/sweetAlert';

export default function Show({ advance }) {
    const handleApprove = () => {
        if (confirm('Bu avans talebini onaylamak istediğinizden emin misiniz?')) {
            router.post(route('admin.advances.approve', advance.id), {
                onSuccess: () => showSuccess('Avans talebi onaylandı.'),
                onError: () => showError('Avans talebi onaylanırken bir hata oluştu.'),
            });
        }
    };

    const handleReject = (reason) => {
        if (reason = prompt('Reddetme sebebini giriniz:')) {
            router.post(route('admin.advances.reject', advance.id), {
                reason: reason,
                onSuccess: () => showSuccess('Avans talebi reddedildi.'),
                onError: () => showError('Avans talebi reddedilirken bir hata oluştu.'),
            });
        }
    };

    const handleMarkAsPaid = () => {
        if (confirm('Bu avansın ödendiğini işaretlemek istediğinizden emin misiniz?')) {
            router.post(route('admin.advances.markAsPaid', advance.id), {
                onSuccess: () => showSuccess('Avans ödendi olarak işaretlendi.'),
                onError: () => showError('Avans ödenmis olarak işaretlenirken bir hata oluştu.'),
            });
        }
    };

    const handleCancel = () => {
        if (confirm('Bu avans talebini iptal etmek istediğinizden emin misiniz?')) {
            router.post(route('admin.advances.cancel', advance.id), {
                onSuccess: () => showSuccess('Avans talebi iptal edildi.'),
                onError: () => showError('Avans talebi iptal edilirken bir hata oluştu.'),
            });
        }
    };

    // Durum badge ayarları
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Bekliyor', class: 'bg-warning bg-opacity-10 text-warning' },
            approved: { label: 'Onaylandı', class: 'bg-success bg-opacity-10 text-success' },
            rejected: { label: 'Reddedildi', class: 'bg-danger bg-opacity-10 text-danger' },
            paid: { label: 'Ödendi', class: 'bg-primary bg-opacity-10 text-info' },
            cancelled: { label: 'İptal Edildi', class: 'bg-light text-dark' },
        };

        const config = statusConfig[status] || { label: status, class: 'bg-light text-dark' };

        return (
            <span className={`px-2 py-1 fs-xs fw-medium rounded-pill ${config.class}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Avans Talebi Detayı #{advance.id}
                    </h5>
                    <div className="d-flex gap-2">
                        <Link
                            href={route('admin.advances.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                        >
                            Geri Dön
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Avans Talebi #${advance.id}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm-sm">
                        <div className="p-4 text-dark">
                            {/* Genel Bilgiler */}
                            <div className="d-grid d-grid-cols-1 gap-4 mb-8 border-b pb-6">
                                <div>
                                    <h5 className="fw-medium">Talep Bilgileri</h5>
                                    
                                    <div className="space-y-3">
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Talep Numarası</span>
                                            <span className="fs-sm text-dark">#{advance.id}</span>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Durumu</span>
                                            <span className="fs-sm">
                                                {getStatusBadge(advance.status)}
                                            </span>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Miktarı</span>
                                            <span className="fs-sm text-dark fw-medium">{formatCurrency(advance.amount)}</span>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Talep Tarihi</span>
                                            <span className="fs-sm text-dark">{formatDate(advance.requested_date)}</span>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Talep Nedeni</span>
                                            <span className="fs-sm text-dark">{advance.reason || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h5 className="fw-medium">Çalişan Bilgileri</h5>
                                    
                                    <div className="space-y-3">
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Ad Soyad</span>
                                            <span className="fs-sm text-dark">
                                                {advance.employee.first_name} {advance.employee.last_name}
                                            </span>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">E-Posta</span>
                                            <span className="fs-sm text-dark">{advance.employee.email}</span>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Telefon</span>
                                            <span className="fs-sm text-dark">{advance.employee.phone}</span>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <span className="fs-sm fw-medium text-muted">Pozisyon</span>
                                            <span className="fs-sm text-dark">{advance.employee.position_title}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ek Bilgiler */}
                            <div className="mb-8">
                                {advance.notes && (
                                    <div className="mb-5">
                                        <h5 className="fw-medium">Notlar</h5>
                                        <p className="fs-sm text-muted">{advance.notes}</p>
                                    </div>
                                )}
                                
                                {advance.rejection_reason && advance.status === 'rejected' && (
                                    <div className="bg-red-50 p-4 rounded mb-5">
                                        <h5 className="fw-medium">Reddetme Nedeni</h5>
                                        <p className="fs-sm text-danger">{advance.rejection_reason}</p>
                                    </div>
                                )}
                                
                                {advance.payment_date && (
                                    <div className="bg-blue-50 p-4 rounded">
                                        <h5 className="fw-medium">Ödeme Bilgileri</h5>
                                        <div className="d-flex justify-content-between fs-sm text-info">
                                            <span>Ödeme Tarihi:</span>
                                            <span>{formatDate(advance.payment_date)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* İşlem Butonları */}
                            {advance.status === 'pending' && (
                                <div className="d-flex gap-3 justify-content-end mt-8 pt-6 border-t">
                                    <button
                                        onClick={() => handleApprove()}
                                        className="btn btn-success btn-sm"
                                    >
                                        Onayla
                                    </button>
                                    
                                    <button
                                        onClick={() => handleReject()}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Reddet
                                    </button>
                                    
                                    <button
                                        onClick={() => handleCancel()}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                                    >
                                        İptal Et
                                    </button>
                                </div>
                            )}
                            
                            {advance.status === 'approved' && (
                                <div className="d-flex gap-3 justify-content-end mt-8 pt-6 border-t">
                                    <button
                                        onClick={() => handleMarkAsPaid()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 fs-sm"
                                    >
                                        Ödendi Olarak İşaretle
                                    </button>
                                    
                                    <button
                                        onClick={() => handleCancel()}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                                    >
                                        İptal Et
                                    </button>
                                </div>
                            )}
                            
                            {advance.status === 'approved' && (
                                <div className="d-flex gap-3 justify-content-end mt-4">
                                    <small className="fs-sm text-muted">Not: Avansı ödemek için bankacılık işlemlerini gerçekleştirdikten sonra "Ödendi" butonuna tıklayınız.</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}