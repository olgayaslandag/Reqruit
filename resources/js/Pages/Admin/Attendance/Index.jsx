import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import {
    getAttendanceStatusBadge,
    formatTime,
    formatDate,
    calculateWorkingHours,
    getOvertimeHours,
} from '@/Utils/attendanceHelpers.jsx';

export default function Index({ attendances, filters = {}, employees = [] }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || '',
        employee_id: filters?.employee_id || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    });

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.attendance.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.attendance.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Silme işlemi
    const handleDelete = (id) => {
        confirmDelete('Bu devam kaydını silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.attendance.destroy', id), {
                onSuccess: () => showSuccess('Devam kaydı başarıyla silindi.'),
            });
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Devam Kayıtları
                    </h2>
                    <Link
                        href={route('admin.attendance.scan')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        QR Tarayıcı
                    </Link>
                </div>
            }
        >
            <Head title="Devam Kayıtları" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Arama ve Filtreler */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                            {/* Arama */}
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Arama
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Çalışan Adı, Tc Numarası..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Personel Seçimi */}
                            <div className="w-48">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Personel
                                </label>
                                <select
                                    value={localFilters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {employees?.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tarih Aralığı */}
                            <div className="flex gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Başlangıç
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.date_from}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bitiş
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.date_to}
                                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Statü Filtresi */}
                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Statü
                                </label>
                                <select
                                    value={localFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    <option value="present">Devrede</option>
                                    <option value="absent">Devre Dışı</option>
                                    <option value="late">Geç</option>
                                    <option value="early_departure">Erken Çıkış</option>
                                    <option value="on_leave">İzinli</option>
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
                                        Personel
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tarih
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Giriş Saati
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Çıkış Saati
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Toplam Saat
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Fazla Mesai
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Statü
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendances?.data && attendances.data.length > 0 ? (
                                    attendances.data.map((attendance) => (
                                        <tr key={attendance.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {attendance.employee?.first_name} {attendance.employee?.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {attendance.employee?.identity_no}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(attendance.date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatTime(attendance.clock_in)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatTime(attendance.clock_out)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {calculateWorkingHours(attendance.clock_in, attendance.clock_out)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {getOvertimeHours(attendance.clock_in, attendance.clock_out)} saat
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {getAttendanceStatusBadge(
                                                    attendance.status,
                                                    attendance.clock_in,
                                                    attendance.clock_out
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.attendance.edit', attendance.id)}
                                                        className="p-1 text-gray-500 hover:text-indigo-600"
                                                        title="Düzenle"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(attendance.id)}
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                                            Devam kaydı bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {attendances?.meta && attendances.meta.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                                {attendances.meta.links.map((link, index) => (
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