import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

export default function Index({ calendars, filters = {} }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || ''
    });

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.work-calendars.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.work-calendars.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Silme işlemi
    const handleDelete = (id) => {
        confirmDelete('Bu takvimi silmek istediğinize emin misiniz? Bu işlem tüm bağlı verileri de etkileyecektir.', () => {
            router.delete(route('admin.work-calendars.destroy', id), {
                onSuccess: () => showSuccess('Takvim başarıyla silindi.'),
            });
        });
    };

    // Yılları hesapla
    const getCalendarYears = (calendarsList) => {
        const years = new Set();
        calendarsList.forEach(calendar => {
            if (calendar.start_date && calendar.end_year) {
                const startYear = new Date(calendar.start_date).getFullYear();
                const endYear = calendar.end_year || startYear + 1;
                for(let y = startYear; y <= endYear; y++) {
                    years.add(y);
                }
            } else {
                years.add(new Date().getFullYear());
            }
        });
        return Array.from(years).sort().reverse();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        İş Takvimleri
                    </h2>
                    <Link
                        href={route('admin.work-calendars.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Takvim Oluştur
                    </Link>
                </div>
            }
        >
            <Head title="İş Takvimleri" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtreleme ve Arama Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Arama
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Takvim adı..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={localFilters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Tümü</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Pasif</option>
                                        <option value="archived">Arşivlenmiş</option>
                                        <option value="draft">Taslak</option>
                                    </select>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 self-end"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Takvim Listesi */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Tanımlı İş Takvimleri</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Takvim Adı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Periyot
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Toplam Gün
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            İş Günü
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tatil Günü
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {calendars?.data && calendars.data.length > 0 ? (
                                        calendars.data.map((calendar) => (
                                            <tr key={calendar.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {calendar.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {calendar.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="font-medium">
                                                        {calendar.start_date ? new Date(calendar.start_date).toLocaleDateString('tr-TR') + ' - ' + new Date(calendar.end_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {calendar.start_date ? new Date(calendar.start_date).getFullYear() : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {calendar.total_days || 0} gün
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {calendar.working_days || 0} gün
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {calendar.holiday_days || 0} gün
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        calendar.is_active === true || calendar.is_active === 1
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {calendar.is_active === true || calendar.is_active === 1 ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('admin.work-calendars.show', calendar.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Görüntüle
                                                        </Link>
                                                        <Link
                                                            href={route('admin.work-calendars.edit', calendar.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Düzenle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(calendar.id)}
                                                            className="text-red-600 hover:text-red-900 ml-4"
                                                        >
                                                            Sil
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Takvim tanımı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {calendars?.meta && calendars.meta.last_page > 1 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <nav className="flex items-center justify-between">
                                    <div className="flex items-center justify-between flex-1">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                {calendars.meta.from} - {calendars.meta.to} arası, toplam {calendars.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex space-x-2">
                                                {calendars.meta.links.filter(link => link.url).map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                        dangerousInnerHTML={{ __html: link.label }}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Takvim Türlerine Göre Hızlı Filtreleme */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {getCalendarYears(calendars?.data || []).map(year => (
                            <div key={year} className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-medium text-gray-900 mb-2">{year} Yılı Takvimi</h4>
                                <p className="text-sm text-gray-600">
                                    {calendars?.data?.filter(c => 
                                        new Date(c.start_date).getFullYear() <= year && 
                                        new Date(c.end_date).getFullYear() >= year
                                    ).length || 0} takvim mevcut
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Hızlı İstatistikler */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-blue-800">Aktif Takvim</h4>
                                <p className="text-3xl font-bold text-blue-600 mt-2">
                                    {calendars?.data?.filter(c => c.status === 'active').length || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-green-800">Yılbaşı Tatlileri</h4>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {calendars?.data?.reduce((acc, c) => acc + (c.holiday_days || 0), 0) || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-purple-800">Toplam Hedef Gün</h4>
                                <p className="text-3xl font-bold text-purple-600 mt-2">
                                    {calendars?.data?.reduce((acc, c) => acc + (c.working_days || 0), 0) || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}