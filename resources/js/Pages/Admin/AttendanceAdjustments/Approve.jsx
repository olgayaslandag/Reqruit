import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Approve({ pendingRequests }) {
    const [bulkAction, setBulkAction] = useState({
        action: 'approve',
        selectedIds: [],
        reason: ''
    });

    const approveRequest = (id) => {
        router.put(route('admin.adjustments.update-status', id), { status: 'approved' }, {
            onSuccess: () => showSuccess('Talep başarıyla onaylandı.'),
            onError: () => showError('Talep onaylanırken bir hata oluştu.')
        });
    };

    const rejectRequest = (id, reason='') => {
        router.put(route('admin.adjustments.update-status', id), { status: 'rejected', reason }, {
            onSuccess: () => showSuccess('Talep başarıyla reddedildi.'),
            onError: () => showError('Talep reddedilirken bir hata oluştu.')
        });
    };

    const handleBulkAction = (e) => {
        e.preventDefault();
        
        if (bulkAction.selectedIds.length === 0) {
            showError('Lütfen en az bir talep seçin.');
            return;
        }

        // Seçili talepleri işle
        bulkAction.selectedIds.forEach(id => {
            if (bulkAction.action === 'approve') {
                approveRequest(id);
            } else {
                rejectRequest(id, bulkAction.reason);
            }
        });

        // Reset the selections
        setBulkAction(prev => ({ ...prev, selectedIds: [] }));
    };

    const toggleSelection = (id) => {
        if (bulkAction.selectedIds.includes(id)) {
            setBulkAction(prev => ({
                ...prev,
                selectedIds: prev.selectedIds.filter(selId => selId !== id)
            }));
        } else {
            setBulkAction(prev => ({
                ...prev,
                selectedIds: [...prev.selectedIds, id]
            }));
        }
    };

    const selectAll = () => {
        if (bulkAction.selectedIds.length === pendingRequests?.length) {
            setBulkAction(prev => ({ ...prev, selectedIds: [] }));
        } else {
            setBulkAction(prev => ({ 
                ...prev, 
                selectedIds: pendingRequests?.map(req => req.id) || [] 
            }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Devam Düzeltme Talepleri Onayla
                    </h5>
                    <Link
                        href={route('admin.adjustments.index')}
                        className="btn btn-secondary btn-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title="Talepleri Onayla" />

            <div className="py-5">
                <div className="mw-100 mx-auto px-4">
                    {/* Toplu İşlem Paneli */}
                    <div className="bg-white rounded-3  mb-5 p-4">
                        <form onSubmit={handleBulkAction} className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Toplu Eylem
                                </label>
                                <select className="form-control w-100 rounded border-secondary " value={bulkAction.action}
                                    onChange={(e) => setBulkAction(prev => ({ ...prev, action: e.target.value }))}
                                >
                                    <option value="approve">Onayla</option>
                                    <option value="reject">Reddet</option>
                                </select>
                            </div>

                            {bulkAction.action === 'reject' && (
                                <div className="">
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Reddetme Sebebi (İsteğe Bağlı)
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary " type="text"
                                        value={bulkAction.reason}
                                        onChange={(e) => setBulkAction(prev => ({ ...prev, reason: e.target.value }))}
                                        placeholder="Reddetme sebebini girin..."
                                    />
                                </div>
                            )}

                            <div className="d-flex align-items-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm w-100"
                                >
                                    Seçilileri İşle
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Talep Listesi */}
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-bottom border-secondary">
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="fw-medium">
                                    Bekleyen Talepler ({pendingRequests?.length || 0} adet)
                                </h5>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        onChange={selectAll}
                                        checked={bulkAction.selectedIds.length === pendingRequests?.length && pendingRequests?.length > 0}
                                        className="  text-primary  rounded"
                                    />
                                    <span className="ml-2 fs-sm text-dark">
                                        Tümünü Seç ({bulkAction.selectedIds.length} adet seçili)
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="table table-hover w-100">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase  ">
                                            <input
                                                type="checkbox"
                                                onChange={selectAll}
                                                checked={bulkAction.selectedIds.length === pendingRequests?.length && pendingRequests?.length > 0}
                                                className="  text-primary  rounded"
                                            />
                                        </th>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Personel
                                        </th>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Tarih
                                        </th>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Değişim
                                        </th>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Orijinal Saatler
                                        </th>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Yeni Saatler
                                        </th>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Sebep
                                        </th>
                                        <th className="px-5 py-3 text-right fs-xs fw-medium text-muted text-uppercase ">
                                            Eylemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {pendingRequests && pendingRequests.length > 0 ? (
                                        pendingRequests.map((request) => (
                                            <tr key={request.id} className="">
                                                <td className="px-5 py-4 text-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={bulkAction.selectedIds.includes(request.id)}
                                                        onChange={() => toggleSelection(request.id)}
                                                        className="  text-primary  rounded"
                                                    />
                                                </td>
                                                <td className="px-5 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {request.employee?.first_name} {request.employee?.last_name}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {request.employee?.identity_no}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {new Date(request.date).toLocaleDateString('tr-TR')}
                                                    </div>
                                                    <div className="fs-xs text-muted">
                                                        {new Date(request.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2 py-0.5 rounded fs-xs fw-medium ${
                                                        request.type === 'clock_in' 
                                                            ? 'bg-primary bg-opacity-10 text-info' 
                                                            : request.type === 'clock_out'
                                                                ? 'bg-success bg-opacity-10 text-success'
                                                                : request.type === 'both'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : 'bg-warning bg-opacity-10 text-warning'
                                                    }`}>
                                                        {request.type === 'clock_in' ? 'Giriş Saati' : 
                                                         request.type === 'clock_out' ? 'Çıkış Saati' : 
                                                         request.type === 'both' ? 'Giris+Çıkış' : 'Süre Düzeltimesi'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-nowrap fs-sm text-dark">
                                                    <div className="fw-medium">
                                                        {request.original_clock_in ? new Date(request.original_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="text-muted">
                                                        {request.original_clock_out ? new Date(request.original_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-nowrap fs-sm text-dark">
                                                    <div className="fw-medium">
                                                        {request.new_clock_in ? new Date(request.new_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="text-muted">
                                                        {request.new_clock_out ? new Date(request.new_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 fs-sm text-muted mw-100">
                                                    {request.reason}
                                                </td>
                                                <td className="px-5 py-4 text-nowrap text-right fs-sm fw-medium">
                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            onClick={() => approveRequest(request.id)}
                                                            className="text-success "
                                                        >
                                                            Onayla
                                                        </button>
                                                        <button
                                                            onClick={() => rejectRequest(request.id)}
                                                            className="text-danger  ml-3"
                                                        >
                                                            Reddet
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-5 py-12 text-center fs-sm text-muted">
                                                Onay bekleyen talep bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Onay Kuralları */}
                    <div className="mt-6  border  rounded p-4">
                        <div className="d-flex">
                            <div className="d-flex-shrink-0">
                                <svg className="  text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h5 className="fw-medium">Devam Düzeltme Onay Kuralları</h5>
                                <div className="mt-2 fs-sm text-info d-flex flex-column gap-1">
                                    <p>• Talep edilen saatlerde uygun belge/bildirim varsa onay verilmelidir</p>
                                    <p>• Geciken girişler için sağlık raporu/gider makbuzu gibi belgeler göz önünde bulundurulmalıdır</p>
                                    <p>• Sıklıkla talepte bulunan çalışanların durumları ayrı ayrı incelenmelidir</p>
                                    <p>• Geçmişte çok fazla onaylanmış talep varsa bu, sisteme uygunluğu hakkında ipucu verebilir</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Talep İstatistikleri */}
                    <div className="d-grid d-grid-cols-1 gap-3 mt-6">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium text-dark">Bu Ayki Toplam</h5>
                            <p className="fs-2 fw-bold text-dark">{pendingRequests?.length || 0}</p>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium text-dark">Ort. İşleme Süresi</h5>
                            <p className="fs-2 fw-bold text-dark">2.4g</p>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium text-dark">Onay Oranı</h5>
                            <p className="fs-2 fw-bold text-success">85%</p>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium text-dark">Yıllık Talep</h5>
                            <p className="fs-2 fw-bold text-dark">142</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}