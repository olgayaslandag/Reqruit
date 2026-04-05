import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatDate, formatCurrency } from '@/Utils/formatters';

export default function Show({ component }) {
    const getTypeBadgeClass = (type) => type === 'earning' ? 'bg-success' : 'bg-danger';
    const getCategoryBadgeClass = (cat) => cat === 'position-fixed' ? 'bg-primary' : 'bg-warning text-dark';

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: component.name,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Maaş Bileşenleri', url: route('admin.salary-components.index') },
                    { label: component.name, url: route('admin.salary-components.show', component.id) },
                ],
                backUrl: route('admin.salary-components.index'),
            }}
        >
            <Head title={`Maaş Kalemı - ${component.name}`} />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-calculator me-2"></i> Kalem Detayları
                            </h5>
                            <div>
                                <Link
                                    href={route('admin.salary-components.edit', component.id)}
                                    className="btn btn-primary btn-sm"
                                >
                                    <i className="ti ti-edit me-1"></i> Düzenle
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                {/* Genel Bilgiler */}
                                <div className="col-md-6">
                                    <div className="card border-light h-100">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 fw-bold">Genel Bilgiler</h6>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-muted">Ad:</td>
                                                        <td className="text-end fw-medium">{component.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Kod:</td>
                                                        <td className="text-end">
                                                            <span className="badge bg-light text-dark border">{component.code}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Tip:</td>
                                                        <td className="text-end">
                                                            <span className={`badge ${getTypeBadgeClass(component.type)}`}>
                                                                {component.type === 'earning' ? 'Kazanç' : 'Kesinti'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Kategori:</td>
                                                        <td className="text-end">
                                                            <span className={`badge ${getCategoryBadgeClass(component.category)}`}>
                                                                {component.category === 'position-fixed' ? 'Sabit' : 'Değişken'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Varsayılan Tutar:</td>
                                                        <td className="text-end fw-medium">
                                                            {component.default_amount ? formatCurrency(component.default_amount) : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Sıralama:</td>
                                                        <td className="text-end">{component.sort_order}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Ayarlar */}
                                <div className="col-md-6">
                                    <div className="card border-light h-100">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 fw-bold">Ayarlar</h6>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-muted">Durum:</td>
                                                        <td className="text-end">
                                                            <span className={`badge ${component.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                {component.is_active ? 'Aktif' : 'Pasif'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Vergilendirilir:</td>
                                                        <td className="text-end">
                                                            <span className={`badge ${component.is_taxable ? 'bg-success' : 'bg-secondary'}`}>
                                                                {component.is_taxable ? 'Evet' : 'Hayır'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">SGK Uygulanır:</td>
                                                        <td className="text-end">
                                                            <span className={`badge ${component.is_sgk_applicable ? 'bg-success' : 'bg-secondary'}`}>
                                                                {component.is_sgk_applicable ? 'Evet' : 'Hayır'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Açıklama:</td>
                                                        <td className="text-end text-muted">
                                                            {component.description || '-'}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Açıklama Kutusu */}
                            {component.description && (
                                <div className="mt-4">
                                    <div className="card border-light">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 fw-bold">Açıklama</h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0">{component.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sağ Panel */}
                <div className="col-lg-4">
                    <div className="card border-primary mb-4">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Kalem Detayları
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Oluşturulma Tarihi</label>
                                <div className="fw-medium">{formatDate(component.created_at)}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Son Güncelleme</label>
                                <div className="fw-medium">{formatDate(component.updated_at)}</div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Kalem ID</label>
                                <div className="fw-medium text-muted">#{component.id}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-info">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-file-text me-1"></i> JSON Verisi
                            </h6>
                        </div>
                        <div className="card-body p-0">
                            <pre className="bg-light p-3 m-0 rounded code-font-small">
                                {JSON.stringify(component, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
