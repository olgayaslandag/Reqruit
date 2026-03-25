import { useState, useEffect } from 'react';
import { router, useForm, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import InputError from '@/Components/InputError';
import { formatCurrency } from '@/Utils/formatters';
import { validateAdvanceRequest } from '@/Utils/validators';

/**
 * Yeni avans talebi
 * GET /admin/advances/request
 */
export default function Request({ employee, salaryInfo }) {
    const { props } = usePage();
    
    const [selectedEmployee, setSelectedEmployee] = useState(employee?.id || '');
    const [calculation, setCalculation] = useState(null);
    
    const { data, setData, post, processing, errors } = useForm({
        employee_id: employee?.id || '',
        type: 'salary',
        amount: '',
        request_date: new Date().toISOString().split('T')[0],
        installments: 1,
        description: '',
        iban: '',
        reason: '',
    });

    // Avans türü seçenekleri
    const advanceTypes = [
        { value: 'salary', label: 'Maaş Avansı', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { value: 'emergency', label: 'Acil Durum', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        { value: 'education', label: 'Eğitim', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
        { value: 'housing', label: 'Konut', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { value: 'other', label: 'Diğer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    ];

    // Çalışan değiştiğinde maaş bilgisini getir
    useEffect(() => {
        if (data.employee_id) {
            router.get(route('admin.advances.getSalaryInfo', { employee_id: data.employee_id }), {}, {
                onSuccess: (page) => {
                    if (page.props.salaryInfo) {
                        setCalculation(page.props.salaryInfo);
                    }
                },
            });
        }
    }, [data.employee_id]);

    // Tutar değiştiğinde taksit hesapla
    useEffect(() => {
        if (calculation && data.amount) {
            const monthlyAmount = data.amount / (data.installments || 1);
            setCalculation(prev => ({
                ...prev,
                monthlyDeduction: monthlyAmount,
                totalWithInterest: data.amount,
            }));
        }
    }, [data.amount, data.installments]);

    // Form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Doğrulama
        const validation = validateAdvanceRequest(data, calculation);
        if (!validation.valid) {
            // Hataları errors objesine aktar
            Object.entries(validation.errors).forEach(([key, value]) => {
                errors[key] = value;
            });
            showError('Lütfen formdaki hataları düzeltin.');
            return;
        }
        
        post(route('admin.advances.store'), {
            onSuccess: () => {
                showSuccess('Avans talebi başarıyla oluşturuldu.');
            },
            onError: () => {
                showError('Avans talebi oluşturulurken hata oluştu.');
            },
        });
    };

    // Maksimum tutar hesapla
    const maxAdvanceAmount = calculation?.gross_salary 
        ? calculation.gross_salary * 0.4 
        : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.advances.index')}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
                        title="Geri"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Yeni Avans Talebi
                    </h2>
                </div>
            }
        >
            <Head title="Yeni Avans Talebi" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow">
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Çalışan Seçimi (Admin ise) */}
                                {!employee && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Çalışan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Çalışan seçin</option>
                                            {props.employees?.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.employee_id} className="mt-1" />
                                    </div>
                                )}

                                {/* Avans Türü */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Avans Türü <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {advanceTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setData('type', type.value)}
                                                className={`p-3 rounded-lg border-2 text-center transition ${
                                                    data.type === type.value
                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                                                </svg>
                                                <span className="text-xs font-medium">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.type} className="mt-1" />
                                </div>

                                {/* Tutar */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tutar (TL) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="0,00"
                                            min="0"
                                            step="0.01"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-12"
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            ₺
                                        </span>
                                    </div>
                                    {calculation && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Maksimum avans tutarı: {formatCurrency(maxAdvanceAmount)} (Brüt maaşın %40'ı)
                                        </p>
                                    )}
                                    <InputError message={errors.amount} className="mt-1" />
                                </div>

                                {/* Tarih ve Taksit */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Talep Tarihi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.request_date}
                                            onChange={(e) => setData('request_date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <InputError message={errors.request_date} className="mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Taksit Sayısı
                                        </label>
                                        <select
                                            value={data.installments}
                                            onChange={(e) => setData('installments', parseInt(e.target.value))}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value={1}>1 Taksit</option>
                                            <option value={2}>2 Taksit</option>
                                            <option value={3}>3 Taksit</option>
                                            <option value={4}>4 Taksit</option>
                                            <option value={6}>6 Taksit</option>
                                            <option value={12}>12 Taksit</option>
                                        </select>
                                    </div>
                                </div>

                                {/* IBAN */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        IBAN (Opsiyonel)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.iban}
                                        onChange={(e) => setData('iban', e.target.value.toUpperCase())}
                                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                                        maxLength={26}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 uppercase"
                                    />
                                    <InputError message={errors.iban} className="mt-1" />
                                </div>

                                {/* Açıklama/Neden */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama {data.type === 'emergency' && <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        placeholder="Avans talebinin nedeni..."
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <InputError message={errors.description} className="mt-1" />
                                </div>

                                {/* Butonlar */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Link
                                        href={route('admin.advances.index')}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        İptal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Gönderiliyor...' : 'Talep Oluştur'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Bilgi Paneli */}
                        <div className="space-y-6">
                            {/* Maaş Bilgisi */}
                            {calculation ? (
                                <div className="bg-white rounded-lg shadow p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Maaş Bilgileri</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Brüt Maaş</span>
                                            <span className="font-medium">{formatCurrency(calculation.gross_salary)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Net Maaş</span>
                                            <span className="font-medium">{formatCurrency(calculation.net_salary)}</span>
                                        </div>
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between text-green-600">
                                                <span className="text-sm">Maksimum Avans</span>
                                                <span className="font-medium">{formatCurrency(maxAdvanceAmount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : data.employee_id ? (
                                <div className="bg-white rounded-lg shadow p-4">
                                    <p className="text-sm text-gray-500">Maaş bilgisi yükleniyor...</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow p-4">
                                    <p className="text-sm text-gray-500">Çalışan seçiniz.</p>
                                </div>
                            )}

                            {/* Taksit Hesaplama */}
                            {calculation && data.amount && (
                                <div className="bg-white rounded-lg shadow p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ödeme Planı</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Toplam Tutar</span>
                                            <span className="font-medium">{formatCurrency(data.amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Taksit Sayısı</span>
                                            <span className="font-medium">{data.installments}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-3">
                                            <span className="text-gray-500">Aylık Kesinti</span>
                                            <span className="font-bold text-indigo-600">
                                                {formatCurrency((data.amount / (data.installments || 1)).toFixed(2))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kurallar */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Avans Kuralları</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Maksimum maaşın %40'ı kadar avans alınabilir.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Minimum avans tutarı 1.000 TL'dir.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Maksimum 12 taksit seçilebilir.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Onay süreci yöneticinize göre değişir.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
