import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import { formatCurrency, formatPercentage } from '@/Utils/formatters';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getStatusBadgeClass } from '@/Utils/commonUtils';

export default function Index({ components, filters }) {

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.salary-components.index'), {
            ...(typeFilter && { type: typeFilter }),
            search: searchTerm,
        }, { replace: true, only: ['components', 'filters'] });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.salary-components.index'), {
            ...(key === 'type' ? { type: value } : { [key]: value }),
            search: searchTerm,
        }, { replace: true, only: ['components', 'filters'] });
    };

    const handleDelete = (id) => {
        confirmDelete('Bu kalemi silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.salary-components.destroy', id), {
                onSuccess: () => showSuccess('Kalem başarıyla silindi.'),
            });
        });
    };

    const getTypeBadgeClass = (type) => {
        return type === 'allowance' ? 'bg-success' : 'bg-danger';
    };

    const getTypeLabel = (type) => {
        return type === 'allowance' ? 'Ek Ödeme' : 'Kesinti';
    };



    // Array kontrolü
    const componentsArray = Array.isArray(components) ? components : (components?.data || []);
    
    // Ek ödemeler ve kesintileri ayır
    const allowances = componentsArray.filter(c => c.type === 'allowance');
    const deductions = componentsArray.filter(c => c.type === 'deduction');

    // İstatistikler
    const stats = {
        total: componentsArray.length || 0,
        allowances: allowances.length || 0,
        deductions: deductions.length || 0,
        active: componentsArray.filter(c => c.status === 'active').length || 0,
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Maaş Bileşenleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Maaş Bileşenleri', url: route('admin.salary-components.index') },
                ],
                newUrl: route('admin.salary-components.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Maaş Kalemleri" />

            {/* Collapse Filtre Paneli */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-search me-1"></i> Kalem Ara
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Kalem adı..."
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-filter me-1"></i> Tip
                                    </label>
                                    <select
                                        className="form-select"
                                        value={typeFilter}
                                        onChange={(e) => {
                                            setTypeFilter(e.target.value);
                                            handleFilterChange('type', e.target.value);
                                        }}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="allowance">Ek Ödeme</option>
                                        <option value="deduction">Kesinti</option>
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
                            <i className="ti ti-calculator fs-2 text-primary mb-2"></i>
                            <h6 className="text-primary fw-medium">Toplam Kalem</h6>
                            <h3 className="fw-bold text-primary">{stats.total}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-plus fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Ek Ödeme</h6>
                            <h3 className="fw-bold text-success">{stats.allowances}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-danger">
                        <div className="card-body text-center">
                            <i className="ti ti-minus fs-2 text-danger mb-2"></i>
                            <h6 className="text-danger fw-medium">Kesinti</h6>
                            <h3 className="fw-bold text-danger">{stats.deductions}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <i className="ti ti-check fs-2 text-info mb-2"></i>
                            <h6 className="text-info fw-medium">Aktif</h6>
                            <h3 className="fw-bold text-info">{stats.active}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ek Ödemeler */}
            <div className="card border-success mb-4">
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-plus me-2"></i> Ek Ödemeler ({allowances.length})
                    </h5>
                    <Link href={route('admin.salary-components.create')} className="btn btn-light btn-sm">
                        <i className="ti ti-plus me-1"></i> Yeni
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Kalem Adı</th>
                                    <th className="fw-medium text-center">Tutar/Oran</th>
                                    <th className="fw-medium text-center">Vergi</th>
                                    <th className="fw-medium text-center">SGK</th>
                                    <th className="fw-medium text-center">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allowances.length > 0 ? (
                                    allowances.map((component) => (
                                        <tr key={component.id}>
                                            <td>
                                                <Link
                                                    href={route('admin.salary-components.edit', component.id)}
                                                    className="fw-medium text-primary"
                                                >
                                                    {component.name}
                                                </Link>
                                                <small className="text-muted d-block">
                                                    {getTypeLabel(component.type)}
                                                </small>
                                            </td>
                                            <td className="text-center">
                                                {component.is_percentage
                                                    ? formatPercentage(component.percentage)
                                                    : formatCurrency(component.amount)
                                                }
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${component.taxable ? 'bg-success' : 'bg-secondary'}`}>
                                                    {component.taxable ? 'Vergilendirilir' : 'Vergisiz'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                 <span className={`badge ${component.sgk_applicable ? 'bg-success' : 'bg-secondary'}`}>
                                                    {component.sgk_applicable ? 'Dahil' : 'Dışı'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(component.status, 'shift')}`}>
                                                    {component.status === 'active' ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Link
                                                        href={route('admin.salary-components.edit', component.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Düzenle"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">
                                            <EmptyState
                                                title="Ek ödeme kalemi bulunmuyor"
                                                description="Henüz hiç ek ödeme kalemi oluşturulmamış. Yeni bir kalem oluşturmak için aşağıdaki butona tıklayabilirsiniz."
                                                icon={<i className="ti ti-plus-off"></i>}
                                                actionUrl={route('admin.salary-components.create')}
                                                linkText="Yeni Ek Ödeme Kalem Oluştur"
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Kesintiler */}
            <div className="card border-danger">
                <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-minus me-2"></i> Kesintiler ({deductions.length})
                    </h5>
                    <Link href={route('admin.salary-components.create')} className="btn btn-light btn-sm">
                        <i className="ti ti-plus me-1"></i> Yeni
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Kalem Adı</th>
                                    <th className="fw-medium text-center">Tutar/Oran</th>
                                    <th className="fw-medium text-center">Zorunlu</th>
                                    <th className="fw-medium text-center">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deductions.length > 0 ? (
                                    deductions.map((component) => (
                                        <tr key={component.id}>
                                            <td>
                                                <Link
                                                    href={route('admin.salary-components.edit', component.id)}
                                                    className="fw-medium text-primary"
                                                >
                                                    {component.name}
                                                </Link>
                                                <small className="text-muted d-block">
                                                    {getTypeLabel(component.type)}
                                                </small>
                                            </td>
                                            <td className="text-center">
                                                {component.is_percentage
                                                    ? formatPercentage(component.percentage)
                                                    : formatCurrency(component.amount)
                                                }
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${component.is_mandatory ? 'bg-danger' : 'bg-secondary'}`}>
                                                    {component.is_mandatory ? 'Zorunlu' : 'Opsiyonel'}
                                                 </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(component.status, 'shift')}`}>
                                                    {component.status === 'active' ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Link
                                                        href={route('admin.salary-components.edit', component.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Düzenle"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(component.id)}
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
                                        <td colSpan="5">
                                            <EmptyState
                                                title="Kesinti kalemi bulunmuyor"
                                                description="Henüz hiç kesinti kalemi oluşturulmamış. Yeni bir kesinti oluşturmak için aşağıdaki butona tıklayabilirsiniz."
                                                icon={<i className="ti ti-minus-off"></i>}
                                                actionUrl={route('admin.salary-components.create')}
                                                linkText="Yeni Kesinti Kalem Oluştur"
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {components?.meta && components.meta.last_page > 1 && (
                <div className="card-footer bg-light mt-4">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <small className="text-muted">
                                {components.meta.from} - {components.meta.to} arası, toplam {components.meta.total} öğe
                            </small>
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                {components.meta.links.filter(link => link.url).map(link => (
                                    <li key={link.url || link.label} className={`page-item ${link.active ? 'active' : ''}`}>
                                        <Link
                                            href={link.url}
                                            className="page-link"
                                            data={{ only: ['components', 'filters'] }}
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
        </AuthenticatedLayout>
    );
}
