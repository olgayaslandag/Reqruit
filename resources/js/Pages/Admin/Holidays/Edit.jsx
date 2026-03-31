import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Edit({ holiday, calendars }) {
    const { props } = usePage();
    const flash = props.flash;

    const [formData, setFormData] = useState({
        name: holiday.name || '',
        local_name: holiday.local_name || '',
        description: holiday.description || '',
        date: holiday.date || '',
        recurring: holiday.recurring || false,
        category: holiday.category || 'public_holiday',
        calendar_ids: holiday.assigned_calendars?.map(cal => cal.id) || []
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Hata mesajını temizle
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleMultiSelectChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions);
        const selectedIds = selectedOptions.map(option => option.value);
        setFormData(prev => ({ ...prev, calendar_ids: selectedIds }));
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

    // Tatil tarihini kontrol et
    const today = new Date().toISOString().split('T')[0];
    const isPastHoliday = holiday.date && new Date(holiday.date) < new Date(today);

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Resmi Tatil Düzenle
                    </h5>
                    <Link
                        href={route('admin.holidays.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title={`Tatil Düzenle: ${holiday.name}`} />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Tatil Bilgileri</h5>
                            <p className="mt-1 fs-sm text-muted">Resmi tatil bilgilerini buradan düzenleyebilirsiniz</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-3">
                                {/* Temel Bilgiler */}
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    <div className="col-span-2">
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Tatil Adı *
                                        </label>
                                        <input type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.name ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`}
                                            placeholder="Örnek: Zafer Bayramı"
                                        />
                                        {errors.name && <p className="mt-1 fs-sm text-danger">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Yerel Adı
                                        </label>
                                        <input type="text"
                                            value={formData.local_name}
                                            onChange={(e) => handleChange('local_name', e.target.value)}
                                            className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                            placeholder="Yerel olarak bildiğiniz ad"
                                        />
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Tarih *
                                        </label>
                                        <input type="date"
                                            value={formData.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                            className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.date ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`}
                                        />
                                        {errors.date && <p className="mt-1 fs-sm text-danger">{errors.date}</p>}
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Kategori
                                        </label>
                                        <select value={formData.category}
                                            onChange={(e) => handleChange('category', e.target.value)}
                                            className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                        >
                                            <option value="public_holiday">Resmi Tatil</option>
                                            <option value="religious_holiday">Dini Bayram</option>
                                            <option value="national_holiday">Ulusal Bayram</option>
                                            <option value="international_holiday">Uluslararası Günü</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                id="recurring"
                                                checked={formData.recurring}
                                                onChange={(e) => handleChange('recurring', e.target.checked)}
                                                className="h-4 w-4 text-primary focus: border-secondary rounded"
                                            />
                                            <label htmlFor="recurring" className="ml-2 d-block fs-sm text-dark">
                                                Bu tatil yılda bir tekrar edsin (her yıl aynı tarihde uygulanacak)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Açıklama
                                    </label>
                                    <textarea value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={3}
                                        className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                        placeholder="Tatil hakkında açıklama (isteğe bağlı)"
                                    />
                                </div>

                                {/* İlgili Takvimler */}
                                {calendars && calendars.length > 0 && (
                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            İlgili Takvimler
                                        </label>
                                        <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 h-40" multiple
                                            value={formData.calendar_ids}
                                            onChange={handleMultiSelectChange}
                                            
                                        >
                                            {calendars.map(calendar => (
                                                <option key={calendar.id} value={calendar.id}>
                                                    {calendar.name} ({new Date(calendar.start_date).getFullYear()})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 fs-sm text-muted">
                                            Bu tatil uygulanacak takvimleri seçin
                                        </p>
                                    </div>
                                )}

                                {/* Tatil Detayları */}
                                <div className="table-light border border-secondary rounded p-4">
                                    <h5 className="fw-medium text-dark mb-3">Tatil Detayı</h5>
                                    <div className="d-grid d-grid-cols-1 gap-3">
                                        <div>
                                            <h5 className="fs-xs fw-medium text-dark mb-1">Oluşturan</h5>
                                            <p className="fs-sm text-dark">
                                                {holiday.created_by?.first_name} {holiday.created_by?.last_name}
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="fs-xs fw-medium text-dark mb-1">Oluşturma Tarihi</h5>
                                            <p className="fs-sm text-dark">
                                                {new Date(holiday.created_at).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="fs-xs fw-medium text-dark mb-1">Değişim Sayısı</h5>
                                            <p className="fs-sm text-dark">
                                                {holiday.change_count || 0} kez değiştirildi
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="fs-xs fw-medium text-dark mb-1">Etkilenen Takvim</h5>
                                            <p className="fs-sm text-dark">
                                                {holiday.assigned_calendars?.length || 0} takvim
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Butonu */}
                            <div className="mt-8 d-flex justify-content-end">
                                <Link
                                    href={route('admin.holidays.index')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'Güncelleniyor...' : 'Tatil Güncelle'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Uyarı Mesajları */}
                    {isPastHoliday && (
                        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
                            <div className="d-flex">
                                <div className="d-flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h5 className="fw-medium">Geçmiş Tarihli Tatil</h5>
                                    <div className="mt-2 fs-sm text-warning">
                                        <p>
                                            Bu tatil geçmiş bir tarihte. Geçmiş tarihli tatillerle ilgili yapılan değişiklikler, 
                                            geçmiş devam kayıtları üzerinde manuel değişikliklere ihtiyaç duyabilir.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-4">
                        <div className="d-flex">
                            <div className="d-flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h5 className="fw-medium">Not</h5>
                                <div className="mt-2 fs-sm text-info">
                                    <p>
                                        Tatil günlerinin doğru tanımlanması, personel devam kayıtlarını, fazla mesai hesaplamalarını 
                                        ve resmi izin günlerinin otomatik olarak tanınmasını sağlar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}