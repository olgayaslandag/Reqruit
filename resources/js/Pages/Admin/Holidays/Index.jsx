import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess, confirmDelete } from '@/Utils/sweetAlert';

export default function Index({ holidays, filters = {} }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        category: filters?.category || ''
    });

    const categories = [...new Set(holidays?.data?.map(h => h.type) || [])];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.holidays.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.holidays.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    const handleDelete = (id) => {
        confirmDelete('Bu tatili silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.holidays.destroy', id), {
                onSuccess: () => showSuccess('Tatil başarıyla silindi.'),
            });
        });
    };

    const addToCalendar = (holidayId) => {
        confirmDelete('Bu tatili takvime eklemek istediğinize emin misiniz?', () => {
            router.post(route('admin.holidays.addToCalendar', { holidayId: holidayId }), {}, {
                onSuccess: () => showSuccess('Tatil takvime başarıyla eklendi.'),
                onError: () => showError('Tatil takvime eklenemedi.')
            });
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Resmi Tatiller
                    </h2>
                    <Link
                        href={route('admin.holidays.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Tatil
                    </Link>
                </div>
            }
        >
            <Head title="Resmi Tatiller" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtreleme ve Arama Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Arama
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tatil adı..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori
                                </label>
                                <select
                                    value={localFilters.category || localFilters.type || ''}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'official' ? 'Resmi Tatil' : category === 'company' ? 'Şirket Tatili' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tatiller Listesi */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Tanımlı Resmi Tatiller</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tatil Adı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Yılılacak mı?
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Açıklama
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {holidays?.data && holidays.data.length > 0 ? (
                                        holidays.data.map((holiday) => (
                                            <tr key={holiday.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {holiday.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {holiday.local_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {new Date(holiday.date).toLocaleDateString('tr-TR', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: 'numeric' 
                                                        })}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(holiday.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        holiday.recurring 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {holiday.recurring ? 'Evet' : 'Hayır'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {holiday.type === 'official' ? 'Resmi Tatil' : holiday.type === 'company' ? 'Şirket Tatili' : holiday.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                    {holiday.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => addToCalendar(holiday.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Takvime Ekle
                                                        </button>
                                                        <Link
                                                            href={route('admin.holidays.edit', holiday.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 ml-3"
                                                        >
                                                            Düzenle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(holiday.id)}
                                                            className="text-red-600 hover:text-red-900 ml-3"
                                                        >
                                                            Sil
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Tatil tanımı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {holidays?.meta && holidays?.meta.last_page > 1 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <nav className="flex items-center justify-between">
                                    <div className="flex items-center justify-between flex-1">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                {holidays.meta.from} - {holidays.meta.to} arası, toplam {holidays.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex space-x-2">
                                                {holidays.meta.links.filter(link => link.url).map((link, index) => (
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

                    {/* Türkiye'nin Yıllık Tatil Takvimi */}
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Resmi Tatiller (Yaklaşanlar)</h3>
                        </div>
                        
                        <div className="p-6">
                                         {(() => {
                                             const now = new Date();
                                             const upcomingHolidays = (holidays?.data || holidays || [])
                                                 .filter(h => new Date(h.date) > now)
                                                 .sort((a, b) => new Date(a.date) - new Date(b.date))
                                                 .slice(0, 6);

                                             if (upcomingHolidays.length > 0) {
                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {upcomingHolidays.map(holiday => (
                                                <div key={holiday.id} className="border rounded-lg p-4 bg-gray-50">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                                <span className="text-red-600 font-bold text-sm">
                                                                    {new Date(holiday.date).getDate()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-gray-900">{holiday.name}</h4>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(holiday.date).toLocaleDateString('tr-TR', { 
                                                                    weekday: 'short', 
                                                                    month: 'short' 
                                                                })}
                                                            </p>
                                                             <div className="mt-1">
                                                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                     {holiday.type === 'official' ? 'Resmi Tatil' : 'Şirket Tatili'}
                                                                 </span>
                                                             </div>
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 text-xs text-gray-600">
                                                        {holiday.local_name || holiday.description || '-'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <p className="text-center text-sm text-gray-500 py-4">
                                            Yaklaşan tatil bulunamadı.
                                        </p>
                                    );
                                }
                            })()}
                        </div>
                    </div>

                    {/* Yıllara Göre Hızlı Gözat */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(() => {
                            const years = [...new Set(
                                (holidays?.data || []).map(holiday => 
                                    new Date(holiday.date).getFullYear()
                                )
                            )].sort().reverse();
                            
                            return years.map(year => {
                                const yearHolidays = (holidays?.data || []).filter(h => 
                                    new Date(h.date).getFullYear() === year
                                );
                                
                                return (
                                    <Link
                                        key={year}
                                        href={route('admin.holidays.index', { year })}
                                        className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow"
                                    >
                                        <h4 className="font-medium text-gray-900">{year}</h4>
                                        <p className="text-sm text-gray-600">{yearHolidays.length} resmi tatil</p>
                                    </Link>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}