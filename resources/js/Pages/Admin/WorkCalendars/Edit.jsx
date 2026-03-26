import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Edit({ calendar, holidayDays, weekendCount, workingDays }) {
    const { props } = usePage();
    const flash = props.flash;

    const [formData, setFormData] = useState({
        name: calendar.name || '',
        description: calendar.description || '',
        start_date: calendar.start_date || new Date().toISOString().split('T')[0],
        end_date: calendar.end_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: calendar.status || 'draft',
        default_calendar: calendar.default_calendar || false
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
        
        router.put(route('admin.work-calendars.update', calendar.id), formData, {
            onSuccess: () => {
                showSuccess('İş takvimi başarıyla güncellendi.');
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        İş Takvimi Düzenle
                    </h2>
                    <Link
                        href={route('admin.work-calendars.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title={`Takvim Düzenle: ${calendar.name}`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Takvim Bilgileri</h3>
                            <p className="mt-1 text-sm text-gray-600">Takvim bilgilerini burada düzenleyebilirsiniz</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                {/* Temel Bilgiler */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Takvim Adı *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                            placeholder="Örneğin: 2025 İş Takvimi"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Açıklama
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Takvim hakkında açıklama..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Başlangıç Tarihi *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => handleChange('start_date', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.start_date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                        />
                                        {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bitiş Tarihi *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => handleChange('end_date', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.end_date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                        />
                                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Durum
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleChange('status', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="draft">Taslak</option>
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Pasif</option>
                                            <option value="archived">Arşiv</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center pt-6">
                                        <input
                                            type="checkbox"
                                            id="default_calendar"
                                            checked={formData.default_calendar}
                                            onChange={(e) => handleChange('default_calendar', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="default_calendar" className="ml-2 block text-sm text-gray-700">
                                            Varsayılan takvim olarak ata
                                        </label>
                                    </div>
                                </div>

                                {/* Mevcut Takvim Durumu */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-blue-800 mb-1">Toplam Gün</h4>
                                        <p className="text-xl font-bold text-blue-800">{calendarInfo.totalDays}</p>
                                        <p className="text-xs text-gray-600">({new Date(calendar.start_date).toLocaleDateString('tr-TR')} - {new Date(calendar.end_date).toLocaleDateString('tr-TR')})</p>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-green-800 mb-1">İş Günü</h4>
                                        <p className="text-xl font-bold text-green-800">{workingDays || 0}</p>
                                        <p className="text-xs text-gray-600">Hedeflenen iş günü</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-red-800 mb-1">Tatil Günü</h4>
                                        <p className="text-xl font-bold text-red-800">{holidayDays || 0}</p>
                                        <p className="text-xs text-gray-600">(+{weekendCount || 0} hafta sonu)</p>
                                    </div>
                                </div>

                                {/* Hızlı Gösterge Paneli */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-800 mb-3">Takvim Özeti</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h5 className="text-xs font-medium text-gray-700 mb-1">Kullanıcılar</h5>
                                            <p className="text-sm text-gray-900">
                                                {calendar.used_by_count || 0} kullanıcı kullanıyor
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-medium text-gray-700 mb-1">Değiştirme Hakkı</h5>
                                            <p className="text-sm text-gray-900">
                                                {calendar.status === 'active' ? 'Değişim yapılamaz*' : 'Değişim yapılabilir'}
                                            </p>
                                        </div>
                                    </div>
                                    {calendar.status === 'active' && (
                                        <p className="text-xs text-yellow-600 mt-2">
                                            * Aktif takvim değiştirilemez, arşivleyip yeniden oluşturmalısınız.
                                        </p>
                                    )}
                                </div>

                                {/* Takvime Ayrılan Hafta Sonu ve Resmi Tatiller */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-800 mb-3">Tatil ve Hafta Sonu Ayarları</h4>
                                    <Link
                                        href={route('admin.holidays.index')}
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900"
                                    >
                                        Resmi tatilleri yönetmek için tıklayın
                                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Submit Butonu */}
                            <div className="mt-8 flex justify-end gap-3">
                                <Link
                                    href={route('admin.work-calendars.index')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading || calendar.status === 'active'}
                                    className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                                        calendar.status === 'active' ? 'opacity-50 cursor-not-allowed' : 'disabled:opacity-50'
                                    }`}
                                >
                                    {loading ? 'Güncelleniyor...' : 
                                     calendar.status === 'active' ? 'Aktif Takvim Düzenlenemez' : 
                                     'Takvimi Güncelle'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Düzenleme Notları */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Takvim Düzenleme Notları</h3>
                                <div className="mt-2 text-sm text-blue-700 space-y-1">
                                    <p>• Aktif bir takvim üzerinde değişiklik yapmanız personel devam kayıtlarını etkileyebilir.</p>
                                    <p>• Yeni resmi tatiller eklemek için Tatiller yönetimine gitmelisiniz.</p>
                                    <p>• Takvim tarihi güncellemeden önce bağlı verileri kontrol etmelisiniz.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}