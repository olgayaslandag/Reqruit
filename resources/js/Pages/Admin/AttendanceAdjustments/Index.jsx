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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Devam Düzeltme Talepleri
                    </h2>
                    <Link
                        href={route('admin.adjustments.request')}
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
            <Head title="Devam Düzeltme Talepleri" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtreleme ve Arama Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Arama
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Personel adı, açıklama..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Durum
                                </label>
                                <select
                                    value={localFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    <option value="pending">Bekliyor</option>
                                    <option value="approved">Onaylandı</option>
                                    <option value="rejected">Reddedildi</option>
                                    <option value="cancelled">İptal Edildi</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tür
                                </label>
                                <select
                                    value={localFilters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    <option value="clock_in">Giriş Düzeltmesi</option>
                                    <option value="clock_out">Çıkış Düzeltmesi</option>
                                    <option value="both">Giriş ve Çıkış Düzeltmesi</option>
                                    <option value="duration">Çalışma Süresi Düzeltmesi</option>
                                </select>
                            </div>

                            <div className="md:col-start-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full h-full"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Taleplerin Listesi */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Devam Düzeltme Talepleri</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Değişim Türü
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orijinal Saat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Yeni Saat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Durum
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {adjustments?.data && adjustments.data.length > 0 ? (
                                        adjustments.data.map((adjustment) => (
                                            <tr key={adjustment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {adjustment.employee?.first_name} {adjustment.employee?.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {adjustment.employee?.identity_no}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="font-medium">
                                                        {new Date(adjustment.date).toLocaleDateString('tr-TR')}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(adjustment.created_at).toLocaleTimeString('tr-TR')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        adjustment.type === 'clock_in' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : adjustment.type === 'clock_out'
                                                                ? 'bg-green-100 text-green-800'
                                                                : adjustment.type === 'both'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {adjustment.type === 'clock_in' ? 'Giriş Saati' : 
                                                         adjustment.type === 'clock_out' ? 'Çıkış Saati' : 
                                                         adjustment.type === 'both' ? 'Giris+Çıkış' : 'Süre Düzeltmesi'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {adjustment.original_clock_in ? new Date(adjustment.original_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {adjustment.original_clock_out ? new Date(adjustment.original_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {adjustment.new_clock_in ? new Date(adjustment.new_clock_in).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {adjustment.new_clock_out ? new Date(adjustment.new_clock_out).toLocaleTimeString('tr-TR') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        adjustment.status === 'pending' 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : adjustment.status === 'approved'
                                                                ? 'bg-green-100 text-green-800'
                                                                : adjustment.status === 'rejected'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {adjustment.status === 'pending' ? 'Bekliyor' : 
                                                         adjustment.status === 'approved' ? 'Onaylandı' : 
                                                         adjustment.status === 'rejected' ? 'Reddedildi' : 'İptal'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('admin.adjustments.show', adjustment.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Görüntüle
                                                        </Link>
                                                        
                                                        {adjustment.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateAdjustmentStatus(adjustment.id, 'approved')}
                                                                    className="text-green-600 hover:text-green-900 ml-2"
                                                                >
                                                                    Onayla
                                                                </button>
                                                                <button
                                                                    onClick={() => updateAdjustmentStatus(adjustment.id, 'rejected')}
                                                                    className="text-red-600 hover:text-red-900 ml-2"
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
                                            <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Devam düzeltme talebi bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {adjustments?.meta && adjustments.meta.last_page > 1 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <nav className="flex items-center justify-between">
                                    <div className="flex items-center justify-between flex-1">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                {adjustments.meta.from} - {adjustments.meta.to} arası, toplam {adjustments.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex space-x-2">
                                                {adjustments.meta.links.filter(link => link.url).map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                            <h4 className="font-medium text-yellow-800">Bekliyor</h4>
                            <p className="text-2xl font-bold text-yellow-600 mt-2">
                                {adjustments?.data?.filter(a => a.status === 'pending').length || 0}
                            </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <h4 className="font-medium text-green-800">Onaylandı</h4>
                            <p className="text-2xl font-bold text-green-600 mt-2">
                                {adjustments?.data?.filter(a => a.status === 'approved').length || 0}
                            </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <h4 className="font-medium text-red-800">Reddedildi</h4>
                            <p className="text-2xl font-bold text-red-600 mt-2">
                                {adjustments?.data?.filter(a => a.status === 'rejected').length || 0}
                            </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <h4 className="font-medium text-blue-800">Toplam</h4>
                            <p className="text-2xl font-bold text-blue-600 mt-2">
                                {adjustments?.data?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}