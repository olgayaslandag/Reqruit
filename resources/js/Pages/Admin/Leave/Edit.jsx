import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate } from '@/Utils/formatters';

export default function Edit({ leaveType }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: leaveType.name || '',
        code: leaveType.code || '',
        is_paid: leaveType.is_paid ?? true,
        requires_document: leaveType.requires_document ?? false,
        max_duration_days: leaveType.max_duration_days || '',
        description: leaveType.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.leave.types.update', leaveType.id), {
            onSuccess: () => {
                showSuccess('İzin türü güncellendi.');
            },
            onError: () => {
                showError('Güncelleme sırasında hata oluştu.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'İzin Türü Güncelle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İzin Yönetimi', url: '#' },
                    { label: 'İzin Türleri', url: route('admin.leave.types.index') },
                    { label: leaveType.name, url: route('admin.leave.types.edit', leaveType.id) },
                ],
                backUrl: route('admin.leave.types.index'),
            }}
        >
            <Head title={`İzin Türü - ${leaveType.name}`} />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-tag me-2"></i> İzin Türü Bilgileri
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* İzin Türü Adı */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-tag me-1"></i> İzin Türü Adı <span className="text-danger">*</span>
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

                                    {/* Maks. Gün */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar me-1"></i> Maks. Gün
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.max_duration_days}
                                            onChange={(e) => setData('max_duration_days', e.target.value)}
                                            min="1"
                                            placeholder="Sınırsız için boş bırakın"
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
                                            placeholder="İzin türü açıklaması..."
                                        />
                                    </div>

                                    {/* Checkbox'lar */}
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_paid"
                                                checked={data.is_paid}
                                                onChange={(e) => setData('is_paid', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_paid">
                                                <i className="ti ti-coin me-1"></i> Ücretli İzin
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="requires_document"
                                                checked={data.requires_document}
                                                onChange={(e) => setData('requires_document', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="requires_document">
                                                <i className="ti ti-file me-1"></i> Belge Gerektirir
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link
                                        href={route('admin.leave.types.index')}
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

                {/* Sağ Panel - Bilgi */}
                <div className="col-lg-4">
                    <div className="card border-primary mb-4">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Tür Detayları
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Tür ID</label>
                                <div className="fw-bold">#{leaveType.id}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Oluşturulma Tarihi</label>
                                <div className="fw-medium">{formatDate(leaveType.created_at)}</div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Son Güncelleme</label>
                                <div className="fw-medium">{formatDate(leaveType.updated_at)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-info">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> İzin Türleri
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <span className="badge bg-success mb-2">Ücretli</span>
                                <p className="mb-0 small">Personelin maaşından kesinti yapılmadan kullanabileceği izinler</p>
                            </div>
                            <div className="mb-0">
                                <span className="badge bg-secondary mb-2">Ücretsiz</span>
                                <p className="mb-0 small">Maaştan kesinti yapılarak kullanılan izinler</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
