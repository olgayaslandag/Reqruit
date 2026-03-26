import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Create({ calendars }) {
    const { props } = usePage();
    const flash = props.flash;

    const [formData, setFormData] = useState({
        name: '',
        local_name: '',
        description: '',
        date: '',
        recurring: true,
        category: 'public_holiday',
        calendar_ids: []
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
        
        router.post(route('admin.holidays.store'), formData, {
            onSuccess: () => {
                showSuccess('Resmi tatil başarıyla oluşturuldu.');
            },
            onError: (errorData) => {
                setErrors(errorData);
                showError('Tatil oluşturulurken hata oluştu. Lütfen bilgileri kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Yeni Resmi Tatil Tanımla
                    </h2>
                    <Link
                        href={route('admin.holidays.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title="Yeni Tatil" />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Tatil Bilgileri</h3>
                            <p className="mt-1 text-sm text-gray-600">Yeni bir resmi tatil buradan tanımlanabilir</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                {/* Temel Bilgiler */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tatil Adı *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                            placeholder="Örnek: Zafer Bayramı"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Yerel Adı
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.local_name}
                                            onChange={(e) => handleChange('local_name', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Yerel olarak bildiğiniz ad"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tarih *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                        />
                                        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kategori
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => handleChange('category', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="public_holiday">Resmi Tatil</option>
                                            <option value="religious_holiday">Dini Bayram</option>
                                            <option value="national_holiday">Ulusal Bayram</option>
                                            <option value="international_holiday">Uluslararası Günü</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="recurring"
                                                checked={formData.recurring}
                                                onChange={(e) => handleChange('recurring', e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700">
                                                Bu tatil yılda bir tekrar edsin (her yıl aynı tarihde uygulanacak)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Tatil hakkında açıklama (isteğe bağlı)"
                                    />
                                </div>

                                {/* Takvim Seçimi */}
                                {calendars && calendars.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Takvilere Ekle
                                        </label>
                                        <select
                                            multiple
                                            value={formData.calendar_ids}
                                            onChange={handleMultiSelectChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-40"
                                        >
                                            {calendars.map(calendar => (
                                                <option key={calendar.id} value={calendar.id}>
                                                    {calendar.name} ({new Date(calendar.start_date).getFullYear()})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Bu tatili eklemek istediğiniz takvimleri seçin (isteğe bağlı)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Butonu */}
                            <div className="mt-8 flex justify-end gap-3">
                                <Link
                                    href={route('admin.holidays.index')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? 'Tatil Kaydediliyor...' : 'Tatil Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Türkiye Resmi Tatilleri Listesi */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Türkiye'de Yer Alan Resmi Tatiller</h3>
                                <div className="mt-2 text-sm text-blue-700 space-y-1">
                                    <p><strong>Resmi Tatiller:</strong> Yeni Yıl, Ulusal Egemenlik ve Çocuk Bayramı, Emek ve Dayanışma Günü, Gençlik ve Spor Bayramı, Zafer Bayramı</p>
                                    <p><strong>Dini Bayramlar:</strong> Ramazan Bayramı, Kurban Bayramı (tarihleri Hicriye göre değişir)</p>
                                    <p><strong>Ulusal Bayramlar:</strong> Nezarethani'nin Açılışı (Atatürk'ün ölümü)</p>
                                    <p><strong>Uluslararası Günler:</strong> Kadınlar Günü, Uluslararası Kitap Fuarı haftası vb.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}