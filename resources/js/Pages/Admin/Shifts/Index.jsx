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
            pageHeader={{
                title: 'Vardiyalar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Vardiyalar', url: route('admin.shifts.index') },
                ],
                newUrl: route('admin.shifts.create'),
            }}
        >
            <Head title="Vardiyalar" />

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
                                    placeholder="Vardiya adı, açıklama..."
                                />
                            </div>

                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Departman
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={localFilters.department_id}
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

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm ms-auto"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Vardiya Listesi */}
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Vardiya Tanımları</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Vardiya Adı
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Giriş Saati
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Çıkış Saati
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Mola Süresi
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
                                    {shifts?.data && shifts.data.length > 0 ? (
                                        shifts.data.map((shift) => (
                                            <tr key={shift.id} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {shift.name}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {shift.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-muted">
                                                    {shift.department?.title || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm fw-bold text-dark">
                                                    {shift.start_time}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm fw-bold text-dark">
                                                    {shift.end_time}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-muted">
                                                    {shift.break_duration || '00:00'} saat
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        shift.status === 'active' 
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : 'bg-danger bg-opacity-10 text-danger'
                                                    }`}>
                                                        {shift.status === 'active' ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                                    <div className="d-flex justify-content-end">
                                                        <Link
                                                            href={route('admin.shifts.schedules', shift.id)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 fs-xs"
                                                        >
                                                            Atamalar
                                                        </Link>
                                                        <Link
                                                            href={route('admin.shifts.edit', shift.id)}
                                                            className="text-primary hover:text-indigo-900"
                                                        >
                                                            Düzenle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(shift.id)}
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
                                                Vardiya tanımı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {shifts?.meta && shifts.meta.last_page > 1 && (
                            <div className="px-6 py-4 table-light border-t border-secondary">
                                <nav className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between d-flex-1">
                                        <div>
                                            <p className="fs-sm text-dark">
                                                {shifts.meta.from} - {shifts.meta.to} arası, toplam {shifts.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="d-flex space-x-2">
                                                {(shifts?.meta?.links || []).filter(link => link.url).map((link, index) => (
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

                    {/* Vardiya Türü Listesi */}
                    <div className="mt-8 bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Yaygın Vardiya Türleri</h5>
                        </div>
                        
                        <div className="d-grid d-grid-cols-1 gap-3 p-4">
                            <div className="border rounded p-4">
                                <h5 className="fw-medium text-dark mb-2">Tam Zamanlı</h5>
                                <p className="fs-sm text-muted">09:00 - 18:00 | 1 saat mola</p>
                                <p className="fs-xs text-muted mt-1">Standart hafta içi saatler</p>
                            </div>
                            <div className="border rounded p-4">
                                <h5 className="fw-medium text-dark mb-2">Gece Vardiyası</h5>
                                <p className="fs-sm text-muted">22:00 - 06:00 | 1 saat mola</p>
                                <p className="fs-xs text-muted mt-1">22:00 saatinden sonra biten vardiyalar</p>
                            </div>
                            <div className="border rounded p-4">
                                <h5 className="fw-medium text-dark mb-2">Geçmiş Vardiyası</h5>
                                <p className="fs-sm text-muted">07:00 - 15:00 | 45 dk mola</p>
                                <p className="fs-xs text-muted mt-1">Erken sabah başlayan vardiyalar</p>
                            </div>
                            <div className="border rounded p-4">
                                <h5 className="fw-medium text-dark mb-2">Part-Time</h5>
                                <p className="fs-sm text-muted">12:00 - 20:00 | 30 dk mola</p>
                                <p className="fs-xs text-muted mt-1">Kısmi zamanlı çalışanlar için</p>
                            </div>
                            <div className="border rounded p-4">
                                <h5 className="fw-medium text-dark mb-2">Haftasonu Servisi</h5>
                                <p className="fs-sm text-muted">10:00 - 22:00 | 1 saat mola</p>
                                <p className="fs-xs text-muted mt-1">Hafta sonu çalışanları için</p>
                            </div>
                            <div className="border rounded p-4">
                                <h5 className="fw-medium text-dark mb-2">Esnek Vardiya</h5>
                                <p className="fs-sm text-muted">08:00-22:00 arası | 1-2 saat</p>
                                <p className="fs-xs text-muted mt-1">Giriş-çıkış süreleri değişebilen</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}