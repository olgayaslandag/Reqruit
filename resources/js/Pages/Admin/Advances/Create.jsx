import { useState, useEffect } from 'react';
import { router, useForm, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import { formatCurrency } from '@/Utils/formatters';

export default function Request({ employee, salaryInfo }) {
    const { props } = usePage();
    
    const [calculation, setCalculation] = useState(salaryInfo);
    
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

    const advanceTypes = [
        { value: 'salary', label: 'Maaş Avansı', icon: 'ti-coin', color: 'success' },
        { value: 'emergency', label: 'Acil Durum', icon: 'ti-alert-circle', color: 'danger' },
        { value: 'education', label: 'Eğitim', icon: 'ti-book', color: 'info' },
        { value: 'housing', label: 'Konut', icon: 'ti-home', color: 'primary' },
        { value: 'other', label: 'Diğer', icon: 'ti-dots', color: 'secondary' },
    ];

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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('admin.advances.store'), {
            onSuccess: () => {
                showSuccess('Avans talebi başarıyla oluşturuldu.');
            },
            onError: () => {
                showError('Avans talebi oluşturulurken hata oluştu.');
            },
        });
    };

    const maxAdvanceAmount = calculation?.gross_salary 
        ? calculation.gross_salary * 0.4 
        : 0;

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Yeni Avans Talebi',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Avans Talepleri', url: route('admin.advances.index') },
                    { label: 'Yeni Talep', url: route('admin.advances.create') },
                ],
                backUrl: route('admin.advances.index'),
            }}
        >
            <Head title="Yeni Avans Talebi" />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-hand-finger me-2"></i> Talep Bilgileri
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Çalışan Seçimi */}
                                {!employee && (
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-user me-1"></i> Çalışan <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.employee_id ? 'is-invalid' : ''}`}
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value)}
                                        >
                                            <option value="">Çalışan seçin</option>
                                            {props.employees?.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.employee_id && <div className="invalid-feedback">{errors.employee_id}</div>}
                                    </div>
                                )}

                                {/* Avans Türü */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-category me-1"></i> Avans Türü <span className="text-danger">*</span>
                                    </label>
                                    <div className="row g-2">
                                        {advanceTypes.map((type) => (
                                            <div key={type.value} className="col-6 col-md-4">
                                                <div
                                                    className={`card h-100 cursor-pointer ${data.type === type.value ? 'border-' + type.color : 'border'}`}
                                                    onClick={() => setData('type', type.value)}
                                                >
                                                    <div className="card-body text-center py-3">
                                                        <div className={`mb-2 fs-3 ${data.type === type.value ? 'text-' + type.color : 'text-muted'}`}>
                                                            <i className={`ti ${type.icon}`}></i>
                                                        </div>
                                                        <div className="fw-medium small">{type.label}</div>
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type.value}
                                                            checked={data.type === type.value}
                                                            onChange={() => setData('type', type.value)}
                                                            className="d-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.type && <div className="invalid-feedback d-block">{errors.type}</div>}
                                </div>

                                <div className="row g-3 mb-3">
                                    {/* Tutar */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-coin me-1"></i> Tutar (TL) <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />
                                            <span className="input-group-text">₺</span>
                                        </div>
                                        {calculation && (
                                            <small className="text-muted">
                                                Maksimum: {formatCurrency(maxAdvanceAmount)} (Brüt maaşın %40'ı)
                                            </small>
                                        )}
                                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                    </div>

                                    {/* Talep Tarihi */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar me-1"></i> Talep Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.request_date ? 'is-invalid' : ''}`}
                                            value={data.request_date}
                                            onChange={(e) => setData('request_date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.request_date && <div className="invalid-feedback">{errors.request_date}</div>}
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    {/* Taksit */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-list-numbers me-1"></i> Taksit Sayısı
                                        </label>
                                        <select
                                            className="form-select"
                                            value={data.installments}
                                            onChange={(e) => setData('installments', parseInt(e.target.value))}
                                        >
                                            <option value={1}>1 Taksit</option>
                                            <option value={2}>2 Taksit</option>
                                            <option value={3}>3 Taksit</option>
                                            <option value={4}>4 Taksit</option>
                                            <option value={6}>6 Taksit</option>
                                            <option value={12}>12 Taksit</option>
                                        </select>
                                    </div>

                                    {/* IBAN */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-credit-card me-1"></i> IBAN (Opsiyonel)
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.iban}
                                            onChange={(e) => setData('iban', e.target.value.toUpperCase())}
                                            placeholder="TR00 0000 0000 0000 0000 0000 00"
                                            maxLength={26}
                                        />
                                    </div>
                                </div>

                                {/* Açıklama/Neden */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        <i className="ti ti-file-text me-1"></i> Açıklama {data.type === 'emergency' && <span className="text-danger">*</span>}
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Avans talebinin nedeni..."
                                    />
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                                    <Link
                                        href={route('admin.advances.index')}
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
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-send me-1"></i> Talep Oluştur
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sağ Panel */}
                <div className="col-lg-4">
                    {/* Maaş Bilgisi */}
                    {calculation ? (
                        <div className="card border-success mb-4">
                            <div className="card-header bg-success text-white">
                                <h6 className="mb-0 fw-bold">
                                    <i className="ti ti-coin me-1"></i> Maaş Bilgileri
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="text-muted small">Brüt Maaş</label>
                                    <div className="fw-medium">{formatCurrency(calculation.gross_salary)}</div>
                                </div>
                                <div className="mb-3">
                                    <label className="text-muted small">Net Maaş</label>
                                    <div className="fw-medium">{formatCurrency(calculation.net_salary)}</div>
                                </div>
                                <hr />
                                <div>
                                    <label className="text-success small">Maksimum Avans</label>
                                    <div className="fw-bold text-success">{formatCurrency(maxAdvanceAmount)}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card border-secondary mb-4">
                            <div className="card-body text-center py-4">
                                <i className="ti ti-user fs-1 text-muted mb-2"></i>
                                <p className="mb-0 text-muted">Çalışan seçiniz</p>
                            </div>
                        </div>
                    )}

                    {/* Ödeme Planı */}
                    {calculation && data.amount && (
                        <div className="card border-info mb-4">
                            <div className="card-header bg-info text-white">
                                <h6 className="mb-0 fw-bold">
                                    <i className="ti ti-calculator me-1"></i> Ödeme Planı
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-2">
                                    <label className="text-muted small">Toplam Tutar</label>
                                    <div className="fw-medium">{formatCurrency(data.amount)}</div>
                                </div>
                                <div className="mb-2">
                                    <label className="text-muted small">Taksit Sayısı</label>
                                    <div className="fw-medium">{data.installments}</div>
                                </div>
                                <hr />
                                <div>
                                    <label className="text-primary small">Aylık Kesinti</label>
                                    <div className="fw-bold text-primary">
                                        {formatCurrency((data.amount / (data.installments || 1)).toFixed(2))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Kurallar */}
                    <div className="card border-warning">
                        <div className="card-header bg-warning text-dark">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Avans Kuralları
                            </h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    Maksimum maaşın %40'ı
                                </li>
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    Minimum 1.000 TL
                                </li>
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    En fazla 12 taksit
                                </li>
                                <li>
                                    <i className="ti ti-check text-success me-2"></i>
                                    Yönetici onayı gerekir
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
