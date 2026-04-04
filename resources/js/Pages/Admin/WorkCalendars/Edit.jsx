import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Edit({ calendar, holidayDays, weekendCount, workingDays }) {
    const [formData, setFormData] = useState({
        name: calendar.name || '',
        description: calendar.description || '',
        start_date: calendar.start_date || new Date().toISOString().split('T')[0],
        end_date: calendar.end_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        is_active: calendar.is_active ?? true,
        default_calendar: calendar.default_calendar || false
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

        router.put(route('admin.work-calendars.update', calendar.id), formData, {
            onSuccess: () => {
                showSuccess('Çalışma takvimi başarıyla güncellendi.');
            },
            onError: (errorData) => {
                setErrors(errorData);
                showError('Takvim güncellenirken hata oluştu. Lütfen bilgileri kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    // Takvim bilgilerini güncelle
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
    const isActive = calendar.is_active === true || calendar.is_active === 1;

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Çalışma Takvimi Düzenle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Çalışma Takvimleri', url: route('admin.work-calendars.index') },
                    { label: calendar.name, url: route('admin.work-calendars.edit', calendar.id) },
                ],
                backUrl: route('admin.work-calendars.index'),
            }}
        >
            <Head title={`Takvim Düzenle: ${calendar.name}`} />

            {isActive && (
                <div className="alert alert-warning mb-4" role="alert">
                    <i className="ti ti-alert-triangle me-2"></i>
                    <strong>Dikkat!</strong> Aktif bir takvim üzerinde değişiklik yapmanız personel devam kayıtlarını etkileyebilir.
                </div>
            )}

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-calendar-edit me-2"></i> Takvim Bilgileri
                            </h5>
                            <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {isActive ? 'Aktif' : 'Pasif'}
                            </span>
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

                                    {/* Durum */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-toggle-right me-1"></i> Durum
                                        </label>
                                        <select
                                            className="form-select"
                                            value={formData.is_active ? '1' : '0'}
                                            onChange={(e) => handleChange('is_active', e.target.value === '1')}
                                        >
                                            <option value="1">Aktif</option>
                                            <option value="0">Pasif</option>
                                        </select>
                                    </div>

                                    {/* Varsayılan Takvim */}
                                    <div className="col-md-6">
                                        <div className="form-check mt-4">
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
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Güncelleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Takvimi Güncelle
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
                            <div className="row g-3 mb-3">
                                <div className="col-4 text-center">
                                    <div className="fs-3 fw-bold text-primary">{calendar.total_days || calendarInfo.totalDays}</div>
                                    <small className="text-muted">Toplam Gün</small>
                                </div>
                                <div className="col-4 text-center">
                                    <div className="fs-3 fw-bold text-success">{workingDays || calendarInfo.workDays}</div>
                                    <small className="text-muted">İş Günü</small>
                                </div>
                                <div className="col-4 text-center">
                                    <div className="fs-3 fw-bold text-danger">{holidayDays || calendarInfo.holidays}</div>
                                    <small className="text-muted">Tatil Günü</small>
                                </div>
                            </div>
                            <hr />
                            <div className="text-center">
                                <small className="text-muted">
                                    {new Date(calendar.start_date).toLocaleDateString('tr-TR')} - {new Date(calendar.end_date).toLocaleDateString('tr-TR')}
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Kullanım Bilgisi */}
                    <div className="card border-info mb-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-users me-1"></i> Kullanım Bilgisi
                            </h6>
                        </div>
                        <div className="card-body">
                            <p className="mb-1">
                                <strong>Kullanıcı Sayısı:</strong>
                                <span className="float-end">{calendar.used_by_count || 0}</span>
                            </p>
                            <p className="mb-0">
                                <strong>Durum:</strong>
                                <span className={`float-end badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
                                    {isActive ? 'Aktif' : 'Pasif'}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Bilgi Kutusu */}
                    <div className="alert alert-info" role="alert">
                        <h6 className="alert-heading fw-bold">
                            <i className="ti ti-info-circle me-1"></i> Düzenleme Notları
                        </h6>
                        <ul className="mb-0 small">
                            <li>Aktif takvim değiştirilemez, arşivleyip yeniden oluşturmalısınız.</li>
                            <li>Yeni resmi tatiller eklemek için Tatiller yönetimine gitmelisiniz.</li>
                            <li>Takvim tarihi güncellemeden önce bağlı verileri kontrol etmelisiniz.</li>
                        </ul>
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
                            <Link href={route('admin.work-calendars.show', calendar.id)} className="btn btn-outline-primary w-100 mb-2">
                                <i className="ti ti-eye me-1"></i> Takvimi Görüntüle
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
