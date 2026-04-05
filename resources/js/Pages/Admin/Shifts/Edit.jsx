import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';
import { useFlashWithToast } from '@/Hooks/useFlash';

export default function Edit({ shift, departments }) {
    const flash = useFlashWithToast();

    const [formData, setFormData] = useState({
        name: shift.name || '',
        description: shift.description || '',
        department_id: shift.department_id || '',
        start_time: shift.start_time || '09:00',
        end_time: shift.end_time || '18:00',
        break_duration: shift.break_duration || '60',
        status: shift.status || 'active'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
        
        router.put(route('admin.shifts.update', shift.id), formData, {
            onSuccess: () => showSuccess('Vardiya başarıyla güncellendi.'),
            onError: (errorData) => {
                setErrors(errorData);
                showError('Lütfen gerekli alanları kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    const timeSlots = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            timeSlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }

    const calculateHours = () => {
        const [startH, startM] = formData.start_time.split(':').map(Number);
        const [endH, endM] = formData.end_time.split(':').map(Number);
        
        let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        
        const breakMinutes = parseInt(formData.break_duration) || 0;
        totalMinutes -= breakMinutes;
        
        return (totalMinutes / 60).toFixed(1);
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Vardiya Düzenle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Vardiyalar', url: route('admin.shifts.index') },
                    { label: 'Düzenle', url: route('admin.shifts.edit', shift.id) },
                ],
                backUrl: route('admin.shifts.index'),
            }}
        >
            <Head title={`Vardiya Düzenle: ${shift.name}`} />

            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-edit me-2"></i> Vardiya Bilgileri
                    </h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Vardiya Adı *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Örn: Sabah Vardiyası"
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-medium">Departman</label>
                                <select
                                    className="form-select"
                                    value={formData.department_id}
                                    onChange={(e) => handleChange('department_id', e.target.value)}
                                >
                                    <option value="">Tüm Departmanlar</option>
                                    {(departments || []).map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-medium">Başlangıç Saati *</label>
                                <select
                                    className={`form-select ${errors.start_time ? 'is-invalid' : ''}`}
                                    value={formData.start_time}
                                    onChange={(e) => handleChange('start_time', e.target.value)}
                                >
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                {errors.start_time && <div className="invalid-feedback">{errors.start_time}</div>}
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-medium">Bitiş Saati *</label>
                                <select
                                    className={`form-select ${errors.end_time ? 'is-invalid' : ''}`}
                                    value={formData.end_time}
                                    onChange={(e) => handleChange('end_time', e.target.value)}
                                >
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                {errors.end_time && <div className="invalid-feedback">{errors.end_time}</div>}
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-medium">Mola Süresi (dakika)</label>
                                <select
                                    className="form-select"
                                    value={formData.break_duration}
                                    onChange={(e) => handleChange('break_duration', e.target.value)}
                                >
                                    <option value="0">Yok</option>
                                    <option value="30">30 dk</option>
                                    <option value="45">45 dk</option>
                                    <option value="60">1 saat</option>
                                    <option value="90">1.5 saat</option>
                                    <option value="120">2 saat</option>
                                </select>
                            </div>

                            <div className="col-md-12">
                                <label className="form-label fw-medium">Açıklama</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Vardiya hakkında açıklama..."
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-medium">Durum</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="alert alert-info">
                                <i className="ti ti-info-circle me-2"></i>
                                <strong>Günlük Net Çalışma Süresi:</strong> {calculateHours()} saat
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-end gap-2">
                            <Link href={route('admin.shifts.index')} className="btn btn-light">
                                İptal
                            </Link>
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? (
                                    <><i className="ti ti-loader me-1"></i> Kaydediliyor...</>
                                ) : (
                                    <><i className="ti ti-check me-1"></i> Güncelle</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}