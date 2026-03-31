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
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Devam Kayıtları
                    </h5>
                    <Link
                        href={route('admin.attendance.scan')}
                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
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
                                    {employees?.map((emp) => (
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
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(attendance.id)}
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
                                {attendances.meta.links.map((link, index) => (
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