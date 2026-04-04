import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate } from '@/Utils/formatters';

export default function Edit({ component }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: component.name,
        code: component.code,
        type: component.type,
        category: component.category,
        description: component.description,
        is_active: component.is_active,
        is_taxable: component.is_taxable,
        is_sgk_applicable: component.is_sgk_applicable,
        default_amount: component.default_amount,
        sort_order: component.sort_order,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.salary-components.update', component.id), {
            onSuccess: () => {
                showSuccess('Maaş kalemi güncellendi.');
            },
            onError: () => {
                showError('Güncelleme sırasında hata oluştu.');
            }
        });
    };

    const getTypeBadgeClass = (type) => type === 'earning' ? 'bg-success' : 'bg-danger';
    const getCategoryBadgeClass = (cat) => cat === 'position-fixed' ? 'bg-primary' : 'bg-warning text-dark';

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Maaş Kalemi Güncelle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Maaş Bileşenleri', url: route('admin.salary-components.index') },
                    { label: component.name, url: route('admin.salary-components.edit', component.id) },
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
                                <i className="ti ti-calculator me-2"></i> Kalem Bilgileri
                            </h5>
                            <div>
                                <span className={`badge ${getTypeBadgeClass(component.type)} me-1`}>
                                    {component.type === 'earning' ? 'Kazanç' : 'Kesinti'}
                                </span>
                                <span className={`badge ${getCategoryBadgeClass(component.category)}`}>
                                    {component.category === 'position-fixed' ? 'Sabit' : 'Değişken'}
                                </span>
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Kalem Adı */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-tag me-1"></i> Kalem Adı <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Kod */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-code me-1"></i> Kod <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            required
                                        />
                                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                                    </div>

                                    {/* Varsayılan Tutar */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-coin me-1"></i> Varsayılan Tutar
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={data.default_amount}
                                            onChange={(e) => setData('default_amount', e.target.value)}
                                            min="0"
                                        />
                                    </div>

                                    {/* Tip */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-category me-1"></i> Tip <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                        >
                                            <option value="earning">Kazanç (Ek Ödeme)</option>
                                            <option value="deduction">Kesinti</option>
                                        </select>
                                    </div>

                                    {/* Kategori */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-folder me-1"></i> Kategori
                                        </label>
                                        <select
                                            className="form-select"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                        >
                                            <option value="position-fixed">Sabit</option>
                                            <option value="variable">Değişken</option>
                                        </select>
                                    </div>

                                    {/* Sıralama */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-list-numbers me-1"></i> Sıralama
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>

                                    {/* Açıklama */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-file-text me-1"></i> Açıklama
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                                    </div>

                                    {/* Checkbox'lar */}
                                    <div className="col-md-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_active"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_active">
                                                Aktif
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_taxable"
                                                checked={data.is_taxable}
                                                onChange={(e) => setData('is_taxable', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_taxable">
                                                Vergilendirilir
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_sgk_applicable"
                                                checked={data.is_sgk_applicable}
                                                onChange={(e) => setData('is_sgk_applicable', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_sgk_applicable">
                                                SGK Uygulanır
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link
                                        href={route('admin.salary-components.index')}
                                        className="btn btn-light"
                                    >
                                        <i className="ti ti-arrow-left me-1"></i> İptal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn btn-primary"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Güncelleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Güncelle
                                            </>
                                        )}
                                    </button>
                                </div>

                                {recentlySuccessful && (
                                    <div className="alert alert-success mt-3" role="alert">
                                        <i className="ti ti-check me-2"></i> Kaydedildi.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sağ Panel - Detay */}
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

                    <div className="card border-info mb-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-settings me-1"></i> Durum
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-2">
                                <div className="d-flex justify-content-between">
                                    <span>Durum:</span>
                                    <span className={`badge ${component.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                        {component.is_active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="d-flex justify-content-between">
                                    <span>Vergi:</span>
                                    <span className={`badge ${component.is_taxable ? 'bg-success' : 'bg-secondary'}`}>
                                        {component.is_taxable ? 'Evet' : 'Hayır'}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-0">
                                <div className="d-flex justify-content-between">
                                    <span>SGK:</span>
                                    <span className={`badge ${component.is_sgk_applicable ? 'bg-success' : 'bg-secondary'}`}>
                                        {component.is_sgk_applicable ? 'Evet' : 'Hayır'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
