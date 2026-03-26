import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency, formatMonthYear } from '@/Utils/formatters';

/**
 * Bordro dönemleri listesi
 * GET /admin/payrolls
 */
export default function Index({ payrollPeriods, filters }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.payrolls.index'), {
            ...(statusFilter && { status: statusFilter }),
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        router.get(route('admin.payrolls.index'), {
            ...(key === 'status' ? { status: value } : { [key]: value }),
            search: searchTerm,
        }, { replace: true });
    };

    // Silme işlemi
    const handleDelete = (id) => {
        confirmDelete('Bu bordro dönemini silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.payrolls.destroy', id), {
                onSuccess: () => showSuccess('Bordro dönemi başarıyla silindi.'),
            });
        });
    };

    // Durum badge bileşeni
    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { label: 'Taslak', class: 'bg-gray-100 text-gray-800' },
            pending: { label: 'Beklemede', class: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Onaylandı', class: 'bg-green-100 text-green-800' },
            paid: { label: 'Ödendi', class: 'bg-blue-100 text-blue-800' },
            locked: { label: 'Kilitli', class: 'bg-red-100 text-red-800' },
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
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Bordro Dönemleri
                    </h2>
                    <Link
                        href={route('admin.payrolls.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Dönem
                    </Link>
                </div>
            }
        >
            <Head title="Bordro Dönemleri" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Arama ve Filtreler */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                            {/* Arama */}
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dönem Ara
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Dönem adı..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Durum Filtresi */}
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
                                    <option value="draft">Taslak</option>
                                    <option value="pending">Beklemede</option>
                                    <option value="approved">Onaylandı</option>
                                    <option value="paid">Ödendi</option>
                                    <option value="locked">Kilitli</option>
                                </select>
                            </div>

                            {/* Ara Butonu */}
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
                                        Dönem
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tarih Aralığı
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Çalışma Günü
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Çalışan Sayısı
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Toplam Brüt
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
                                {payrollPeriods?.data?.length > 0 ? (
                                    payrollPeriods.data.map((period) => (
                                        <tr key={period.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.payrolls.show', period.id)}
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900 hover:underline"
                                                >
                                                    {period.name}
                                                </Link>
                                                <div className="text-xs text-gray-500">
                                                    {formatMonthYear(period.start_date)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {period.work_days || 0} gün
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {period.employee_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(period.total_gross)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {getStatusBadge(period.status)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.payrolls.show', period.id)}
                                                        className="p-1 text-gray-500 hover:text-indigo-600"
                                                        title="Görüntüle"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    
                                                    {period.status === 'draft' && (
                                                        <Link
                                                            href={route('admin.payrolls.edit', period.id)}
                                                            className="p-1 text-gray-500 hover:text-indigo-600"
                                                            title="Düzenle"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                    
                                                    {period.status === 'draft' && (
                                                        <button
                                                            onClick={() => handleDelete(period.id)}
                                                            className="p-1 text-gray-500 hover:text-red-600"
                                                            title="Sil"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    
                                                    {['pending', 'approved'].includes(period.status) && (
                                                        <Link
                                                            href={route('admin.payrolls.approve', period.id)}
                                                            className="p-1 text-gray-500 hover:text-green-600"
                                                            title="Onayla"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                                            Bordro dönemi bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {payrollPeriods?.meta && payrollPeriods.meta.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                                {payrollPeriods.meta.links.map((link, index) => (
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
