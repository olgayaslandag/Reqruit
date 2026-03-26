import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

export default function Index({ shifts, employees = [], departments = [], filters = {} }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        employee_id: filters?.employee_id || '',
        department_id: filters?.department_id || '',
        status: filters?.status || ''
    });

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.shifts.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.shifts.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Silme işlemi
    const handleDelete = (id) => {
        confirmDelete('Bu vardiyayı silmek istediğinize emin misiniz? Bu işlem bağlı tüm kayıtları da etkileyecektir.', () => {
            router.delete(route('admin.shifts.destroy', id), {
                onSuccess: () => showSuccess('Vardiya başarıyla silindi.'),
            });
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Vardiyalar
                    </h2>
                    <Link
                        href={route('admin.shifts.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Vardiya
                    </Link>
                </div>
            }
        >
            <Head title="Vardiyalar" />

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
                                    placeholder="Vardiya adı, açıklama..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departman
                                </label>
                                <select
                                    value={localFilters.department_id}
                                    onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {departments?.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 self-end"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Vardiya Listesi */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Vardiya Tanımları</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vardiya Adı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giriş Saati
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Çıkış Saati
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mola Süresi
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
                                    {shifts?.data && shifts.data.length > 0 ? (
                                        shifts.data.map((shift) => (
                                            <tr key={shift.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {shift.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {shift.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {shift.department?.title || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {shift.start_time}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {shift.end_time}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {shift.break_duration || '00:00'} saat
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        shift.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {shift.status === 'active' ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('admin.shifts.schedules', shift.id)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                                                        >
                                                            Atamalar
                                                        </Link>
                                                        <Link
                                                            href={route('admin.shifts.edit', shift.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Düzenle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(shift.id)}
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
                                                Vardiya tanımı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {shifts?.meta && shifts.meta.last_page > 1 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <nav className="flex items-center justify-between">
                                    <div className="flex items-center justify-between flex-1">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                {shifts.meta.from} - {shifts.meta.to} arası, toplam {shifts.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex space-x-2">
                                                {shifts.meta.links.filter(link => link.url).map((link, index) => (
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

                    {/* Vardiya Türü Listesi */}
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Yaygın Vardiya Türleri</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Tam Zamanlı</h4>
                                <p className="text-sm text-gray-600">09:00 - 18:00 | 1 saat mola</p>
                                <p className="text-xs text-gray-500 mt-1">Standart hafta içi saatler</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Gece Vardiyası</h4>
                                <p className="text-sm text-gray-600">22:00 - 06:00 | 1 saat mola</p>
                                <p className="text-xs text-gray-500 mt-1">22:00 saatinden sonra biten vardiyalar</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Geçmiş Vardiyası</h4>
                                <p className="text-sm text-gray-600">07:00 - 15:00 | 45 dk mola</p>
                                <p className="text-xs text-gray-500 mt-1">Erken sabah başlayan vardiyalar</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Part-Time</h4>
                                <p className="text-sm text-gray-600">12:00 - 20:00 | 30 dk mola</p>
                                <p className="text-xs text-gray-500 mt-1">Kısmi zamanlı çalışanlar için</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Haftasonu Servisi</h4>
                                <p className="text-sm text-gray-600">10:00 - 22:00 | 1 saat mola</p>
                                <p className="text-xs text-gray-500 mt-1">Hafta sonu çalışanları için</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Esnek Vardiya</h4>
                                <p className="text-sm text-gray-600">08:00-22:00 arası | 1-2 saat</p>
                                <p className="text-xs text-gray-500 mt-1">Giriş-çıkış süreleri değişebilen</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}