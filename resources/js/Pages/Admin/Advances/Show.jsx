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
            pending: { label: 'Bekliyor', class: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Onaylandı', class: 'bg-green-100 text-green-800' },
            rejected: { label: 'Reddedildi', class: 'bg-red-100 text-red-800' },
            paid: { label: 'Ödendi', class: 'bg-blue-100 text-blue-800' },
            cancelled: { label: 'İptal Edildi', class: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Avans Talebi Detayı #{advance.id}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.advances.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                            Geri Dön
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Avans Talebi #${advance.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Genel Bilgiler */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Talep Bilgileri</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Talep Numarası</span>
                                            <span className="text-sm text-gray-900">#{advance.id}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Durumu</span>
                                            <span className="text-sm">
                                                {getStatusBadge(advance.status)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Miktarı</span>
                                            <span className="text-sm text-gray-900 font-medium">{formatCurrency(advance.amount)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Talep Tarihi</span>
                                            <span className="text-sm text-gray-900">{formatDate(advance.requested_date)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Talep Nedeni</span>
                                            <span className="text-sm text-gray-900">{advance.reason || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Çalişan Bilgileri</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Ad Soyad</span>
                                            <span className="text-sm text-gray-900">
                                                {advance.employee.first_name} {advance.employee.last_name}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">E-Posta</span>
                                            <span className="text-sm text-gray-900">{advance.employee.email}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Telefon</span>
                                            <span className="text-sm text-gray-900">{advance.employee.phone}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-500">Pozisyon</span>
                                            <span className="text-sm text-gray-900">{advance.employee.position_title}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ek Bilgiler */}
                            <div className="mb-8">
                                {advance.notes && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Notlar</h3>
                                        <p className="text-sm text-gray-600">{advance.notes}</p>
                                    </div>
                                )}
                                
                                {advance.rejection_reason && advance.status === 'rejected' && (
                                    <div className="bg-red-50 p-4 rounded-lg mb-6">
                                        <h3 className="text-lg font-medium text-red-800 mb-2">Reddetme Nedeni</h3>
                                        <p className="text-sm text-red-700">{advance.rejection_reason}</p>
                                    </div>
                                )}
                                
                                {advance.payment_date && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-blue-800 mb-2">Ödeme Bilgileri</h3>
                                        <div className="flex justify-between text-sm text-blue-700">
                                            <span>Ödeme Tarihi:</span>
                                            <span>{formatDate(advance.payment_date)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* İşlem Butonları */}
                            {advance.status === 'pending' && (
                                <div className="flex gap-4 justify-end mt-8 pt-6 border-t">
                                    <button
                                        onClick={() => handleApprove()}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                    >
                                        Onayla
                                    </button>
                                    
                                    <button
                                        onClick={() => handleReject()}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                    >
                                        Reddet
                                    </button>
                                    
                                    <button
                                        onClick={() => handleCancel()}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                                    >
                                        İptal Et
                                    </button>
                                </div>
                            )}
                            
                            {advance.status === 'approved' && (
                                <div className="flex gap-4 justify-end mt-8 pt-6 border-t">
                                    <button
                                        onClick={() => handleMarkAsPaid()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                    >
                                        Ödendi Olarak İşaretle
                                    </button>
                                    
                                    <button
                                        onClick={() => handleCancel()}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                                    >
                                        İptal Et
                                    </button>
                                </div>
                            )}
                            
                            {advance.status === 'approved' && (
                                <div className="flex gap-4 justify-end mt-4">
                                    <small className="text-sm text-gray-500">Not: Avansı ödemek için bankacılık işlemlerini gerçekleştirdikten sonra "Ödendi" butonuna tıklayınız.</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}