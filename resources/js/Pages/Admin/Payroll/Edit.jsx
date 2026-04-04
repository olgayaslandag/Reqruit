import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate } from '@/Utils/formatters';
import { getStatusBadgeClass } from '@/Utils/commonUtils';

export default function Edit({ period }) {
    const { flash } = usePage().props;
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: period.name || '',
        start_date: period.start_date || '',
        end_date: period.end_date || '',
        payment_frequency: period.payment_frequency || 'monthly',
        payment_date: period.payment_date || '',
        notes: period.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.payrolls.update', period.id), {
            onSuccess: () => {
                showSuccess('Bordro dönemi güncellendi.');
            },
            onError: () => {
                showError('Güncelleme sırasında hata oluştu.');
            }
        });
    };



    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Taslak',
            pending: 'Beklemede',
            approved: 'Onaylandı',
            paid: 'Ödendi',
            locked: 'Kilitli',
        };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Bordro Dönemi Güncelle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Bordro Dönemleri', url: route('admin.payrolls.index') },
                    { label: period.name, url: route('admin.payrolls.edit', period.id) },
                ],
                backUrl: route('admin.payrolls.index'),
            }}
        >
            <Head title="Bordro Güncelle" />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-calendar-edit me-2"></i> Dönem Bilgileri
                            </h5>
                            <span className={`badge ${getStatusBadgeClass(period.status, 'payroll')}`}>
                                {getStatusLabel(period.status)}
                            </span>
                        </div>
                        <div className="card-body">
                            {flash?.success && (
                                <div className="alert alert-success mb-4" role="alert">
                                    <i className="ti ti-check me-2"></i>
                                    {flash.success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Dönem Adı */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-tag me-1"></i> Dönem Adı <span className="text-danger">*</span>
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

                                    {/* Başlangıç Tarihi */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-event me-1"></i> Başlangıç Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        {errors.start_date && <div className="invalid-feedback">{errors.start_date}</div>}
                                    </div>

                                    {/* Bitiş Tarihi */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-event me-1"></i> Bitiş Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            required
                                        />
                                        {errors.end_date && <div className="invalid-feedback">{errors.end_date}</div>}
                                    </div>

                                    {/* Ödeme Sıklığı */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-repeat me-1"></i> Ödeme Sıklığı
                                        </label>
                                        <select
                                            className="form-select"
                                            value={data.payment_frequency}
                                            onChange={(e) => setData('payment_frequency', e.target.value)}
                                        >
                                            <option value="monthly">Aylık</option>
                                            <option value="biweekly">İki Haftalık</option>
                                            <option value="weekly">Haftalık</option>
                                        </select>
                                    </div>

                                    {/* Ödeme Tarihi */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-check me-1"></i> Ödeme Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                        />
                                    </div>

                                    {/* Notlar */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-file-text me-1"></i> Notlar
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                        />
                                        {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link
                                        href={route('admin.payrolls.index')}
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
                                <i className="ti ti-info-circle me-1"></i> Dönem Detayları
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Oluşturulma Tarihi</label>
                                <div className="fw-medium">
                                    {formatDate(period.created_at)}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Son Güncelleme</label>
                                <div className="fw-medium">
                                    {formatDate(period.updated_at)}
                                </div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Dönem ID</label>
                                <div className="fw-medium text-muted">#{period.id}</div>
                            </div>
                        </div>
                    </div>

                    {period.status !== 'draft' && (
                        <div className="alert alert-warning" role="alert">
                            <h6 className="alert-heading fw-bold">
                                <i className="ti ti-alert-triangle me-1"></i> Dikkat
                            </h6>
                            <p className="mb-0 small">
                                Bu dönem <strong>{getStatusLabel(period.status)}</strong> durumunda.
                                Değişiklikler mevcut hesaplamaları etkileyebilir.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
