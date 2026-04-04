import { useState } from 'react';
import { router, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import InputError from '@/Components/InputError';

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

    const handlePeriodTypeChange = (type) => {
        setPeriodType(type);
        setData('period_type', type);
        
        const today = new Date();
        let startDate, endDate;
        let biweekDay = 0;
        
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
                biweekDay = Math.floor(today.getDate() / 15);
                startDate = new Date(today.getFullYear(), today.getMonth(), biweekDay * 15 + 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), biweekDay === 0 ? 15 : new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate());
                break;
            default:
                return;
        }
        
        setData('start_date', startDate.toISOString().split('T')[0]);
        setData('end_date', endDate.toISOString().split('T')[0]);
        
        const workDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        setData('work_days', workDays);
        
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        if (type === 'monthly') {
            setData('name', `${monthNames[today.getMonth()]} ${today.getFullYear()} Bordrosu`);
        } else if (type === 'weekly') {
            setData('name', `Hafta ${Math.ceil(today.getDate() / 7)} - ${monthNames[today.getMonth()]} ${today.getFullYear()}`);
        } else if (type === 'biweekly') {
            setData('name', `Dönem ${biweekDay + 1} - ${monthNames[today.getMonth()]} ${today.getFullYear()}`);
        }
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('admin.payrolls.store'), {
            onSuccess: () => {
                showSuccess('Bordro dönemi başarıyla oluşturuldu.');
            },
            onError: () => {
                showError('Bordro dönemi oluşturulurken hata oluştu.');
            },
        });
    };

    const periodTypes = [
        { value: 'monthly', label: 'Aylık', icon: 'ti-calendar', color: 'primary' },
        { value: 'biweekly', label: 'İki Haftalık', icon: 'ti-calendar-event', color: 'info' },
        { value: 'weekly', label: 'Haftalık', icon: 'ti-calendar-week', color: 'success' },
    ];

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Yeni Bordro Dönemi',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Bordro Dönemleri', url: route('admin.payrolls.index') },
                    { label: 'Yeni Dönem', url: route('admin.payrolls.create') },
                ],
                backUrl: route('admin.payrolls.index'),
            }}
        >
            <Head title="Yeni Bordro Dönemi" />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-calendar-plus me-2"></i> Bordro Bilgileri
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Dönem Tipi */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-category me-1"></i> Dönem Tipi
                                    </label>
                                    <div className="row g-2">
                                        {periodTypes.map((type) => (
                                            <div key={type.value} className="col-md-4">
                                                <div
                                                    className={`card h-100 cursor-pointer ${periodType === type.value ? 'border-' + type.color : 'border'}`}
                                                    onClick={() => handlePeriodTypeChange(type.value)}
                                                >
                                                    <div className="card-body text-center">
                                                        <div className={`mb-2 fs-3 ${periodType === type.value ? 'text-' + type.color : 'text-muted'}`}>
                                                            <i className={`ti ${type.icon}`}></i>
                                                        </div>
                                                        <div className="fw-medium">{type.label}</div>
                                                        <input
                                                            type="radio"
                                                            name="period_type"
                                                            value={type.value}
                                                            checked={periodType === type.value}
                                                            onChange={() => handlePeriodTypeChange(type.value)}
                                                            className="d-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Dönem Adı */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-tag me-1"></i> Dönem Adı <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Örn: Ocak 2026 Bordrosu"
                                    />
                                    <InputError message={errors.name} className="invalid-feedback" />
                                </div>

                                {/* Tarih Aralığı */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-event me-1"></i> Başlangıç Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                                            value={data.start_date}
                                            onChange={(e) => handleDateChange('start_date', e.target.value)}
                                        />
                                        <InputError message={errors.start_date} className="invalid-feedback" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-event me-1"></i> Bitiş Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                                            value={data.end_date}
                                            onChange={(e) => handleDateChange('end_date', e.target.value)}
                                        />
                                        <InputError message={errors.end_date} className="invalid-feedback" />
                                    </div>
                                </div>

                                {/* Çalışma Günü */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-clock me-1"></i> Çalışma Günü Sayısı <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.work_days ? 'is-invalid' : ''}`}
                                        value={data.work_days}
                                        onChange={(e) => setData('work_days', parseInt(e.target.value) || 0)}
                                        min="1"
                                        max="31"
                                    />
                                    <small className="text-muted">
                                        Normal çalışma günü: 30 gün (Pazartesi-Cuma)
                                    </small>
                                    <InputError message={errors.work_days} className="invalid-feedback" />
                                </div>

                                {/* Açıklama */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-file-text me-1"></i> Açıklama
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Bu dönem için notlar..."
                                    />
                                    <InputError message={errors.description} className="invalid-feedback" />
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link
                                        href={route('admin.payrolls.index')}
                                        className="btn btn-light"
                                    >
                                        <i className="ti ti-arrow-left me-1"></i> İptal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn btn-primary"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Oluşturuluyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Oluştur
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
                    <div className="card border-info mb-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Bilgi
                            </h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    <strong>Aylık:</strong> Her ayın 1-30/31 arası
                                </li>
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    <strong>İki Haftalık:</strong> Ayın 1-15 ve 16-30/31 arası
                                </li>
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    <strong>Haftalık:</strong> Her Pazartesi-Pazar
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="alert alert-warning" role="alert">
                        <h6 className="alert-heading fw-bold">
                            <i className="ti ti-alert-triangle me-1"></i> Dikkat
                        </h6>
                        <p className="mb-0 small">
                            Bordro dönemi oluşturulduktan sonra çalışan maaşları otomatik hesaplanır.
                            Tarih aralığını doğru seçtiğinizden emin olun.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
