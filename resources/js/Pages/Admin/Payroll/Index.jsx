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
            draft: { label: 'Taslak', class: 'bg-light text-dark' },
            pending: { label: 'Beklemede', class: 'bg-warning bg-opacity-10 text-warning' },
            approved: { label: 'Onaylandı', class: 'bg-success bg-opacity-10 text-success' },
            paid: { label: 'Ödendi', class: 'bg-primary bg-opacity-10 text-info' },
            locked: { label: 'Kilitli', class: 'bg-danger bg-opacity-10 text-danger' },
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
                    <h5 className="fw-semibold">
                        Bordro Dönemleri
                    </h5>
                    <Link
                        href={route('admin.payrolls.create')}
                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
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
                <div className="mw-100 mx-auto">
                    {/* Arama ve Filtreler */}
                    <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                        <form onSubmit={handleSearch} className="d-flex d-flex-wrap gap-3 align-items-end">
                            {/* Arama */}
                            <div className="d-flex-1 min-w-[200px]">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Dönem Ara
                                </label>
                                <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Dönem adı..."
                                />
                            </div>

                            {/* Durum Filtresi */}
                            <div className="w-40">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Durum
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        handleFilterChange('status', e.target.value);
                                    }}
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
                                className="btn btn-primary btn-sm"
                            >
                                Ara
                            </button>
                        </form>
                    </div>

                    {/* Tablo */}
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                        <table className="w-100 divide-y divide-gray-200">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Dönem
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Tarih Aralığı
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Çalışma Günü
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Çalışan Sayısı
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Toplam Brüt
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
                                {payrollPeriods?.data?.length > 0 ? (
                                    payrollPeriods.data.map((period) => (
                                        <tr key={period.id} className="hover:table-light">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.payrolls.show', period.id)}
                                                    className="fs-sm fw-medium text-primary hover:text-indigo-900 hover:underline"
                                                >
                                                    {period.name}
                                                </Link>
                                                <div className="fs-xs text-muted">
                                                    {formatMonthYear(period.start_date)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {period.work_days || 0} gün
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {period.employee_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap text-right">
                                                <span className="fs-sm fw-medium text-dark">
                                                    {formatCurrency(period.total_gross)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {getStatusBadge(period.status)}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap text-right">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Link
                                                        href={route('admin.payrolls.show', period.id)}
                                                        className="p-1 text-muted hover:text-primary"
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
                                                            className="p-1 text-muted hover:text-primary"
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
                                                            className="p-1 text-muted hover:text-danger"
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
                                                            className="p-1 text-muted hover:text-success"
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
                                        <td colSpan="7" className="px-4 py-8 text-center fs-sm text-muted">
                                            Bordro dönemi bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {payrollPeriods?.meta && payrollPeriods.meta.last_page > 1 && (
                        <div className="mt-4 d-flex justify-content-center">
                            <div className="d-flex gap-1">
                                {payrollPeriods.meta.links.map((link, index) => (
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
