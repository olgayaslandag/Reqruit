import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Create() {
    const { props } = usePage();
    const flash = props.flash;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: 'draft',
        default_calendar: false
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        router.post(route('admin.work-calendars.store'), formData, {
            onSuccess: () => {
                showSuccess('İş takvimi başarıyla oluşturuldu.');
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
        
        // Toplam gün sayısı
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // Hafta içi günleri hesaplamasını yap
        let workDays = 0;
        let holidays = 0;
        
        for(let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
            if(dayOfWeek !== 0 && dayOfWeek !== 6) { // Hafta içi
                workDays++;
            } else {
                holidays++; // Hafta sonu
            }
        }
        
        return {
            totalDays,
            workDays,
            holidays
        };
    };

    const calendarInfo = calculateCalendarInfo();

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Yeni İş Takvimi Oluştur
                    </h5>
                    <Link
                        href={route('admin.work-calendars.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title="Yeni Takvim" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Tkvim Bilgileri</h5>
                            <p className="mt-1 fs-sm text-muted">Yeni bir iş takvimi buradan oluşturulabilir</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-3">
                                {/* Temel Bilgiler */}
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    <div className="col-span-2">
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Takvim Adı *
                                        </label>
                                        <input className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.name ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`} type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="Örneğin: 2025 İş Takvimi"
                                        />
                                        {errors.name && <p className="mt-1 fs-sm text-danger">{errors.name}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Açıklama
                                        </label>
                                        <textarea className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            rows={3}
                                            placeholder="Takvim hakkında açıklama..."
                                        />
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Başlangıç Tarihi *
                                        </label>
                                        <input className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.start_date ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`} type="date"
                                            value={formData.start_date}
                                            onChange={(e) => handleChange('start_date', e.target.value)}
                                        />
                                        {errors.start_date && <p className="mt-1 fs-sm text-danger">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Bitiş Tarihi *
                                        </label>
                                        <input className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.end_date ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`} type="date"
                                            value={formData.end_date}
                                            onChange={(e) => handleChange('end_date', e.target.value)}
                                        />
                                        {errors.end_date && <p className="mt-1 fs-sm text-danger">{errors.end_date}</p>}
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Status *
                                        </label>
                                        <select className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.status ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`} value={formData.status}
                                            onChange={(e) => handleChange('status', e.target.value)}
                                        >
                                            <option value="draft">Taslak</option>
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Pasif</option>
                                            <option value="archived">Arşiv</option>
                                        </select>
                                        {errors.status && <p className="mt-1 fs-sm text-danger">{errors.status}</p>}
                                    </div>

                                    <div className="d-flex align-items-center pt-6">
                                        <input
                                            type="checkbox"
                                            id="default_calendar"
                                            checked={formData.default_calendar}
                                            onChange={(e) => handleChange('default_calendar', e.target.checked)}
                                            className="h-4 w-4 text-primary focus: border-secondary rounded"
                                        />
                                        <label htmlFor="default_calendar" className="ml-2 d-block fs-sm text-dark">
                                            Varsayılan takvim olarak ata
                                        </label>
                                    </div>
                                </div>

                                {/* Takvim İstatistikleri */}
                                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                    <h5 className="fw-medium text-info mb-3">Takvim Bilgileri</h5>
                                    <div className="d-grid d-grid-cols-1 gap-3">
                                        <div className="text-center">
                                            <div className="fs-sm text-info fw-medium">Toplam Gün</div>
                                            <div className="fs-2 fw-bold text-info">{calendarInfo.totalDays}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="fs-sm text-success fw-medium">İş Günü</div>
                                            <div className="fs-2 fw-bold text-success">{calendarInfo.workDays}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="fs-sm text-danger fw-medium">Tatil Günü</div>
                                            <div className="fs-2 fw-bold text-danger">{calendarInfo.holidays}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Takvime Ayrılan Hafta Sonu ve Resmi Tatiller */}
                                <div className="table-light border border-secondary rounded p-4">
                                    <h5 className="fw-medium text-dark mb-3">Tatil ve Hafta Sonu Ayarları</h5>
                                    <div className="space-y-3">
                                        <div className="d-flex align-items-center space-x-3">
                                            <input
                                                type="radio"
                                                id="weekends_included"
                                                name="weekend_handling"
                                                className="h-4 w-4 text-primary focus:"
                                                defaultChecked
                                            />
                                            <label htmlFor="weekends_included" className="d-block fs-sm text-dark">
                                                Hafta sonları da iş günü olarak kabul edilsin
                                            </label>
                                        </div>
                                        <div className="d-flex align-items-center space-x-3">
                                            <input
                                                type="radio"
                                                id="weekends_excluded"
                                                name="weekend_handling"
                                                className="h-4 w-4 text-primary focus:"
                                            />
                                            <label htmlFor="weekends_excluded" className="d-block fs-sm text-dark">
                                                Hafta sonları iş dışı (takvim dışında) kabul edilsin
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Butonu */}
                            <div className="mt-8 d-flex justify-content-end">
                                <Link
                                    href={route('admin.work-calendars.index')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'Takvim Oluşturuluyor...' : 'Takvim Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Yeni Oluşturulan Takvim Bilgisi */}
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
                        <div className="d-flex">
                            <div className="d-flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h5 className="fw-medium">Not</h5>
                                <div className="mt-2 fs-sm text-warning">
                                    <p>
                                        Takvim oluşturulduktan sonra <strong>Tatiller</strong> ve <strong>Hafta Sonu</strong> günlerini 
                                        manuel olarak ekleyebilmeniz gerekmektedir. Varsayılan olarak sadece hafta sonu günleri 
                                        (Cumartesi-Pazar) otomatik olarak işaretlenecektir.
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