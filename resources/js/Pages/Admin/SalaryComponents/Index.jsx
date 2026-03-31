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
            allowance: { label: 'Ek Ödeme', class: 'bg-success bg-opacity-10 text-success' },
            deduction: { label: 'Kesinti', class: 'bg-danger bg-opacity-10 text-danger' },
        };
        
        const config = typeConfig[type] || { label: type, class: 'bg-light text-dark' };
        
        return (
            <span className={`px-2 py-1 fs-xs fw-medium rounded-pill ${config.class}`}>
                {config.label}
            </span>
        );
    };

    // Durum badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { label: 'Aktif', class: 'bg-success bg-opacity-10 text-success' },
            inactive: { label: 'Pasif', class: 'bg-light text-dark' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-light text-dark' };
        
        return (
            <span className={`px-2 py-1 fs-xs fw-medium rounded-pill ${config.class}`}>
                {config.label}
            </span>
        );
    };

    // Ek ödemeler ve kesintileri ayır
    const allowances = components.data.filter(c => c.type === 'allowance');
    const deductions = components.data.filter(c => c.type === 'deduction');

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Maaş Bileşenleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Maaş Bileşenleri', url: route('admin.salary-components.index') },
                ],
                newUrl: route('admin.salary-components.create'),
            }}
        >
            <Head title="Maaş Kalemleri" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Arama ve Filtre */}
                    <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                        <form onSubmit={handleSearch} className="d-flex d-flex-wrap gap-3 align-items-end">
                            <div className="d-flex-1 min-w-[200px]">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Kalem Ara
                                </label>
                                <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Kalem adı..."
                                />
                            </div>

                            <div className="w-40">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Tip
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value);
                                        handleFilterChange('type', e.target.value);
                                    }}
                                >
                                    <option value="">Tümü</option>
                                    <option value="allowance">Ek Ödeme</option>
                                    <option value="deduction">Kesinti</option>
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

                    {/* Ek Ödemeler */}
                    <div className="bg-white rounded-3 shadow-sm mb-5">
                        <div className="p-4 border-b border-secondary bg-green-50">
                            <h5 className="fw-semibold">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ek Ödemeler ({allowances.length})
                            </h5>
                        </div>
                        
                        {allowances.length > 0 ? (
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Kalem Adı
                                        </th>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Tip
                                        </th>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Tutar/Oran
                                        </th>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Vergi
                                        </th>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            SGK
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
                                    {(allowances || []).map((component) => (
                                        <tr key={component.id} className="hover:table-light">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.salary-components.edit', component.id)}
                                                    className="fs-sm fw-medium text-primary hover:text-indigo-900"
                                                >
                                                    {component.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getTypeBadge(component.type)}
                                            </td>
                                            <td className="px-4 py-3 fs-sm text-dark">
                                                {component.is_percentage 
                                                    ? formatPercentage(component.percentage)
                                                    : formatCurrency(component.amount)
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                {component.taxable ? (
                                                    <span className="text-success fs-sm">Vergilendirilir</span>
                                                ) : (
                                                    <span className="text-muted fs-sm">Vergisiz</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {component.sgk_applicable ? (
                                                    <span className="text-success fs-sm">Dahil</span>
                                                ) : (
                                                    <span className="text-muted fs-sm">Dışı</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(component.status)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Link
                                                                    href={route('admin.salary-components.edit', component.id)}
                                                                    className="p-1 text-muted hover:text-primary"
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
                            <div className="p-8 text-center text-muted">
                                Ek ödeme kalemi bulunmuyor.
                            </div>
                        )}
                    </div>

                    {/* Kesintiler */}
                    <div className="bg-white rounded-3 shadow-sm">
                        <div className="p-4 border-b border-secondary bg-red-50">
                            <h5 className="fw-semibold">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                                Kesintiler ({deductions.length})
                            </h5>
                        </div>
                        
                        {deductions.length > 0 ? (
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Kalem Adı
                                        </th>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Tip
                                        </th>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Tutar/Oran
                                        </th>
                                        <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                            Zorunlu
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
                                    {(deductions || []).map((component) => (
                                        <tr key={component.id} className="hover:table-light">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.salary-components.edit', component.id)}
                                                    className="fs-sm fw-medium text-primary hover:text-indigo-900"
                                                >
                                                    {component.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getTypeBadge(component.type)}
                                            </td>
                                            <td className="px-4 py-3 fs-sm text-dark">
                                                {component.is_percentage 
                                                    ? formatPercentage(component.percentage)
                                                    : formatCurrency(component.amount)
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                {component.is_mandatory ? (
                                                    <span className="text-danger fs-sm">Zorunlu</span>
                                                ) : (
                                                    <span className="text-muted fs-sm">Opsiyonel</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(component.status)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <button
                                                        onClick={() => toggleStatus(component.id, component.status)}
                                                        className={`p-1 ${component.status === 'active' ? 'text-success' : 'text-muted'}`}
                                                        title={component.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                                <Link
                                                                    href={route('admin.salary-components.edit', component.id)}
                                                                    className="p-1 text-muted hover:text-primary"
                                                                    title="Düzenle"
                                                                >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(component.id)}
                                                        className="p-1 text-muted hover:text-danger"
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
                            <div className="p-8 text-center text-muted">
                                Kesinti kalemi bulunmuyor.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {components?.meta && components.meta.last_page > 1 && (
                        <div className="mt-4 d-flex justify-content-center">
                            <div className="d-flex gap-1">
                                {components.meta.links.map((link, index) => (
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
