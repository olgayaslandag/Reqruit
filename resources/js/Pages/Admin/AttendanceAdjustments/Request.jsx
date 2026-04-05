import { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Request({ employees, attendanceRecords }) {
    const [formData, setFormData] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        original_clock_in: '',
        new_clock_in: '',
        original_clock_out: '',
        new_clock_out: '',
        type: 'clock_in', // clock_in, clock_out, both, duration
        reason: '',
        status: 'pending'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Seçilen empleyeye göre giriş-çıkış kayıtlarını al
    useEffect(() => {
        if (formData.employee_id && formData.date) {
            const recordsForEmployeeAndDate = attendanceRecords?.find(
                record => record.employee_id === formData.employee_id && record.date === formData.date
            );
            
            if (recordsForEmployeeAndDate) {
                setFormData(prev => ({
                    ...prev,
                    original_clock_in: recordsForEmployeeAndDate.original_clock_in || '',
                    original_clock_out: recordsForEmployeeAndDate.original_clock_out || '',
                    new_clock_in: recordsForEmployeeAndDate.clock_in || '',
                    new_clock_out: recordsForEmployeeAndDate.clock_out || ''
                }));
            }
        }
    }, [formData.employee_id, formData.date, attendanceRecords]);

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
        
        router.post(route('admin.adjustments.store'), formData, {
            onSuccess: () => {
                showSuccess('Devam düzeltme talebiniz başarıyla oluşturuldu.');
            },
            onError: (errorData) => {
                setErrors(errorData);
                showError('Talep oluşturulurken hata oluştu. Lütfen formu kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    // Tür değiştiğinde sadece ilgili saatlerin doldurulmasını sağla
    const handleTypeChange = (value) => {
        handleChange('type', value);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Devam Düzeltme Talebi Oluştur
                    </h5>
                    <Link
                        href={route('admin.adjustments.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title="Yeni Talep" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Talep Oluştur</h5>
                            <p className="mt-1 fs-sm text-muted">Varolan devam kaydında yapılacak düzeltmeleri buradan talep edebilirsiniz</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-3">
                                {/* Personel ve Tarih Selection */}
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Personel *
                                        </label>
                                        <select className="form-control" value={formData.employee_id}
                                            onChange={(e) => handleChange('employee_id', e.target.value)}
                                        >
                                            <option value="">Personel Seçin</option>
                                            {employees?.map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name} - {emp.identity_no}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.employee_id && <p className="mt-1 fs-sm text-danger">{errors.employee_id}</p>}
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Tarih *
                                        </label>
                                        <input className="form-control" type="date"
                                            value={formData.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                        />
                                        {errors.date && <p className="mt-1 fs-sm text-danger">{errors.date}</p>}
                                    </div>
                                </div>

                                {/* Değişim Tipi */}
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-3">
                                        Düzeltme Türü
                                    </label>
                                    <div className="d-grid d-grid-cols-1 gap-2">
                                        {[
                                            { value: 'clock_in', label: 'Giriş Saati', desc: 'Sadece giriş saatinde değişiklik' },
                                            { value: 'clock_out', label: 'Çıkış Saati', desc: 'Sadece çıkış saatinde değişiklik' },
                                            { value: 'both', label: 'Giriş + Çıkış', desc: 'İki saatte de değişiklik' },
                                            { value: 'duration', label: 'Süre Düzenle', desc: 'Çalışma süresi düzenlemesi' }
                                        ].map(type => (
                                            <div key={type.value} className="d-flex align-items-start">
                                                <input
                                                    type="radio"
                                                    id={`type-${type.value}`}
                                                    name="adjustment-type"
                                                    value={type.value}
                                                    checked={formData.type === type.value}
                                                    onChange={(e) => handleTypeChange(e.target.value)}
                                                    className="h-4 w-4 text-primary focus: border-secondary mt-1"
                                                />
                                                <label htmlFor={`type-${type.value}`} className="ml-2 d-block">
                                                    <span className="d-block fs-sm fw-medium text-dark">{type.label}</span>
                                                    <span className="d-block fs-xs text-muted">{type.desc}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Saat Seçimleri */}
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    <div className={`border rounded p-4 ${formData.type === 'clock_out' || formData.type === 'both' || formData.type === 'duration' ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <h5 className="fw-medium text-dark mb-3">Giriş Saati Düzeltmesi</h5>
                                        <p className="fs-xs text-muted mb-3">
                                            Orijinal saat: {formData.original_clock_in || '-'} 
                                            {formData.original_clock_in && <span className="ml-2">→ Yeni saat: {formData.new_clock_in}</span>}
                                        </p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="d-block fs-xs fw-medium text-muted mb-1">
                                                    Orijinal Giriş Saati
                                                </label>
                                                <input className="form-control" type="time"
                                                    value={formData.original_clock_in.split(' ')[1]?.substring(0, 5) || ''}
                                                    onChange={(e) => handleChange('original_clock_in', `${formData.date} ${e.target.value}:00`)}
                                                    disabled={formData.type === 'clock_out'}
                                                />
                                            </div>
                                            <div>
                                                <label className="d-block fs-xs fw-medium text-muted mb-1">
                                                    Yeni Giriş Saati
                                                </label>
                                                <input className="form-control" type="time"
                                                    value={formData.new_clock_in.split(' ')[1]?.substring(0, 5) || ''}
                                                    onChange={(e) => handleChange('new_clock_in', `${formData.date} ${e.target.value}:00`)}
                                                    disabled={formData.type === 'clock_out'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`border rounded p-4 ${formData.type === 'clock_in' ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <h5 className="fw-medium text-dark mb-3">Çıkış Saati Düzeltmesi</h5>
                                        <p className="fs-xs text-muted mb-3">
                                            Orijinal saat: {formData.original_clock_out || '-'} 
                                            {formData.original_clock_out && <span className="ml-2">→ Yeni saat: {formData.new_clock_out}</span>}
                                        </p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="d-block fs-xs fw-medium text-muted mb-1">
                                                    Orijinal Çıkış Saati
                                                </label>
                                                <input className="form-control" type="time"
                                                    value={formData.original_clock_out.split(' ')[1]?.substring(0, 5) || ''}
                                                    onChange={(e) => handleChange('original_clock_out', `${formData.date} ${e.target.value}:00`)}
                                                    disabled={formData.type === 'clock_in'}
                                                />
                                            </div>
                                            <div>
                                                <label className="d-block fs-xs fw-medium text-muted mb-1">
                                                    Yeni Çıkış Saati
                                                </label>
                                                <input className="form-control" type="time"
                                                    value={formData.new_clock_out.split(' ')[1]?.substring(0, 5) || ''}
                                                    onChange={(e) => handleChange('new_clock_out', `${formData.date} ${e.target.value}:00`)}
                                                    disabled={formData.type === 'clock_in'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Talep Sebebi */}
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Talep Nedeni * 
                                    </label>
                                    <textarea className="form-control" value={formData.reason}
                                        onChange={(e) => handleChange('reason', e.target.value)}
                                        rows={4}
                                        placeholder="Neden bu düzeltmeyi talep ettiniz? (Zorunlu sebep belirtmelisiniz)"
                                    ></textarea>
                                    {errors.reason && <p className="mt-1 fs-sm text-danger">{errors.reason}</p>}
                                </div>

                                {/* Onay Gerekliliği */}
                                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                    <h5 className="fw-medium text-info mb-2">Dikkat</h5>
                                    <div className="fs-sm text-info">
                                        <p>
                                            Bu talep管理部门 tarafından onaylandığında sistemdeki mevcut devam kaydı değiştirilecektir.
                                            Talebiniz onaylandığında fazla mesai hesaplamaları ve devam oranları bu yeni saatlere göre tekrar hesaplanacaktır.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Butonu */}
                            <div className="mt-8 d-flex justify-content-end">
                                <Link
                                    href={route('admin.adjustments.index')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'Talep İşleniyor...' : 'Talep Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Hızlı Erişim Linkleri */}
                    <div className="mt-6 d-grid d-grid-cols-1 gap-3">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium text-dark mb-2">Geçmiş Düzeltmeler</h5>
                            <Link
                                href={route('admin.adjustments.index')}
                                className="text-primary hover:text-indigo-800 fs-sm"
                            >
                                Onaylanmış ve beklemedeki tüm talepler →
                            </Link>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium text-dark mb-2">Tercih Edilen Saatler</h5>
                            <p className="fs-sm text-muted">
                                Geleneksel saat: 09:00 - 18:00, 
                                Mola süresi: 1 saat (13:00-14:00)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}