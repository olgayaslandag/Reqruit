import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import { formatCurrency, formatPercentage } from '@/Utils/formatters';

/**
 * Maaş kalemleri listesi
 * GET /admin/salary-components
 */
export default function Index({ components, filters }) {
    const { props } = usePage();
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

    // Arama
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.salary-components.index'), {
            ...(typeFilter && { type: typeFilter }),
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre
    const handleFilterChange = (key, value) => {
        router.get(route('admin.salary-components.index'), {
            ...(key === 'type' ? { type: value } : { [key]: value }),
            search: searchTerm,
        }, { replace: true });
    };

    // Silme
    const handleDelete = (id) => {
        confirmDelete('Bu kalemi silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.salary-components.destroy', id), {
                onSuccess: () => showSuccess('Kalem başarıyla silindi.'),
            });
        });
    };

    // Tip badge
    const getTypeBadge = (type) => {
        const typeConfig = {
            allowance: { label: 'Ek Ödeme', class: 'bg-green-100 text-green-800' },
            deduction: { label: 'Kesinti', class: 'bg-red-100 text-red-800' },
        };
        
        const config = typeConfig[type] || { label: type, class: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    // Durum badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { label: 'Aktif', class: 'bg-green-100 text-green-800' },
            inactive: { label: 'Pasif', class: 'bg-gray-100 text-gray-800' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    // Ek ödemeler ve kesintileri ayır
    const allowances = components.data.filter(c => c.type === 'allowance');
    const deductions = components.data.filter(c => c.type === 'deduction');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Maaş Kalemleri
                    </h2>
                    <Link
                        href={route('admin.salary-components.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Kalem
                    </Link>
                </div>
            }
        >
            <Head title="Maaş Kalemleri" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Arama ve Filtre */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kalem Ara
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Kalem adı..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tip
                                </label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value);
                                        handleFilterChange('type', e.target.value);
                                    }}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    <option value="allowance">Ek Ödeme</option>
                                    <option value="deduction">Kesinti</option>
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

                    {/* Ek Ödemeler */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-4 border-b border-gray-200 bg-green-50">
                            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ek Ödemeler ({allowances.length})
                            </h3>
                        </div>
                        
                        {allowances.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kalem Adı
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tip
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tutar/Oran
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Vergi
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            SGK
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
                                    {allowances.map((component) => (
                                        <tr key={component.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.salary-components.edit', component.id)}
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {component.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getTypeBadge(component.type)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {component.is_percentage 
                                                    ? formatPercentage(component.percentage)
                                                    : formatCurrency(component.amount)
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                {component.taxable ? (
                                                    <span className="text-green-600 text-sm">Vergilendirilir</span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Vergisiz</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {component.sgk_applicable ? (
                                                    <span className="text-green-600 text-sm">Dahil</span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Dışı</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(component.status)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                                    href={route('admin.salary-components.edit', component.id)}
                                                                    className="p-1 text-gray-500 hover:text-indigo-600"
                                                                    title="Düzenle"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Ek ödeme kalemi bulunmuyor.
                            </div>
                        )}
                    </div>

                    {/* Kesintiler */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 bg-red-50">
                            <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                                Kesintiler ({deductions.length})
                            </h3>
                        </div>
                        
                        {deductions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kalem Adı
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tip
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tutar/Oran
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Zorunlu
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
                                    {deductions.map((component) => (
                                        <tr key={component.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.salary-components.edit', component.id)}
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {component.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getTypeBadge(component.type)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {component.is_percentage 
                                                    ? formatPercentage(component.percentage)
                                                    : formatCurrency(component.amount)
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                {component.is_mandatory ? (
                                                    <span className="text-red-600 text-sm">Zorunlu</span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Opsiyonel</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(component.status)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => toggleStatus(component.id, component.status)}
                                                        className={`p-1 ${component.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}
                                                        title={component.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                                <Link
                                                                    href={route('admin.salary-components.edit', component.id)}
                                                                    className="p-1 text-gray-500 hover:text-indigo-600"
                                                                    title="Düzenle"
                                                                >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(component.id)}
                                                        className="p-1 text-gray-500 hover:text-red-600"
                                                        title="Sil"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Kesinti kalemi bulunmuyor.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {components?.meta && components.meta.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                                {components.meta.links.map((link, index) => (
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
