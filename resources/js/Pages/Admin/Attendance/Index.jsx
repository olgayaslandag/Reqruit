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
            pageHeader={{
                title: 'Devam Takibi',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Devam Takibi', url: route('admin.attendance.index') },
                ],
                newUrl: route('admin.attendance.scan'),
                exportUrl: route('admin.attendance.export'),
            }}
        >
            <Head title="Devam Kayıtları" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Arama ve Filtreler */}
                    <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                        <form onSubmit={handleSearch} className="d-flex d-flex-wrap gap-3 align-items-end">
                            {/* Arama */}
                            <div className="d-flex-1 min-w-[200px]">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Arama
                                </label>
                                <input className="form-control" type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Çalışan Adı, Tc Numarası..."
                                />
                            </div>

                            {/* Personel Seçimi */}
                            <div className="w-48">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Personel
                                </label>
                                <select className="form-control" value={localFilters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {(employees || []).map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tarih Aralığı */}
                            <div className="d-flex gap-2">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Başlangıç
                                    </label>
                                    <input className="form-control" type="date"
                                        value={localFilters.date_from}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Bitiş
                                    </label>
                                    <input className="form-control" type="date"
                                        value={localFilters.date_to}
                                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Statü Filtresi */}
                            <div className="w-40">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Statü
                                </label>
                                <select className="form-control" value={localFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
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
                                        Personel
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Tarih
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Giriş Saati
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Çıkış Saati
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Toplam Saat
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Fazla Mesai
                                    </th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                        Statü
                                    </th>
                                    <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendances?.data && attendances.data.length > 0 ? (
                                    attendances.data.map((attendance) => (
                                        <tr key={attendance.id} className="hover:table-light">
                                            <td className="px-4 py-3 text-nowrap">
                                                <div className="fs-sm fw-medium text-dark">
                                                    {attendance.employee?.first_name} {attendance.employee?.last_name}
                                                </div>
                                                <div className="fs-sm text-muted">
                                                    {attendance.employee?.identity_no}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {formatDate(attendance.date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {formatTime(attendance.clock_in)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {formatTime(attendance.clock_out)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {calculateWorkingHours(attendance.clock_in, attendance.clock_out)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className="fs-sm text-dark">
                                                    {getOvertimeHours(attendance.clock_in, attendance.clock_out)} saat
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {getAttendanceStatusBadge(
                                                    attendance.status,
                                                    attendance.clock_in,
                                                    attendance.clock_out
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap text-right">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Link
                                                        href={route('admin.attendance.edit', attendance.id)}
                                                        className="p-1 text-muted hover:text-primary"
                                                        title="Düzenle"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(attendance.id)}
                                                        className="p-1 text-muted hover:text-danger"
                                                        title="Sil"
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center fs-sm text-muted">
                                            Devam kaydı bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {attendances?.meta && attendances.meta.last_page > 1 && (
                        <div className="mt-4 d-flex justify-content-center">
                            <div className="d-flex gap-1">
                                {(attendances?.meta?.links || []).map((link, index) => (
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