import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        is_paid: true,
        requires_document: false,
        max_duration_days: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.leave.types.store'), {
            onSuccess: () => {
                showSuccess('İzin türü oluşturuldu.');
            },
            onError: () => {
                showError('Oluşturma başarısız.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Yeni İzin Türü',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İzin Yönetimi', url: '#' },
                    { label: 'İzin Türleri', url: route('admin.leave.types.index') },
                    { label: 'Yeni Tür', url: route('admin.leave.types.create') },
                ],
                backUrl: route('admin.leave.types.index'),
            }}
        >
            <Head title="Yeni İzin Türü" />

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
                                            placeholder="Örn: Yıllık İzin"
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
                                            placeholder="Örn: YILLIK"
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
                                                Kaydediliyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Kaydet
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sağ Panel - Bilgi */}
                <div className="col-lg-4">
                    <div className="card border-info mb-4">
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
                            <div className="mb-3">
                                <span className="badge bg-secondary mb-2">Ücretsiz</span>
                                <p className="mb-0 small">Maaştan kesinti yapılarak kullanılan izinler</p>
                            </div>
                            <hr />
                            <div className="mb-0">
                                <span className="badge bg-warning text-dark mb-2">Belge Gerekli</span>
                                <p className="mb-0 small">Sağlık raporu, doğum belgesi vb. gerektiren izinler</p>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-warning" role="alert">
                        <h6 className="alert-heading fw-bold">
                            <i className="ti ti-alert-triangle me-1"></i> Dikkat
                        </h6>
                        <p className="mb-0 small">
                            Kod alanı benzersiz olmalıdır. Aynı kodlu başka bir izin türü olamaz.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
