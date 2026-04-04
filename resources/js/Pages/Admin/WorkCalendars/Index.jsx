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

    // Helper functions
    const getStatusBadgeClass = (isActive) => {
        return isActive === true || isActive === 1
            ? 'bg-success'
            : 'bg-secondary';
    };

    const getStatusLabel = (isActive) => {
        return isActive === true || isActive === 1 ? 'Aktif' : 'Pasif';
    };

    // İstatistikler
    const stats = {
        total: calendars?.data?.length || 0,
        active: calendars?.data?.filter(c => c.is_active === true || c.is_active === 1).length || 0,
        totalWorkingDays: calendars?.data?.reduce((acc, c) => acc + (c.working_days || 0), 0) || 0,
        totalHolidays: calendars?.data?.reduce((acc, c) => acc + (c.holiday_days || 0), 0) || 0,
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Çalışma Takvimleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Çalışma Takvimleri', url: route('admin.work-calendars.index') },
                ],
                newUrl: route('admin.work-calendars.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Çalışma Takvimleri" />

            {/* Collapse Filtre Paneli */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-search me-1"></i> Arama
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Takvim adı..."
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-toggle-right me-1"></i> Durum
                                    </label>
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

                                <div className="col-md-2 d-flex align-items-end">
                                    <button type="submit" className="btn btn-primary w-100">
                                        <i className="ti ti-filter me-1"></i> Filtrele
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <i className="ti ti-calendar fs-2 text-primary mb-2"></i>
                            <h6 className="text-primary fw-medium">Toplam Takvim</h6>
                            <h3 className="fw-bold text-primary">{stats.total}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-check fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Aktif Takvim</h6>
                            <h3 className="fw-bold text-success">{stats.active}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <i className="ti ti-briefcase fs-2 text-info mb-2"></i>
                            <h6 className="text-info fw-medium">Toplam İş Günü</h6>
                            <h3 className="fw-bold text-info">{stats.totalWorkingDays}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <i className="ti ti-palm fs-2 text-warning mb-2"></i>
                            <h6 className="text-warning fw-medium">Toplam Tatil Günü</h6>
                            <h3 className="fw-bold text-warning">{stats.totalHolidays}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="card">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-calendar-event me-2"></i> Tanımlı Çalışma Takvimleri
                    </h5>
                    <Link href={route('admin.work-calendars.create')} className="btn btn-primary btn-sm">
                        <i className="ti ti-plus me-1"></i> Yeni Takvim
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Takvim Adı</th>
                                    <th className="fw-medium">Periyot</th>
                                    <th className="fw-medium text-center">Toplam Gün</th>
                                    <th className="fw-medium text-center">İş Günü</th>
                                    <th className="fw-medium text-center">Tatil Günü</th>
                                    <th className="fw-medium text-center">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {calendars?.data && calendars.data.length > 0 ? (
                                    calendars.data.map((calendar) => (
                                        <tr key={calendar.id}>
                                            <td>
                                                <div className="fw-medium">{calendar.name}</div>
                                                <small className="text-muted">{calendar.description}</small>
                                            </td>
                                            <td>
                                                <div className="fw-medium">
                                                    {calendar.start_date && calendar.end_date
                                                        ? `${new Date(calendar.start_date).toLocaleDateString('tr-TR')} - ${new Date(calendar.end_date).toLocaleDateString('tr-TR')}`
                                                        : 'Belirtilmemiş'
                                                    }
                                                </div>
                                                <small className="text-muted">
                                                    {calendar.year || (calendar.start_date ? new Date(calendar.start_date).getFullYear() : '-')}
                                                </small>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-light text-dark border">
                                                    {calendar.total_days || 0} gün
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-success">
                                                    {calendar.working_days || 0} gün
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-danger">
                                                    {calendar.holiday_days || 0} gün
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(calendar.is_active)}`}>
                                                    {getStatusLabel(calendar.is_active)}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Link
                                                        href={route('admin.work-calendars.show', calendar.id)}
                                                        className="btn btn-sm btn-outline-info"
                                                        title="Görüntüle"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.work-calendars.edit', calendar.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Düzenle"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(calendar.id)}
                                                        className="btn btn-sm btn-outline-danger"
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
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            <i className="ti ti-calendar-off fs-1 d-block mb-2"></i>
                                            Takvim tanımı bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {calendars?.meta && calendars.meta.last_page > 1 && (
                    <div className="card-footer bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-muted">
                                    {calendars.meta.from} - {calendars.meta.to} arası, toplam {calendars.meta.total} öğe
                                </small>
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    {calendars.meta.links.filter(link => link.url).map((link, index) => (
                                        <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                                            <Link
                                                href={link.url}
                                                className="page-link"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
