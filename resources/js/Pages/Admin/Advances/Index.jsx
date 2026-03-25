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
            pending: { label: 'Beklemede', class: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Onaylandı', class: 'bg-green-100 text-green-800' },
            rejected: { label: 'Reddedildi', class: 'bg-red-100 text-red-800' },
            cancelled: { label: 'İptal', class: 'bg-gray-100 text-gray-800' },
            paid: { label: 'Ödendi', class: 'bg-blue-100 text-blue-800' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Avans Talepleri
                    </h2>
                        <Link
                            href={route('admin.advances.create')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* İstatistikler */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Bekleyen</div>
                            <div className="text-2xl font-bold text-yellow-600">{pendingCount || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Onaylanan</div>
                            <div className="text-2xl font-bold text-green-600">{approvedCount || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Reddedilen</div>
                            <div className="text-2xl font-bold text-red-600">{rejectedCount || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Ödenen</div>
                            <div className="text-2xl font-bold text-blue-600">{advances?.data?.filter(a => a.status === 'paid').reduce((sum, a) => sum + parseFloat(a.amount), 0) || 0} TL</div>
                        </div>
                    </div>

                    {/* Arama ve Filtre */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ara
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Çalışan adı, TC Kimlik No..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Durum
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        handleFilterChange('status', e.target.value);
                                    }}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Ara
                            </button>
                        </form>
                    </div>

                    {/* Tablo */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Çalışan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tür
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tutar
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Taksit
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Talep Tarihi
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Durum
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {advances?.data?.length > 0 ? (
                                    advances.data.map((advance) => (
                                        <tr key={advance.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {advance.employee_name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {advance.employee_identity_no}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-900">
                                                    {getTypeLabel(advance.type)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(advance.amount)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-900">
                                                    {advance.installments || 1} taksit
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(advance.request_date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {getStatusBadge(advance.status)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.advances.show', advance.id)}
                                                        className="p-1 text-gray-500 hover:text-indigo-600"
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
                                                                className="p-1 text-green-600 hover:text-green-800"
                                                                title="Onayla"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(advance.id)}
                                                                className="p-1 text-red-600 hover:text-red-800"
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
                                                            className="p-1 text-blue-600 hover:text-blue-800"
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
                                                            className="p-1 text-gray-500 hover:text-red-600"
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
                                        <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                                            Avans talebi bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {advances?.meta && advances.meta.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                                {advances.meta.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 border rounded-md ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
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
