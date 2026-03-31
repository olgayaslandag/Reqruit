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
                <div className="d-flex align-items-center gap-3">
                    <Link
                        href={route('admin.payrolls.index')}
                        className="p-2 text-muted hover:text-dark hover:bg-light rounded"
                        title="Geri"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h5 className="fw-semibold">
                        Yeni Bordro Dönemi Oluştur
                    </h5>
                </div>
            }
        >
            <Head title="Yeni Bordro Dönemi" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white rounded-3 shadow-sm">
                        <form onSubmit={handleSubmit} className="p-4 mb-3">
                            {/* Dönem Tipi */}
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-2">
                                    Dönem Tipi
                                </label>
                                <div className="d-grid d-grid-cols-3 gap-2">
                                    {[
                                        { value: 'monthly', label: 'Aylık', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                        { value: 'biweekly', label: 'İki Haftalık', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                        { value: 'weekly', label: 'Haftalık', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => handlePeriodTypeChange(type.value)}
                                            className={`p-4 rounded border-2 text-center  ${
                                                periodType === type.value
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-secondary hover:border-secondary'
                                            }`}
                                        >
                                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                                            </svg>
                                            <span className="fs-sm fw-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dönem Adı */}
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Dönem Adı <span className="text-danger">*</span>
                                </label>
                                <input type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Örn: Ocak 2026 Bordrosu"
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Tarih Aralığı */}
                            <div className="d-grid d-grid-cols-2 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Başlangıç Tarihi <span className="text-danger">*</span>
                                    </label>
                                    <input type="date"
                                        value={data.start_date}
                                        onChange={(e) => handleDateChange('start_date', e.target.value)}
                                        className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    />
                                    <InputError message={errors.start_date} className="mt-1" />
                                </div>
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Bitiş Tarihi <span className="text-danger">*</span>
                                    </label>
                                    <input type="date"
                                        value={data.end_date}
                                        onChange={(e) => handleDateChange('end_date', e.target.value)}
                                        className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    />
                                    <InputError message={errors.end_date} className="mt-1" />
                                </div>
                            </div>

                            {/* Çalışma Günü */}
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Çalışma Günü Sayısı <span className="text-danger">*</span>
                                </label>
                                <input type="number"
                                    value={data.work_days}
                                    onChange={(e) => setData('work_days', parseInt(e.target.value) || 0)}
                                    min="1"
                                    max="31"
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                />
                                <InputError message={errors.work_days} className="mt-1" />
                                <p className="fs-xs text-muted mt-1">
                                    Normal çalışma günü: 30 gün (Pazartesi-Cuma)
                                </p>
                            </div>

                            {/* Açıklama */}
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Açıklama
                                </label>
                                <textarea value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Bu dönem için notlar..."
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            {/* Butonlar */}
                            <div className="d-flex justify-content-end pt-4 border-t">
                                <Link
                                    href={route('admin.payrolls.index')}
                                    className="px-4 py-2 border border-secondary rounded text-dark hover:table-light"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-primary btn-sm disabled:opacity-50"
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
