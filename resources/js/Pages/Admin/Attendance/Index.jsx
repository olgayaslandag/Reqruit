import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmptyState from '@/Components/EmptyState';
import { confirmDelete } from '@/Utils/sweetAlert';
import { showSuccess } from '@/Utils/toast';
import Pagination from '@/Components/Pagination';
import {
    getAttendanceStatusBadge,
    formatTime,
    formatDate,
    calculateWorkingHours,
    getOvertimeHours,
} from '@/Utils/attendanceHelpers.jsx';

export default function Index({ attendances, filters = {}, employees = [] }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || '',
        employee_id: filters?.employee_id || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.attendance.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true, only: ['attendances', 'filters'] });
    };

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
                filterCollapse: 'filterCollapse',
            }}
            showFilters={true}
            filterTitle={'Filtreleme Seçenekleri'}
            filterId={'filterCollapse'}
        >
            <Head title="Devam Kayıtları" />

            <div className="card mb-4 collapse" id="filterCollapse">
                <div className="p-4">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Çalışan</label>
                            <select
                                className="form-select"
                                value={localFilters.employee_id}
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

                        <div className="col-md-2">
                            <label className="form-label">Başlangıç</label>
                            <input
                                type="date"
                                className="form-control"
                                value={localFilters.date_from}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Bitiş</label>
                            <input
                                type="date"
                                className="form-control"
                                value={localFilters.date_to}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Statü</label>
                            <select
                                className="form-select"
                                value={localFilters.status}
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

                        <div className="col-md-3">
                            <label className="form-label">Arama</label>
                            <input
                                type="text"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Çalışan adı, TC..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="px-4 py-3">Çalışan</th>
                                <th className="px-4 py-3">Tarih</th>
                                <th className="px-4 py-3">Giriş</th>
                                <th className="px-4 py-3">Çıkış</th>
                                <th className="px-4 py-3">Toplam</th>
                                <th className="px-4 py-3">Fazla Mesai</th>
                                <th className="px-4 py-3">Statü</th>
                                <th className="px-4 py-3 text-end">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances?.data && attendances.data.length > 0 ? (
                                attendances.data.map((attendance) => (
                                    <tr key={attendance.id}>
                                        <td className="px-4 py-3">
                                            <div className="fw-medium">{attendance.employee?.first_name} {attendance.employee?.last_name}</div>
                                            <div className="text-muted small">{attendance.employee?.identity_no}</div>
                                        </td>
                                        <td className="px-4 py-3">{formatDate(attendance.date)}</td>
                                        <td className="px-4 py-3">{formatTime(attendance.clock_in)}</td>
                                        <td className="px-4 py-3">{formatTime(attendance.clock_out)}</td>
                                        <td className="px-4 py-3">{calculateWorkingHours(attendance.clock_in, attendance.clock_out)}</td>
                                        <td className="px-4 py-3">{getOvertimeHours(attendance.clock_in, attendance.clock_out)}</td>
                                        <td className="px-4 py-3">
                                            {getAttendanceStatusBadge(attendance.status, attendance.clock_in, attendance.clock_out)}
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <div className="d-flex gap-1 justify-content-end">
                                                 <Link
                                                    href={route('admin.attendance.edit', attendance.id)}
                                                    className="btn btn-link p-0 text-primary"
                                                    title="Düzenle"
                                                    aria-label={`Devam kaydını düzenle: ${attendance.employee?.first_name} ${attendance.employee?.last_name}, ${formatDate(attendance.date)}`}
                                                >
                                                    <i className="ti ti-edit" aria-hidden="true"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(attendance.id)}
                                                    className="btn btn-link p-0 text-danger"
                                                    title="Sil"
                                                    aria-label={`Devam kaydını sil: ${attendance.employee?.first_name} ${attendance.employee?.last_name}, ${formatDate(attendance.date)}`}
                                                >
                                                    <i className="ti ti-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">
                                        <EmptyState
                                            title="Devam kaydı bulunamadı"
                                            description={searchTerm || localFilters.employee_id || localFilters.status || localFilters.date_from || localFilters.date_to ? 
                                                "Aradığınız kriterlere uygun devam kaydı bulunamadı." : 
                                                "Henüz hiç devam kaydı oluşturulmamış. Devam kaydı eklemek için aşağıdaki butona tıklayabilirsiniz."
                                            }
                                            icon={<i className="ti ti-calendar-check" aria-hidden="true"></i>}
                                            actionUrl={searchTerm || localFilters.employee_id || localFilters.status || localFilters.date_from || localFilters.date_to ?
                                                route('admin.attendance.index') :
                                                route('admin.attendance.scan')
                                            }
                                            linkText={searchTerm || localFilters.employee_id || localFilters.status || localFilters.date_from || localFilters.date_to ?
                                                "Filtreleri Temizle" :
                                                "Yeni Devam Kaydı Ekle"
                                            }
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination meta={attendances} baseUrl={route('admin.attendance.index')} only={['attendances', 'filters']} />
        </AuthenticatedLayout>
    );
}
