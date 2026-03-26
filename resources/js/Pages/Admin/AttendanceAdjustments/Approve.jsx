import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Approve({ pendingRequests }) {
    const { props } = usePage();
    const flash = props.flash;

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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Devam Düzeltme Talepleri Onayla
                    </h2>
                    <Link
                        href={route('admin.adjustments.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title="Talepleri Onayla" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Toplu İşlem Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <form onSubmit={handleBulkAction} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Toplu Eylem
                                </label>
                                <select
                                    value={bulkAction.action}
                                    onChange={(e) => setBulkAction(prev => ({ ...prev, action: e.target.value }))}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="approve">Onayla</option>
                                    <option value="reject">Reddet</option>
                                </select>
                            </div>

                            {bulkAction.action === 'reject' && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reddetme Sebebi (İsteğe Bağlı)
                                    </label>
                                    <input
                                        type="text"
                                        value={bulkAction.reason}
                                        onChange={(e) => setBulkAction(prev => ({ ...prev, reason: e.target.value }))}
                                        placeholder="Reddetme sebebini girin..."
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            )}

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full"
                                >
                                    Seçilileri İşle
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Talep Listesi */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Bekleyen Talepler ({pendingRequests?.length || 0} adet)
                                </h3>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        onChange={selectAll}
                                        checked={bulkAction.selectedIds.length === pendingRequests?.length && pendingRequests?.length > 0}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Tümünü Seç ({bulkAction.selectedIds.length} adet seçili)
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                            <input
                                                type="checkbox"
                                                onChange={selectAll}
                                                checked={bulkAction.selectedIds.length === pendingRequests?.length && pendingRequests?.length > 0}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Değişim
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orijinal Saatler
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Yeni Saatler
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sebep
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Eylemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingRequests && pendingRequests.length > 0 ? (
                                        pendingRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={bulkAction.selectedIds.includes(request.id)}
                                                        onChange={() => toggleSelection(request.id)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {request.employee?.first_name} {request.employee?.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.employee?.identity_no}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {new Date(request.date).toLocaleDateString('tr-TR')}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(request.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                        request.type === 'clock_in' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : request.type === 'clock_out'
                                                                ? 'bg-green-100 text-green-800'
                                                                : request.type === 'both'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {request.type === 'clock_in' ? 'Giriş Saati' : 
                                                         request.type === 'clock_out' ? 'Çıkış Saati' : 
                                                         request.type === 'both' ? 'Giris+Çıkış' : 'Süre Düzeltimesi'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="font-medium">
                                                        {request.original_clock_in ? new Date(request.original_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {request.original_clock_out ? new Date(request.original_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="font-medium">
                                                        {request.new_clock_in ? new Date(request.new_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {request.new_clock_out ? new Date(request.new_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                    {request.reason}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => approveRequest(request.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Onayla
                                                        </button>
                                                        <button
                                                            onClick={() => rejectRequest(request.id)}
                                                            className="text-red-600 hover:text-red-900 ml-3"
                                                        >
                                                            Reddet
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Onay bekleyen talep bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Onay Kuralları */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Devam Düzeltme Onay Kuralları</h3>
                                <div className="mt-2 text-sm text-blue-700 space-y-1">
                                    <p>• Talep edilen saatlerde uygun belge/bildirim varsa onay verilmelidir</p>
                                    <p>• Geciken girişler için sağlık raporu/gider makbuzu gibi belgeler göz önünde bulundurulmalıdır</p>
                                    <p>• Sıklıkla talepte bulunan çalışanların durumları ayrı ayrı incelenmelidir</p>
                                    <p>• Geçmişte çok fazla onaylanmış talep varsa bu, sisteme uygunluğu hakkında ipucu verebilir</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Talep İstatistikleri */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <h4 className="text-sm font-medium text-gray-700">Bu Ayki Toplam</h4>
                            <p className="text-2xl font-bold text-gray-900">{pendingRequests?.length || 0}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h4 className="text-sm font-medium text-gray-700">Ort. İşleme Süresi</h4>
                            <p className="text-2xl font-bold text-gray-900">2.4g</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h4 className="text-sm font-medium text-gray-700">Onay Oranı</h4>
                            <p className="text-2xl font-bold text-green-600">85%</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h4 className="text-sm font-medium text-gray-700">Yıllık Talep</h4>
                            <p className="text-2xl font-bold text-gray-900">142</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}