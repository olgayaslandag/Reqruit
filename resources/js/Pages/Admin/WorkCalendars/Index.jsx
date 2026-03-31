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

    // Yılları hesapla
    const getCalendarYears = (calendarsList) => {
        const years = new Set();
        calendarsList.forEach(calendar => {
            if (calendar.start_date && calendar.end_year) {
                const startYear = new Date(calendar.start_date).getFullYear();
                const endYear = calendar.end_year || startYear + 1;
                for(let y = startYear; y <= endYear; y++) {
                    years.add(y);
                }
            } else {
                years.add(new Date().getFullYear());
            }
        });
        return Array.from(years).sort().reverse();
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
            }}
        >
            <Head title="İş Takvimleri" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    {/* Filtreleme ve Arama Paneli */}
                    <div className="bg-white rounded-3 shadow-sm-md mb-5 p-4">
                        <form onSubmit={handleSearch} className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Arama
                                </label>
                                <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Takvim adı..."
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <div className="d-flex-1">
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Status
                                    </label>
                                    <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={localFilters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Pasif</option>
                                        <option value="archived">Arşivlenmiş</option>
                                        <option value="draft">Taslak</option>
                                    </select>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm ms-auto"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Takvim Listesi */}
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Tanımlı İş Takvimleri</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Takvim Adı
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Periyot
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Gün
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            İş Günü
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Tatil Günü
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {calendars?.data && calendars.data.length > 0 ? (
                                        calendars.data.map((calendar) => (
                                            <tr key={calendar.id} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {calendar.name}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {calendar.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-muted">
                                                    <div className="fw-medium">
                                                        {calendar.start_date ? new Date(calendar.start_date).toLocaleDateString('tr-TR') + ' - ' + new Date(calendar.end_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                                    </div>
                                                    <div className="fs-xs text-muted">
                                                        {calendar.start_date ? new Date(calendar.start_date).getFullYear() : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {calendar.total_days || 0} gün
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm">
                                                    <span className="d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium bg-success bg-opacity-10 text-success">
                                                        {calendar.working_days || 0} gün
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm">
                                                    <span className="d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium bg-danger bg-opacity-10 text-danger">
                                                        {calendar.holiday_days || 0} gün
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        calendar.is_active === true || calendar.is_active === 1
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : 'bg-danger bg-opacity-10 text-danger'
                                                    }`}>
                                                        {calendar.is_active === true || calendar.is_active === 1 ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                                    <div className="d-flex justify-content-end">
                                                        <Link
                                                            href={route('admin.work-calendars.show', calendar.id)}
                                                            className="text-info hover:text-blue-900"
                                                        >
                                                            Görüntüle
                                                        </Link>
                                                        <Link
                                                            href={route('admin.work-calendars.edit', calendar.id)}
                                                            className="text-primary hover:text-indigo-900"
                                                        >
                                                            Düzenle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(calendar.id)}
                                                            className="text-danger hover:text-red-900 ml-4"
                                                        >
                                                            Sil
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center fs-sm text-muted">
                                                Takvim tanımı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {calendars?.meta && calendars.meta.last_page > 1 && (
                            <div className="px-6 py-4 table-light border-t border-secondary">
                                <nav className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between d-flex-1">
                                        <div>
                                            <p className="fs-sm text-dark">
                                                {calendars.meta.from} - {calendars.meta.to} arası, toplam {calendars.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="d-flex space-x-2">
                                                {calendars.meta.links.filter(link => link.url).map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`position-relative d-inline-d-flex align-items-center px-4 py-2 border fs-sm fw-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-primary'
                                                                : 'bg-white border-secondary text-dark hover:table-light'
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

                    {/* Takvim Türlerine Göre Hızlı Filtreleme */}
                    <div className="mt-6 d-grid d-grid-cols-2 gap-3">
                        {getCalendarYears(calendars?.data || []).map(year => (
                            <div key={year} className="bg-white rounded-3 shadow-sm p-4">
                                <h5 className="fw-medium text-dark mb-2">{year} Yılı Takvimi</h5>
                                <p className="fs-sm text-muted">
                                    {calendars?.data?.filter(c => 
                                        new Date(c.start_date).getFullYear() <= year && 
                                        new Date(c.end_date).getFullYear() >= year
                                    ).length || 0} takvim mevcut
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Hızlı İstatistikler */}
                    <div className="mt-6 d-grid d-grid-cols-1 gap-3">
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                            <div className="text-center">
                                <h5 className="fw-medium text-info">Aktif Takvim</h5>
                                <p className="h2 fw-bold text-info mt-2">
                                    {calendars?.data?.filter(c => c.status === 'active').length || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-4">
                            <div className="text-center">
                                <h5 className="fw-medium text-success">Yılbaşı Tatlileri</h5>
                                <p className="h2 fw-bold text-success mt-2">
                                    {calendars?.data?.reduce((acc, c) => acc + (c.holiday_days || 0), 0) || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded p-4">
                            <div className="text-center">
                                <h5 className="fw-medium">Toplam Hedef Gün</h5>
                                <p className="h2 fw-bold text-purple-600 mt-2">
                                    {calendars?.data?.reduce((acc, c) => acc + (c.working_days || 0), 0) || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}