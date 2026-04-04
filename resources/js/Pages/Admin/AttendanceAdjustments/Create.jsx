import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Create({ employees }) {
    const [formData, setFormData] = useState({
        employee_id: '',
        adjustment_date: new Date().toISOString().split('T')[0],
        from_time: '',
        to_time: '',
        type: 'clock_in',
        reason: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post(route('admin.adjustments.store'), formData, {
            onSuccess: () => {
                showSuccess('Düzeltme talebi başarıyla oluşturuldu.');
            },
            onError: (errorData) => {
                setErrors(errorData);
                showError('Talep oluşturulurken hata oluştu. Lütfen formu kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    const adjustmentTypes = [
        { value: 'clock_in', label: 'Giriş Saati', icon: 'ti-login' },
        { value: 'clock_out', label: 'Çıkış Saati', icon: 'ti-logout' },
        { value: 'both', label: 'Giriş + Çıkış', icon: 'ti-exchange' },
        { value: 'duration', label: 'Süre Düzeltmesi', icon: 'ti-clock' },
    ];

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Yeni Düzeltme Talebi',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Düzeltme Talepleri', url: route('admin.adjustments.index') },
                    { label: 'Yeni Talep', url: route('admin.adjustments.create') },
                ],
                backUrl: route('admin.adjustments.index'),
            }}
        >
            <Head title="Yeni Düzeltme Talebi" />

            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-calendar-time me-2"></i> Düzeltme Talebi Oluştur
                    </h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {/* Personel Seçimi */}
                            <div className="col-md-6">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-user me-1"></i> Personel <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={`form-select ${errors.employee_id ? 'is-invalid' : ''}`}
                                    value={formData.employee_id}
                                    onChange={(e) => handleChange('employee_id', e.target.value)}
                                >
                                    <option value="">Personel Seçin</option>
                                    {employees?.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.employee_id && (
                                    <div className="invalid-feedback">{errors.employee_id}</div>
                                )}
                            </div>

                            {/* Tarih */}
                            <div className="col-md-6">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-calendar me-1"></i> Düzeltme Tarihi <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.adjustment_date ? 'is-invalid' : ''}`}
                                    value={formData.adjustment_date}
                                    onChange={(e) => handleChange('adjustment_date', e.target.value)}
                                />
                                {errors.adjustment_date && (
                                    <div className="invalid-feedback">{errors.adjustment_date}</div>
                                )}
                            </div>

                            {/* Düzeltme Türü */}
                            <div className="col-12">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-settings me-1"></i> Düzeltme Türü <span className="text-danger">*</span>
                                </label>
                                <div className="row g-2">
                                    {adjustmentTypes.map(type => (
                                        <div key={type.value} className="col-md-3">
                                            <div
                                                className={`card h-100 cursor-pointer ${formData.type === type.value ? 'border-primary' : 'border'}`}
                                                onClick={() => handleChange('type', type.value)}
                                            >
                                                <div className="card-body text-center">
                                                    <div className={`mb-2 fs-3 ${formData.type === type.value ? 'text-primary' : 'text-muted'}`}>
                                                        <i className={`ti ${type.icon}`}></i>
                                                    </div>
                                                    <div className="fw-medium">{type.label}</div>
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value={type.value}
                                                        checked={formData.type === type.value}
                                                        onChange={() => handleChange('type', type.value)}
                                                        className="d-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.type && (
                                    <div className="text-danger small mt-1">{errors.type}</div>
                                )}
                            </div>

                            {/* Saatler */}
                            <div className="col-md-6">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-clock me-1"></i> Başlangıç Saati
                                </label>
                                <input
                                    type="time"
                                    className={`form-control ${errors.from_time ? 'is-invalid' : ''}`}
                                    value={formData.from_time}
                                    onChange={(e) => handleChange('from_time', e.target.value)}
                                    placeholder="HH:mm"
                                />
                                <small className="text-muted">
                                    {formData.type === 'clock_in' && 'Yeni giriş saati'}
                                    {formData.type === 'clock_out' && 'Yeni çıkış saati'}
                                    {formData.type === 'both' && 'Yeni giriş saati'}
                                    {formData.type === 'duration' && 'Düzeltilecek süre başlangıcı'}
                                </small>
                                {errors.from_time && (
                                    <div className="invalid-feedback">{errors.from_time}</div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-clock me-1"></i> Bitiş Saati
                                </label>
                                <input
                                    type="time"
                                    className={`form-control ${errors.to_time ? 'is-invalid' : ''}`}
                                    value={formData.to_time}
                                    onChange={(e) => handleChange('to_time', e.target.value)}
                                    placeholder="HH:mm"
                                />
                                <small className="text-muted">
                                    {formData.type === 'clock_in' && 'Boş bırakabilirsiniz'}
                                    {formData.type === 'clock_out' && 'Boş bırakabilirsiniz'}
                                    {formData.type === 'both' && 'Yeni çıkış saati'}
                                    {formData.type === 'duration' && 'Düzeltilecek süre bitişi'}
                                </small>
                                {errors.to_time && (
                                    <div className="invalid-feedback">{errors.to_time}</div>
                                )}
                            </div>

                            {/* Açıklama */}
                            <div className="col-12">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-file-text me-1"></i> Talep Nedeni <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                                    rows={4}
                                    value={formData.reason}
                                    onChange={(e) => handleChange('reason', e.target.value)}
                                    placeholder="Düzeltme talebinin nedenini açıklayın..."
                                />
                                {errors.reason && (
                                    <div className="invalid-feedback">{errors.reason}</div>
                                )}
                            </div>

                            {/* Bilgi Kutusu */}
                            <div className="col-12">
                                <div className="alert alert-info d-flex align-items-start" role="alert">
                                    <i className="ti ti-info-circle fs-5 me-2 mt-1"></i>
                                    <div>
                                        <strong>Bilgi</strong>
                                        <p className="mb-0 small">
                                            Bu talep yönetici tarafından onaylandığında sistemdeki mevcut devam kaydı değiştirilecektir.
                                            Talebiniz onaylandığında fazla mesai hesaplamaları ve devam oranları bu yeni saatlere göre tekrar hesaplanacaktır.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                            <Link
                                href={route('admin.adjustments.index')}
                                className="btn btn-light"
                            >
                                <i className="ti ti-arrow-left me-1"></i> İptal
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        İşleniyor...
                                    </>
                                ) : (
                                    <>
                                        <i className="ti ti-check me-1"></i> Talep Oluştur
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
