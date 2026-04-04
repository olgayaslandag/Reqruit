import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Edit({ holiday, calendars }) {
    const [formData, setFormData] = useState({
        work_calendar_id: holiday.work_calendar_id || calendars?.[0]?.id || '',
        name: holiday.name || '',
        date: holiday.date || '',
        type: holiday.type || 'official',
        description: holiday.description || '',
        is_recurring: holiday.is_recurring ?? true,
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

        router.put(route('admin.holidays.update', holiday.id), formData, {
            onSuccess: () => {
                showSuccess('Resmi tatil başarıyla güncellendi.');
            },
            onError: (errorData) => {
                setErrors(errorData);
                showError('Tatil güncellenirken hata oluştu. Lütfen bilgileri kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    const holidayTypes = [
        { value: 'official', label: 'Resmi Tatil', icon: 'ti-flag', color: 'danger' },
        { value: 'religious_holiday', label: 'Dini Bayram', icon: 'ti-moon', color: 'success' },
        { value: 'national_holiday', label: 'Ulusal Bayram', icon: 'ti-star', color: 'primary' },
        { value: 'company', label: 'Şirket Tatili', icon: 'ti-building', color: 'warning' },
    ];

    // Tatil tarihi geçmiş mi kontrol et
    const today = new Date().toISOString().split('T')[0];
    const isPastHoliday = holiday.date && new Date(holiday.date) < new Date(today);

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Resmi Tatil Düzenle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Resmi Tatiller', url: route('admin.holidays.index') },
                    { label: holiday.name, url: route('admin.holidays.edit', holiday.id) },
                ],
                backUrl: route('admin.holidays.index'),
            }}
        >
            <Head title={`Tatil Düzenle: ${holiday.name}`} />

            {isPastHoliday && (
                <div className="alert alert-warning mb-4" role="alert">
                    <i className="ti ti-alert-triangle me-2"></i>
                    <strong>Dikkat!</strong> Bu tatil geçmiş bir tarihte. Geçmiş tarihli tatillerle ilgili yapılan değişiklikler,
                    geçmiş devam kayıtları üzerinde manuel değişikliklere ihtiyaç duyabilir.
                </div>
            )}

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-calendar-edit me-2"></i> Tatil Bilgileri
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Takvim Seçimi */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar me-1"></i> Çalışma Takvimi <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.work_calendar_id ? 'is-invalid' : ''}`}
                                            value={formData.work_calendar_id}
                                            onChange={(e) => handleChange('work_calendar_id', e.target.value)}
                                        >
                                            <option value="">Takvim Seçin</option>
                                            {calendars?.map(calendar => (
                                                <option key={calendar.id} value={calendar.id}>
                                                    {calendar.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.work_calendar_id && <div className="invalid-feedback">{errors.work_calendar_id}</div>}
                                    </div>

                                    {/* Tatil Adı */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-tag me-1"></i> Tatil Adı <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="Örneğin: Zafer Bayramı"
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Tarih */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-event me-1"></i> Tarih <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                            value={formData.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                        />
                                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                    </div>

                                    {/* Tatil Türü */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-category me-1"></i> Tatil Türü <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                            value={formData.type}
                                            onChange={(e) => handleChange('type', e.target.value)}
                                        >
                                            {holidayTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                    </div>

                                    {/* Açıklama */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-file-text me-1"></i> Açıklama
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            placeholder="Tatil hakkında açıklama..."
                                        />
                                    </div>

                                    {/* Yıllık Tekrar */}
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_recurring"
                                                checked={formData.is_recurring}
                                                onChange={(e) => handleChange('is_recurring', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_recurring">
                                                <i className="ti ti-repeat me-1"></i> Bu tatil her yıl tekrar eder
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link href={route('admin.holidays.index')} className="btn btn-light">
                                        <i className="ti ti-arrow-left me-1"></i> İptal
                                    </Link>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Güncelleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Tatil Güncelle
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
                    {/* Tatil Detayları */}
                    <div className="card border-primary mb-4">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Tatil Detayları
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Oluşturulma Tarihi</label>
                                <div className="fw-medium">
                                    {new Date(holiday.created_at).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Son Güncelleme</label>
                                <div className="fw-medium">
                                    {new Date(holiday.updated_at).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Tatil ID</label>
                                <div className="fw-medium text-muted">#{holiday.id}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bilgi Kutusu */}
                    <div className="alert alert-info" role="alert">
                        <h6 className="alert-heading fw-bold">
                            <i className="ti ti-lightbulb me-1"></i> Not
                        </h6>
                        <p className="mb-0 small">
                            Tatil günlerinin doğru tanımlanması, personel devam kayıtlarını, fazla mesai hesaplamalarını
                            ve resmi izin günlerinin otomatik olarak tanınmasını sağlar.
                        </p>
                    </div>

                    {/* Hızlı Linkler */}
                    <div className="card">
                        <div className="card-header bg-light">
                            <h6 className="mb-0 fw-bold">Hızlı Erişim</h6>
                        </div>
                        <div className="card-body">
                            <Link href={route('admin.work-calendars.index')} className="btn btn-outline-info w-100 mb-2">
                                <i className="ti ti-calendar me-1"></i> Takvimler
                            </Link>
                            <Link href={route('admin.holidays.index')} className="btn btn-outline-secondary w-100">
                                <i className="ti ti-list me-1"></i> Tatil Listesi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
