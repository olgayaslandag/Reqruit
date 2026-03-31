import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess, confirmDelete } from '@/Utils/sweetAlert';

export default function Index({ adjustments, filters = {} }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || '',
        type: filters?.type || ''
    });

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.adjustments.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.adjustments.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Talebi Güncelle (Approve/Reject)
    const updateAdjustmentStatus = (id, status) => {
        router.put(route('admin.adjustments.update-status', id), { status }, {
            onSuccess: () => {
                const actionName = status === 'approved' ? 'onaylandı' : 'reddedildi';
                showSuccess(`Düzeltme talebi ${actionName}.`);
            },
            onError: () => showError('Düzeltme talebi güncellenirken bir hata oluştu.')
        });
    };

    // Yeni Düzeltme Talebi Başlat
    const requestNewAdjustment = () => {
        router.get(route('admin.adjustments.create'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Devam Düzeltme Talepleri
                    </h5>
                    <Link
                        href={route('admin.adjustments.request')}
                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Talep
                    </Link>
                </div>
            }
        >
            <Head title="Devam Düzeltme Talepleri" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    {/* Filtreleme ve Arama Paneli */}
                    <div className="bg-white rounded-3 shadow-sm-md mb-5 p-4">
                        <form onSubmit={handleSearch} className="d-grid d-grid-cols-1 gap-3">
                            <div className="">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Arama
                                </label>
                                <input className="form-control" type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Personel adı, açıklama..."
                                />
                            </div>

                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Durum
                                </label>
                                <select className="form-control" value={localFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    <option value="pending">Bekliyor</option>
                                    <option value="approved">Onaylandı</option>
                                    <option value="rejected">Reddedildi</option>
                                    <option value="cancelled">İptal Edildi</option>
                                </select>
                            </div>

                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Tür
                                </label>
                                <select className="form-control" value={localFilters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    <option value="clock_in">Giriş Düzeltmesi</option>
                                    <option value="clock_out">Çıkış Düzeltmesi</option>
                                    <option value="both">Giriş ve Çıkış Düzeltmesi</option>
                                    <option value="duration">Çalışma Süresi Düzeltmesi</option>
                                </select>
                            </div>

                            <div className="">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm w-100"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Taleplerin Listesi */}
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Devam Düzeltme Talepleri</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Değişim Türü
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Orijinal Saat
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Yeni Saat
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Durum
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {adjustments?.data && adjustments.data.length > 0 ? (
                                        adjustments.data.map((adjustment) => (
                                            <tr key={adjustment.id} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {adjustment.employee?.first_name} {adjustment.employee?.last_name}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {adjustment.employee?.identity_no}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    <div className="fw-medium">
                                                        {new Date(adjustment.date).toLocaleDateString('tr-TR')}
                                                    </div>
                                                    <div className="fs-xs text-muted">
                                                        {new Date(adjustment.created_at).toLocaleTimeString('tr-TR')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        adjustment.type === 'clock_in' 
                                                            ? 'bg-primary bg-opacity-10 text-info' 
                                                            : adjustment.type === 'clock_out'
                                                                ? 'bg-success bg-opacity-10 text-success'
                                                                : adjustment.type === 'both'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : 'bg-warning bg-opacity-10 text-warning'
                                                    }`}>
                                                        {adjustment.type === 'clock_in' ? 'Giriş Saati' : 
                                                         adjustment.type === 'clock_out' ? 'Çıkış Saati' : 
                                                         adjustment.type === 'both' ? 'Giris+Çıkış' : 'Süre Düzeltmesi'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm text-dark">
                                                        {adjustment.original_clock_in ? new Date(adjustment.original_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {adjustment.original_clock_out ? new Date(adjustment.original_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm text-dark">
                                                        {adjustment.new_clock_in ? new Date(adjustment.new_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {adjustment.new_clock_out ? new Date(adjustment.new_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        adjustment.status === 'pending' 
                                                            ? 'bg-warning bg-opacity-10 text-warning' 
                                                            : adjustment.status === 'approved'
                                                                ? 'bg-success bg-opacity-10 text-success'
                                                                : adjustment.status === 'rejected'
                                                                    ? 'bg-danger bg-opacity-10 text-danger'
                                                                    : 'bg-light text-dark'
                                                    }`}>
                                                        {adjustment.status === 'pending' ? 'Bekliyor' : 
                                                         adjustment.status === 'approved' ? 'Onaylandı' : 
                                                         adjustment.status === 'rejected' ? 'Reddedildi' : 'İptal'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                                    <div className="d-flex justify-content-end">
                                                        <Link
                                                            href={route('admin.adjustments.show', adjustment.id)}
                                                            className="text-info hover:text-blue-900"
                                                        >
                                                            Görüntüle
                                                        </Link>
                                                        
                                                        {adjustment.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateAdjustmentStatus(adjustment.id, 'approved')}
                                                                    className="text-success hover:text-green-900 ml-2"
                                                                >
                                                                    Onayla
                                                                </button>
                                                                <button
                                                                    onClick={() => updateAdjustmentStatus(adjustment.id, 'rejected')}
                                                                    className="text-danger hover:text-red-900 ml-2"
                                                                >
                                                                    Reddet
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center fs-sm text-muted">
                                                Devam düzeltme talebi bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {adjustments?.meta && adjustments.meta.last_page > 1 && (
                            <div className="px-6 py-4 table-light border-t border-secondary">
                                <nav className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between d-flex-1">
                                        <div>
                                            <p className="fs-sm text-dark">
                                                {adjustments.meta.from} - {adjustments.meta.to} arası, toplam {adjustments.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="d-flex space-x-2">
                                                {adjustments.meta.links.filter(link => link.url).map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`position-relative d-inline-d-flex align-items-center px-4 py-2 border fs-sm fw-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-primary'
                                                                : 'bg-white border-secondary text-dark hover:table-light'
                                                        }`}
                                                    >
                                                        {link.label.replace(/\&\w+;/g, match => {
                                                            const replacements = { '&laquo;': '«', '&raquo;': '»' };
                                                            return replacements[match];
                                                        })}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Durumlara Göre Hızlı Gözat */}
                    <div className="mt-6 d-grid d-grid-cols-2 gap-3">
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                            <h5 className="fw-medium text-warning">Bekliyor</h5>
                            <p className="fs-2 fw-bold text-warning mt-2">
                                {adjustments?.data?.filter(a => a.status === 'pending').length || 0}
                            </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                            <h5 className="fw-medium text-success">Onaylandı</h5>
                            <p className="fs-2 fw-bold text-success mt-2">
                                {adjustments?.data?.filter(a => a.status === 'approved').length || 0}
                            </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
                            <h5 className="fw-medium text-danger">Reddedildi</h5>
                            <p className="fs-2 fw-bold text-danger mt-2">
                                {adjustments?.data?.filter(a => a.status === 'rejected').length || 0}
                            </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                            <h5 className="fw-medium text-info">Toplam</h5>
                            <p className="fs-2 fw-bold text-info mt-2">
                                {adjustments?.data?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}