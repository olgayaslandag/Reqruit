import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import {
    getStatusBadge,
    getEmploymentTypeLabel,
    employmentTypeOptions,
    statusFilterOptions,
} from '@/Utils/employeeHelpers.jsx';

export default function Index({ employees, filters, employeeTree }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [localFilters, setLocalFilters] = useState({
        status: filters.status || '',
        department_id: filters.department_id || '',
        employment_type: filters.employment_type || '',
    });

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.employees.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.employees.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Silme işlemi
    const handleDelete = (id) => {
        confirmDelete('Bu çalışanı silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.employees.destroy', id), {
                onSuccess: () => showSuccess('Çalışan başarıyla silindi.'),
            });
        });
    };

    // Tree yapısı için recursive row toplama fonksiyonu
    const collectEmployeeRows = (employee, level = 0) => {
        const indent = level * 24;
        const hasChildren = employee.children && employee.children.length > 0;

        const rows = [
            <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                    <div className="flex items-center" style={{ paddingLeft: indent }}>
                        {hasChildren ? (
                            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        ) : level > 0 ? (
                            <span className="w-4 h-4 mr-2 text-gray-300 flex-shrink-0">└</span>
                        ) : (
                            <span className="w-4 h-4 mr-2 flex-shrink-0"></span>
                        )}
                        <div>
                            <Link
                                href={route('admin.employees.show', employee.id)}
                                className={`text-sm font-medium hover:text-indigo-600 hover:underline ${
                                    level === 0 ? 'text-gray-900' : 'text-gray-700'
                                }`}
                            >
                                {employee.first_name} {employee.last_name}
                            </Link>
                            {employee.manager && (
                                <div className="text-xs text-gray-500">
                                    Yönetici: {employee.manager.first_name} {employee.manager.last_name}
                                </div>
                            )}
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{employee.identity_no}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                        {employee.department?.title || '-'}
                    </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                        {employee.position_title || '-'}
                    </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                        {getEmploymentTypeLabel(employee.employment_type)}
                    </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(employee)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={route('admin.employees.show', employee.id)}
                            className="p-1 text-gray-500 hover:text-indigo-600"
                            title="Görüntüle"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </Link>
                        <Link
                            href={route('admin.employees.edit', employee.id)}
                            className="p-1 text-gray-500 hover:text-indigo-600"
                            title="Düzenle"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </Link>
                        <button
                            onClick={() => handleDelete(employee.id)}
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
        ];

        // Recursive olarak children'ları ekle
        if (employee.children) {
            employee.children.forEach(child => {
                rows.push(...collectEmployeeRows(child, level + 1));
            });
        }

        return rows;
    };

    // Tree verisinden tüm satırları oluştur
    const allRows = employeeTree ? employeeTree.flatMap(emp => collectEmployeeRows(emp)) : [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Çalışanlar
                    </h2>
                    <Link
                        href={route('admin.employees.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Çalışan
                    </Link>
                </div>
            }
        >
            <Head title="Çalışanlar" />

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
                                    placeholder="İsim, TC Kimlik No..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Durum Filtresi */}
                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Durum
                                </label>
                                <select
                                    value={localFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {statusFilterOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Departman Filtresi */}
                            <div className="w-48">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departman
                                </label>
                                <select
                                    value={localFilters.department_id}
                                    onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {props.departments?.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Çalışma Tipi */}
                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Çalışma Tipi
                                </label>
                                <select
                                    value={localFilters.employment_type}
                                    onChange={(e) => handleFilterChange('employment_type', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tümü</option>
                                    {employmentTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
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

                    {/* Tree Yapısı - Tablo */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Çalışan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        TC Kimlik No
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Departman
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Pozisyon
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Çalışma Tipi
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
                                {allRows.length > 0 ? (
                                    allRows
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                                            Çalışan bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - Sadece employees.data varsa göster */}
                    {employees?.data && employees.meta && employees.meta.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                                {employees.meta.links.map((link, index) => (
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