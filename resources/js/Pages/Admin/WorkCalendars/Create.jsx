import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Create() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        is_active: true,
        default_calendar: false
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

        router.post(route('admin.work-calendars.store'), formData, {
            onSuccess: () => {
                showSuccess('Çalışma takvimi başarıyla oluşturuldu.');
            },
            onError: (errorData) => {
                setErrors(errorData);
                showError('Takvim oluşturulurken hata oluştu. Lütfen bilgileri kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    // Takvim bilgilerini otomatik hesapla
    const calculateCalendarInfo = () => {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        let workDays = 0;
        let holidays = 0;

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workDays++;
            } else {
                holidays++;
            }
        }

        return { totalDays, workDays, holidays };
    };

    const calendarInfo = calculateCalendarInfo();

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Yeni Çalışma Takvimi',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Çalışma Takvimleri', url: route('admin.work-calendars.index') },
                    { label: 'Yeni Takvim', url: route('admin.work-calendars.create') },
                ],
                backUrl: route('admin.work-calendars.index'),
            }}
        >
            <Head title="Yeni Çalışma Takvimi" />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-calendar-plus me-2"></i> Takvim Bilgileri
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Takvim Adı */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar me-1"></i> Takvim Adı <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="Örneğin: 2025 Çalışma Takvimi"
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Açıklama */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-file-text me-1"></i> Açıklama
                                        </label>
                                        <textarea
                                            className="form-control"
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            rows={3}
                                            placeholder="Takvim hakkında açıklama..."
                                        />
                                    </div>

                                    {/* Başlangıç Tarihi */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-event me-1"></i> Başlangıç Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                                            value={formData.start_date}
                                            onChange={(e) => handleChange('start_date', e.target.value)}
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
                                            value={formData.end_date}
                                            onChange={(e) => handleChange('end_date', e.target.value)}
                                        />
                                        {errors.end_date && <div className="invalid-feedback">{errors.end_date}</div>}
                                    </div>

                                    {/* Varsayılan Takvim */}
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="default_calendar"
                                                checked={formData.default_calendar}
                                                onChange={(e) => handleChange('default_calendar', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="default_calendar">
                                                <i className="ti ti-star me-1"></i> Varsayılan takvim olarak ata
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link href={route('admin.work-calendars.index')} className="btn btn-light">
                                        <i className="ti ti-arrow-left me-1"></i> İptal
                                    </Link>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Oluşturuluyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Takvim Oluştur
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sağ Panel - Özet */}
                <div className="col-lg-4">
                    {/* Takvim İstatistikleri */}
                    <div className="card border-primary mb-4">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-chart-bar me-1"></i> Takvim Özeti
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-4 text-center">
                                    <div className="fs-3 fw-bold text-primary">{calendarInfo.totalDays}</div>
                                    <small className="text-muted">Toplam Gün</small>
                                </div>
                                <div className="col-4 text-center">
                                    <div className="fs-3 fw-bold text-success">{calendarInfo.workDays}</div>
                                    <small className="text-muted">İş Günü</small>
                                </div>
                                <div className="col-4 text-center">
                                    <div className="fs-3 fw-bold text-danger">{calendarInfo.holidays}</div>
                                    <small className="text-muted">Tatil Günü</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bilgi Kutusu */}
                    <div className="alert alert-info" role="alert">
                        <h6 className="alert-heading fw-bold">
                            <i className="ti ti-info-circle me-1"></i> Bilgi
                        </h6>
                        <p className="mb-0 small">
                            Takvim oluşturulduktan sonra <strong>Tatiller</strong> ve <strong>Hafta Sonu</strong> günlerini
                            manuel olarak ekleyebilmeniz gerekmektedir. Varsayılan olarak sadece hafta sonu günleri
                            (Cumartesi-Pazar) otomatik olarak işaretlenecektir.
                        </p>
                    </div>

                    {/* Hızlı Linkler */}
                    <div className="card">
                        <div className="card-header bg-light">
                            <h6 className="mb-0 fw-bold">Hızlı Erişim</h6>
                        </div>
                        <div className="card-body">
                            <Link href={route('admin.holidays.index')} className="btn btn-outline-info w-100 mb-2">
                                <i className="ti ti-palm me-1"></i> Tatilleri Yönet
                            </Link>
                            <Link href={route('admin.work-calendars.index')} className="btn btn-outline-secondary w-100">
                                <i className="ti ti-list me-1"></i> Takvim Listesi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
