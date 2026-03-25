import { useState } from 'react';
import { router, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import InputError from '@/Components/InputError';
import { validatePayrollPeriod } from '@/Utils/validators';

/**
 * Yeni bordro dönemi oluştur
 * GET /admin/payrolls/create
 */
export default function Create() {
    const [periodType, setPeriodType] = useState('monthly');
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        period_type: 'monthly',
        start_date: '',
        end_date: '',
        work_days: 30,
        description: '',
    });

    // Dönem tipi değişikliğinde tarihleri otomatik doldur
    const handlePeriodTypeChange = (type) => {
        setPeriodType(type);
        setData('period_type', type);
        
        const today = new Date();
        let startDate, endDate;
        
        switch (type) {
            case 'monthly':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'weekly':
                const dayOfWeek = today.getDay();
                const monday = new Date(today);
                monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
                startDate = monday;
                endDate = new Date(monday);
                endDate.setDate(monday.getDate() + 6);
                break;
            case 'biweekly':
                const biweekDay = Math.floor(today.getDate() / 15);
                startDate = new Date(today.getFullYear(), today.getMonth(), biweekDay * 15 + 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), biweekDay === 0 ? 15 : today.getDaysInMonth());
                break;
            default:
                return;
        }
        
        setData('start_date', startDate.toISOString().split('T')[0]);
        setData('end_date', endDate.toISOString().split('T')[0]);
        
        // Çalışma günlerini hesapla
        const workDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        setData('work_days', workDays);
        
        // Dönem adını otomatik oluştur
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        if (type === 'monthly') {
            setData('name', `${monthNames[today.getMonth()]} ${today.getFullYear()} Bordrosu`);
        } else if (type === 'weekly') {
            setData(`name`, `Hafta ${Math.ceil(today.getDate() / 7)} - ${monthNames[today.getMonth()]} ${today.getFullYear()}`);
        } else if (type === 'biweekly') {
            setData('name', `Dönem ${biweekDay + 1} - ${monthNames[today.getMonth()]} ${today.getFullYear()}`);
        }
    };

    // Tarih değişikliğinde çalışma günlerini hesapla
    const handleDateChange = (field, value) => {
        setData(field, value);
        
        if (field === 'start_date' || field === 'end_date') {
            const startDate = field === 'start_date' ? value : data.start_date;
            const endDate = field === 'end_date' ? value : data.end_date;
            
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const workDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                setData('work_days', Math.max(1, Math.min(31, workDays)));
            }
        }
    };

    // Form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Doğrulama
        const validation = validatePayrollPeriod(data);
        if (!validation.valid) {
            showError('Lütfen formdaki hataları düzeltin.');
            return;
        }
        
        post(route('admin.payrolls.store'), {
            onSuccess: () => {
                showSuccess('Bordro dönemi başarıyla oluşturuldu.');
            },
            onError: () => {
                showError('Bordro dönemi oluşturulurken hata oluştu.');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.payrolls.index')}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
                        title="Geri"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Yeni Bordro Dönemi Oluştur
                    </h2>
                </div>
            }
        >
            <Head title="Yeni Bordro Dönemi" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Dönem Tipi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dönem Tipi
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'monthly', label: 'Aylık', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                        { value: 'biweekly', label: 'İki Haftalık', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                        { value: 'weekly', label: 'Haftalık', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => handlePeriodTypeChange(type.value)}
                                            className={`p-4 rounded-lg border-2 text-center transition ${
                                                periodType === type.value
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                                            </svg>
                                            <span className="text-sm font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dönem Adı */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dönem Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Örn: Ocak 2026 Bordrosu"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Tarih Aralığı */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Başlangıç Tarihi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => handleDateChange('start_date', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <InputError message={errors.start_date} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bitiş Tarihi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => handleDateChange('end_date', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <InputError message={errors.end_date} className="mt-1" />
                                </div>
                            </div>

                            {/* Çalışma Günü */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Çalışma Günü Sayısı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.work_days}
                                    onChange={(e) => setData('work_days', parseInt(e.target.value) || 0)}
                                    min="1"
                                    max="31"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <InputError message={errors.work_days} className="mt-1" />
                                <p className="text-xs text-gray-500 mt-1">
                                    Normal çalışma günü: 30 gün (Pazartesi-Cuma)
                                </p>
                            </div>

                            {/* Açıklama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Açıklama
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Bu dönem için notlar..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            {/* Butonlar */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Link
                                    href={route('admin.payrolls.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? 'Oluşturuluyor...' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
