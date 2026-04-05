import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmptyState from '@/Components/EmptyState';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import { useFlashWithToast } from '@/Hooks/useFlash';
import Pagination from '@/Components/Pagination';

export default function Index({ shifts, employees = [], departments = [], filters = {} }) {
    const flash = useFlashWithToast();

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        department_id: filters?.department_id || '',
        status: filters?.status || ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.shifts.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true, only: ['shifts', 'filters'] });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.shifts.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true, only: ['shifts', 'filters'] });
    };

    const handleReset = () => {
        setSearchTerm('');
        setLocalFilters({
            department_id: '',
            status: ''
        });
        router.get(route('admin.shifts.index'), {}, { replace: true, only: ['shifts', 'filters'] });
    };

    const handleDelete = (id) => {
        confirmDelete('Bu vardiyayı silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.shifts.destroy', id), {
                onSuccess: () => showSuccess('Vardiya başarıyla silindi.'),
            });
        });
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return <span className="badge bg-success">Aktif</span>;
        }
        return <span className="badge bg-secondary">Pasif</span>;
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Vardiyalar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Vardiyalar', url: route('admin.shifts.index') },
                ],
                newUrl: route('admin.shifts.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Vardiyalar" />

            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-medium">Arama</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Vardiya adı..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-medium">Departman</label>
                                    <select
                                        className="form-select"
                                        value={localFilters.department_id}
                                        onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        {(departments || []).map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-medium">Durum</label>
                                    <select
                                        className="form-select"
                                        value={localFilters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Pasif</option>
                                    </select>
                                </div>

                                <div className="col-md-2 d-flex align-items-end gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        <i className="ti ti-search me-1"></i> Ara
                                    </button>
                                    <button type="button" onClick={handleReset} className="btn btn-light">
                                        <i className="ti ti-refresh me-1"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-clock me-2"></i> Vardiya Tanımları
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Vardiya Adı</th>
                                    <th className="fw-medium">Departman</th>
                                    <th className="fw-medium">Giriş Saati</th>
                                    <th className="fw-medium">Çıkış Saati</th>
                                    <th className="fw-medium">Mola</th>
                                    <th className="fw-medium">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts?.data && shifts.data.length > 0 ? (
                                    shifts.data.map((shift) => (
                                        <tr key={shift.id}>
                                            <td>
                                                <div className="fw-medium">{shift.name}</div>
                                                {shift.description && (
                                                    <small className="text-muted">{shift.description}</small>
                                                )}
                                            </td>
                                            <td>{shift.department?.title || '-'}</td>
                                            <td>
                                                <span className="badge bg-light text-dark">{shift.start_time}</span>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark">{shift.end_time}</span>
                                            </td>
                                            <td>{shift.break_duration || 0} dk</td>
                                            <td>{getStatusBadge(shift.status)}</td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <Link
                                                        href={route('admin.shifts.schedules', shift.id)}
                                                        className="btn btn-outline-primary"
                                                        title="Atamalar"
                                                    >
                                                        <i className="ti ti-users"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.shifts.edit', shift.id)}
                                                        className="btn btn-outline-secondary"
                                                        title="Düzenle"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(shift.id)}
                                                        className="btn btn-outline-danger"
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
                                        <td colSpan="7">
                                            <EmptyState
                                                title="Vardiya bulunamadı"
                                                description={filters.search || filters.department_id || filters.status ?
                                                    "Aradığınız kriterlere uygun vardiya bulunamadı." :
                                                    "Henüz hiç vardiya tanımlanmamış. Yeni bir vardiya oluşturmak için aşağıdaki butona tıklayabilirsiniz."
                                                }
                                                icon={<i className="ti ti-clock"></i>}
                                                actionUrl={filters.search || filters.department_id || filters.status ?
                                                    route('admin.shifts.index') :
                                                    route('admin.shifts.create')
                                                }
                                                linkText={filters.search || filters.department_id || filters.status ?
                                                    "Filtreleri temizle" :
                                                    "Yeni Vardiya Tanımla"
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Pagination meta={shifts} baseUrl={route('admin.shifts.index')} />
        </AuthenticatedLayout>
    );
}
