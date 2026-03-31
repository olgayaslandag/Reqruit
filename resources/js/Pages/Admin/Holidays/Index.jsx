import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess, confirmDelete } from '@/Utils/sweetAlert';

export default function Index({ holidays, filters = {} }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [localFilters, setLocalFilters] = useState({
        category: filters?.category || ''
    });

    const categories = [...new Set(holidays?.data?.map(h => h.type) || [])];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.holidays.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.holidays.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
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

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Resmi Tatiller
                    </h5>
                    <Link
                        href={route('admin.holidays.create')}
                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Tatil
                    </Link>
                </div>
            }
        >
            <Head title="Resmi Tatiller" />

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
                                    placeholder="Tatil adı..."
                                />
                            </div>

                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Kategori
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={localFilters.category || localFilters.type || ''}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'official' ? 'Resmi Tatil' : category === 'company' ? 'Şirket Tatili' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-flex align-items-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm w-100"
                                >
                                    Ara
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tatiller Listesi */}
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Tanımlı Resmi Tatiller</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Tatil Adı
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Yılılacak mı?
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Açıklama
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {holidays?.data && holidays.data.length > 0 ? (
                                        holidays.data.map((holiday) => (
                                            <tr key={holiday.id} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {holiday.name}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {holiday.local_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {new Date(holiday.date).toLocaleDateString('tr-TR', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: 'numeric' 
                                                        })}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        {new Date(holiday.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                        holiday.recurring 
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : 'bg-danger bg-opacity-10 text-danger'
                                                    }`}>
                                                        {holiday.recurring ? 'Evet' : 'Hayır'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className="px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill bg-primary bg-opacity-10 text-info">
                                                        {holiday.type === 'official' ? 'Resmi Tatil' : holiday.type === 'company' ? 'Şirket Tatili' : holiday.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 fs-sm text-muted mw-100">
                                                    {holiday.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            onClick={() => addToCalendar(holiday.id)}
                                                            className="text-success hover:text-green-900"
                                                        >
                                                            Takvime Ekle
                                                        </button>
                                                        <Link
                                                            href={route('admin.holidays.edit', holiday.id)}
                                                            className="text-primary hover:text-indigo-900 ml-3"
                                                        >
                                                            Düzenle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(holiday.id)}
                                                            className="text-danger hover:text-red-900 ml-3"
                                                        >
                                                            Sil
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center fs-sm text-muted">
                                                Tatil tanımı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {holidays?.meta && holidays?.meta.last_page > 1 && (
                            <div className="px-6 py-4 table-light border-t border-secondary">
                                <nav className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between d-flex-1">
                                        <div>
                                            <p className="fs-sm text-dark">
                                                {holidays.meta.from} - {holidays.meta.to} arası, toplam {holidays.meta.total} öğe
                                            </p>
                                        </div>
                                        <div>
                                            <div className="d-flex space-x-2">
                                                {holidays.meta.links.filter(link => link.url).map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`position-relative d-inline-d-flex align-items-center px-4 py-2 border fs-sm fw-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-primary'
                                                                : 'bg-white border-secondary text-dark hover:table-light'
                                                        }`}
                                                    >
                                                        {link.label.replace(/\&\w+;/g, match => {
                                                            const replacements = { '&laquo;': '«', '&raquo;': '»' };
                                                            return replacements[match];
                                                        })}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Türkiye'nin Yıllık Tatil Takvimi */}
                    <div className="mt-8 bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Resmi Tatiller (Yaklaşanlar)</h5>
                        </div>
                        
                        <div className="p-4">
                                         {(() => {
                                             const now = new Date();
                                             const upcomingHolidays = (holidays?.data || holidays || [])
                                                 .filter(h => new Date(h.date) > now)
                                                 .sort((a, b) => new Date(a.date) - new Date(b.date))
                                                 .slice(0, 6);

                                             if (upcomingHolidays.length > 0) {
                                    return (
                                        <div className="d-grid d-grid-cols-1 gap-3">
                                            {upcomingHolidays.map(holiday => (
                                                <div key={holiday.id} className="border rounded p-4 table-light">
                                                    <div className="d-flex align-items-start">
                                                        <div className="d-flex-shrink-0">
                                                            <div className="w-10 h-10 rounded-pill bg-danger bg-opacity-10 d-flex align-items-center justify-content-center">
                                                                <span className="text-danger fw-bold fs-sm">
                                                                    {new Date(holiday.date).getDate()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h5 className="fw-medium text-dark">{holiday.name}</h5>
                                                            <p className="fs-xs text-muted">
                                                                {new Date(holiday.date).toLocaleDateString('tr-TR', { 
                                                                    weekday: 'short', 
                                                                    month: 'short' 
                                                                })}
                                                            </p>
                                                             <div className="mt-1">
                                                                 <span className="d-inline-d-flex align-items-center px-2 py-0.5 rounded fs-xs fw-medium bg-primary bg-opacity-10 text-info">
                                                                     {holiday.type === 'official' ? 'Resmi Tatil' : 'Şirket Tatili'}
                                                                 </span>
                                                             </div>
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 fs-xs text-muted">
                                                        {holiday.local_name || holiday.description || '-'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <p className="text-center fs-sm text-muted py-4">
                                            Yaklaşan tatil bulunamadı.
                                        </p>
                                    );
                                }
                            })()}
                        </div>
                    </div>

                    {/* Yıllara Göre Hızlı Gözat */}
                    <div className="mt-6 d-grid d-grid-cols-2 gap-3">
                        {(() => {
                            const years = [...new Set(
                                (holidays?.data || []).map(holiday => 
                                    new Date(holiday.date).getFullYear()
                                )
                            )].sort().reverse();
                            
                            return years.map(year => {
                                const yearHolidays = (holidays?.data || []).filter(h => 
                                    new Date(h.date).getFullYear() === year
                                );
                                
                                return (
                                    <Link
                                        key={year}
                                        href={route('admin.holidays.index', { year })}
                                        className="bg-white rounded-3 shadow-sm p-4 text-center hover:shadow-sm-md -shadow-sm"
                                    >
                                        <h5 className="fw-medium text-dark">{year}</h5>
                                        <p className="fs-sm text-muted">{yearHolidays.length} resmi tatil</p>
                                    </Link>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}