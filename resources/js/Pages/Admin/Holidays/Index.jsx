import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmptyState from '@/Components/EmptyState';
import { showError, showSuccess, confirmDelete } from '@/Utils/sweetAlert';
import { useFlashWithToast } from '@/Hooks/useFlash';

export default function Index({ holidays, filters = {} }) {
    const flash = useFlashWithToast();

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        type: filters?.type || ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.holidays.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true, only: ['holidays', 'filters'] });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.holidays.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true, only: ['holidays', 'filters'] });
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

    // Helper functions
    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'official':
                return 'bg-danger';
            case 'company':
                return 'bg-warning text-dark';
            case 'public_holiday':
                return 'bg-danger';
            case 'religious_holiday':
                return 'bg-success';
            case 'national_holiday':
                return 'bg-primary';
            case 'international_holiday':
                return 'bg-info';
            default:
                return 'bg-secondary';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'official':
            case 'public_holiday':
                return 'Resmi Tatil';
            case 'company':
                return 'Şirket Tatili';
            case 'religious_holiday':
                return 'Dini Bayram';
            case 'national_holiday':
                return 'Ulusal Bayram';
            case 'international_holiday':
                return 'Uluslararası Gün';
            default:
                return type;
        }
    };

    // İstatistikler
    const stats = {
        total: holidays?.data?.length || 0,
        official: holidays?.data?.filter(h => h.type === 'official' || h.type === 'public_holiday').length || 0,
        recurring: holidays?.data?.filter(h => h.recurring).length || 0,
    };

    // Yaklaşan tatiller
    const now = new Date();
    const upcomingHolidays = (holidays?.data || [])
        .filter(h => new Date(h.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

    // Yıllar
    const years = [...new Set(
        (holidays?.data || []).map(holiday => new Date(holiday.date).getFullYear())
    )].sort().reverse();

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Resmi Tatiller',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Resmi Tatiller', url: route('admin.holidays.index') },
                ],
                newUrl: route('admin.holidays.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Resmi Tatiller" />

            {/* Collapse Filtre Paneli */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-search me-1" aria-hidden="true"></i> Arama
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Tatil adı..."
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-tag me-1" aria-hidden="true"></i> Tür
                                    </label>
                                    <select
                                        className="form-select"
                                        value={localFilters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="official">Resmi Tatil</option>
                                        <option value="company">Şirket Tatili</option>
                                        <option value="public_holiday">Resmi Tatil</option>
                                        <option value="religious_holiday">Dini Bayram</option>
                                        <option value="national_holiday">Ulusal Bayram</option>
                                    </select>
                                </div>

                                <div className="col-md-2 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100" aria-label="Filtrele">
                                    <i className="ti ti-filter me-1" aria-hidden="true"></i> Filtrele
                                </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Sol Panel - Ana Tablo */}
                <div className="col-lg-8">
                    {/* Stats Cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card border-primary">
                                <div className="card-body text-center">
                                    <i className="ti ti-calendar fs-2 text-primary mb-2" aria-hidden="true"></i>
                                    <h6 className="text-primary fw-medium">Toplam Tatil</h6>
                                    <h3 className="fw-bold text-primary">{stats.total}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-danger">
                                <div className="card-body text-center">
                                    <i className="ti ti-flag fs-2 text-danger mb-2" aria-hidden="true"></i>
                                    <h6 className="text-danger fw-medium">Resmi Tatil</h6>
                                    <h3 className="fw-bold text-danger">{stats.official}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-success">
                                <div className="card-body text-center">
                                    <i className="ti ti-repeat fs-2 text-success mb-2" aria-hidden="true"></i>
                                    <h6 className="text-success fw-medium">Yıllık Tekrar</h6>
                                    <h3 className="fw-bold text-success">{stats.recurring}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tatiller Tablosu */}
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-calendar-event me-2" aria-hidden="true"></i> Tatil Listesi
                            </h5>
                            <Link href={route('admin.holidays.create')} className="btn btn-primary btn-sm" aria-label="Yeni tatil oluştur">
                                <i className="ti ti-plus me-1" aria-hidden="true"></i> Yeni Tatil
                            </Link>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="fw-medium">Tatil Adı</th>
                                            <th className="fw-medium">Tarih</th>
                                            <th className="fw-medium text-center">Tekrar</th>
                                            <th className="fw-medium text-center">Tür</th>
                                            <th className="fw-medium text-end">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {holidays?.data && holidays.data.length > 0 ? (
                                            holidays.data.map((holiday) => (
                                                <tr key={holiday.id}>
                                                    <td>
                                                        <div className="fw-medium">{holiday.name}</div>
                                                        {holiday.local_name && (
                                                            <small className="text-muted">{holiday.local_name}</small>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="fw-medium">
                                                            {new Date(holiday.date).toLocaleDateString('tr-TR', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                        <small className="text-muted">
                                                            {new Date(holiday.date).toLocaleDateString('tr-TR', { weekday: 'long' })}
                                                        </small>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`badge ${holiday.recurring ? 'bg-success' : 'bg-secondary'}`}>
                                                            {holiday.recurring ? 'Evet' : 'Hayır'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`badge ${getTypeBadgeClass(holiday.type)}`}>
                                                            {getTypeLabel(holiday.type)}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="d-flex justify-content-end gap-1">
                                                            <button
                                                                onClick={() => addToCalendar(holiday.id)}
                                                                className="btn btn-sm btn-outline-success"
                                                                title="Takvime Ekle"
                                                                aria-label={`Tatili takvime ekle: ${holiday.name}`}
                                                            >
                                                                <i className="ti ti-calendar-plus" aria-hidden="true"></i>
                                                            </button>
                                                            <Link
                                                                href={route('admin.holidays.edit', holiday.id)}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="Düzenle"
                                                                aria-label={`Tatili düzenle: ${holiday.name}`}
                                                            >
                                                                <i className="ti ti-edit" aria-hidden="true"></i>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(holiday.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Sil"
                                                                aria-label={`Tatili sil: ${holiday.name}`}
                                                            >
                                                                <i className="ti ti-trash" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">
                                                    <EmptyState
                                                        title="Tatil tanımı bulunamadı"
                                                        description={filters.search || filters.type ? 
                                                            "Aradığınız kriterlere uygun resmi tatil bulunamadı." : 
                                                            "Henüz hiç resmi tatil tanımlanmamış. Yeni bir tatil tanımlamak için aşağıdaki butona tıklayabilirsiniz."
                                                        }
                                                        icon={<i className="ti ti-calendar-event" aria-hidden="true"></i>}
                                                        actionUrl={filters.search || filters.type ?
                                                            route('admin.holidays.index') :
                                                            route('admin.holidays.create')
                                                        }
                                                        linkText={filters.search || filters.type ?
                                                            "Filtreleri Temizle" :
                                                            "Yeni Resmi Tatil Tanımla"
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {holidays?.meta && holidays.meta.last_page > 1 && (
                            <div className="card-footer bg-light">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <small className="text-muted">
                                            {holidays.meta.from} - {holidays.meta.to} arası, toplam {holidays.meta.total} öğe
                                        </small>
                                    </div>
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0">
                                            {holidays.meta.links.filter(link => link.url).map(link => (
                                                <li key={link.url || link.label} className={`page-item ${link.active ? 'active' : ''}`}>
                                                    <Link
                                                        href={link.url}
                                                        className="page-link"
                                                        data={{ only: ['holidays', 'filters'] }}
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
                </div>

                {/* Sağ Panel - Yaklaşan Tatiller ve Yıllar */}
                <div className="col-lg-4">
                    {/* Yaklaşan Tatiller */}
                    <div className="card border-info mb-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-calendar-time me-1" aria-hidden="true"></i> Yaklaşan Tatiller
                            </h6>
                        </div>
                        <div className="card-body">
                            {upcomingHolidays.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {upcomingHolidays.map(holiday => (
                                        <div key={holiday.id} className="list-group-item d-flex align-items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center holiday-calendar-cell">
                                                    <span className="fw-bold text-danger fs-5">
                                                        {new Date(holiday.date).getDate()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 fw-medium">{holiday.name}</h6>
                                                <small className="text-muted">
                                                    {new Date(holiday.date).toLocaleDateString('tr-TR', {
                                                        weekday: 'short',
                                                        month: 'short'
                                                    })}
                                                </small>
                                                <span className={`badge ${getTypeBadgeClass(holiday.type)} ms-2`}>
                                                    {getTypeLabel(holiday.type)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <EmptyState
                                        title="Yaklaşan tatil bulunamadı"
                                        description="Gelecek dönemde yaklaşan resmi tatiller bulunmamaktadır. Yeni tatil tanımlamak için aşağıdaki butona tıklayabilirsiniz."
                                         icon={<i className="ti ti-calendar-time" aria-hidden="true"></i>}
                                        actionUrl={route('admin.holidays.create')}
                                        linkText="Yeni Tatil Ekle"
                                        className="py-0"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Yıllara Göre Filtreleme */}
                    <div className="card">
                        <div className="card-header bg-light">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-filter me-1" aria-hidden="true"></i> Yıllara Göre
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-2">
                                {years.map(year => {
                                    const yearHolidays = (holidays?.data || []).filter(h =>
                                        new Date(h.date).getFullYear() === year
                                    );
                                    return (
                                        <div key={year} className="col-6">
                                            <Link
                                                href={route('admin.holidays.index', { year })}
                                                className="btn btn-outline-primary w-100"
                                                data={{ only: ['holidays', 'filters'] }}
                                            >
                                                <div className="fw-bold">{year}</div>
                                                <small>{yearHolidays.length} tatil</small>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
