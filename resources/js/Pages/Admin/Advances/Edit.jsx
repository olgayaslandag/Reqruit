import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate } from '@/Utils/formatters';

export default function Edit({ advance }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        employee_id: advance.employee_id,
        amount: advance.amount || '',
        reason: advance.reason || '',
        requested_date: advance.requested_date || new Date().toISOString().split('T')[0],
        status: advance.status || 'pending',
        notes: advance.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.advances.update', advance.id), {
            onSuccess: () => {
                showSuccess('Avans talebi güncellendi.');
            },
            onError: () => {
                showError('Güncelleme sırasında hata oluştu.');
            }
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'approved': return 'bg-success';
            case 'rejected': return 'bg-danger';
            case 'paid': return 'bg-primary';
            case 'cancelled': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Bekliyor',
            approved: 'Onaylandı',
            rejected: 'Reddedildi',
            paid: 'Ödendi',
            cancelled: 'İptal Edildi',
        };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Avans Talebini Güncelle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Avans Talepleri', url: route('admin.advances.index') },
                    { label: `#${advance.id}`, url: route('admin.advances.show', advance.id) },
                    { label: 'Güncelle', url: route('admin.advances.edit', advance.id) },
                ],
                backUrl: route('admin.advances.show', advance.id),
            }}
        >
            <Head title={`Avans Güncelle - #${advance.id}`} />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-hand-finger me-2"></i> Talep Bilgileri
                            </h5>
                            <span className={`badge ${getStatusBadgeClass(advance.status)}`}>
                                {getStatusLabel(advance.status)}
                            </span>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Çalışan Seçimi */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-user me-1"></i> Çalışan <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.employee_id ? 'is-invalid' : ''}`}
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Çalışan seçin</option>
                                            {window.employees?.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.employee_id && <div className="invalid-feedback">{errors.employee_id}</div>}
                                    </div>

                                    {/* Tutar */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-coin me-1"></i> Tutar <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            required
                                            min="0"
                                            placeholder="0.00"
                                        />
                                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                    </div>

                                    {/* Talep Tarihi */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar me-1"></i> Talep Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.requested_date ? 'is-invalid' : ''}`}
                                            value={data.requested_date}
                                            onChange={(e) => setData('requested_date', e.target.value)}
                                            required
                                        />
                                        {errors.requested_date && <div className="invalid-feedback">{errors.requested_date}</div>}
                                    </div>

                                    {/* Durum */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-toggle-right me-1"></i> Durum
                                        </label>
                                        <select
                                            className="form-select"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="pending">Bekliyor</option>
                                            <option value="approved">Onaylandı</option>
                                            <option value="rejected">Reddedildi</option>
                                            <option value="paid">Ödendi</option>
                                            <option value="cancelled">İptal Edildi</option>
                                        </select>
                                    </div>

                                    {/* Nedeni */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-file-text me-1"></i> Nedeni
                                        </label>
                                        <textarea
                                            className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                                            rows={3}
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            placeholder="Avans talebinin nedeni..."
                                        />
                                        {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                                    </div>

                                    {/* Notlar */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-notes me-1"></i> Notlar
                                        </label>
                                        <textarea
                                            className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                                            rows={3}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Ek notlar..."
                                        />
                                        {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link
                                        href={route('admin.advances.show', advance.id)}
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

                {/* Sağ Panel */}
                <div className="col-lg-4">
                    <div className="card border-primary mb-4">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Talep Detayları
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Talep ID</label>
                                <div className="fw-bold">#{advance.id}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Oluşturulma Tarihi</label>
                                <div className="fw-medium">{formatDate(advance.created_at)}</div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Son Güncelleme</label>
                                <div className="fw-medium">{formatDate(advance.updated_at)}</div>
                            </div>
                        </div>
                    </div>

                    {advance.employee && (
                        <div className="card border-info">
                            <div className="card-header bg-info text-white">
                                <h6 className="mb-0 fw-bold">
                                    <i className="ti ti-user me-1"></i> Çalışan Bilgisi
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-2">
                                    <label className="text-muted small">Ad Soyad</label>
                                    <div className="fw-medium">{advance.employee.first_name} {advance.employee.last_name}</div>
                                </div>
                                <div className="mb-0">
                                    <label className="text-muted small">Email</label>
                                    <div className="fw-medium">{advance.employee.email || '-'}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
