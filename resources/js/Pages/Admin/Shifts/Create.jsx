import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Create({ departments, shifts }) {
    const { props } = usePage();
    const flash = props.flash;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        department_id: '',
        start_time: '09:00',
        end_time: '18:00',
        break_duration: '01:00',
        days: {
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: false,
            sun: false
        },
        status: 'active'
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

    const handleDayToggle = (day) => {
        setFormData(prev => ({
            ...prev,
            days: {
                ...prev.days,
                [day]: !prev.days[day]
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        router.post(route('admin.shifts.store'), formData, {
            onSuccess: () => {
                showSuccess('Vardiya başarıyla oluşturuldu.');
            },
            onError: (errorData) => {
                setErrors(errorData);
                showError('Lütfen gerekli alanları kontrol edin.');
            },
            onFinish: () => setLoading(false)
        });
    };

    const timeSlots = [
        '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',
        '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
        '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
        '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Yeni Vardiya Tanımla
                    </h5>
                    <Link
                        href={route('admin.shifts.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title="Yeni Vardiya" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Vardiya Bilgileri</h5>
                            <p className="mt-1 fs-sm text-muted">Yeni bir vardiyayı buradan tanımlayabilirsiniz</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-3">
                                {/* Temel Bilgiler */}
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Vardiya Adı *
                                    </label>
                                    <input className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                            errors.name ? 'border-red-300 focus: focus:border-red-500' : ''
                                        }`} type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="Sabah Vardiyası, Part-Time vs."
                                    />
                                    {errors.name && <p className="mt-1 fs-sm text-danger">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Açıklama
                                    </label>
                                    <textarea className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={3}
                                        placeholder="Vardiya hakkında detaylı bilgi..."
                                    />
                                </div>

                                <div className="d-grid d-grid-cols-1 gap-3">
                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Departman
                                        </label>
                                        <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={formData.department_id}
                                            onChange={(e) => handleChange('department_id', e.target.value)}
                                        >
                                            <option value="">Tüm Departmanlar</option>
                                            {departments?.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Status
                                        </label>
                                        <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={formData.status}
                                            onChange={(e) => handleChange('status', e.target.value)}
                                        >
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Pasif</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Saat Tanımları */}
                                <div className="d-grid d-grid-cols-1 gap-3">
                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Başlangıç Saati *
                                        </label>
                                        <select className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.start_time ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`} value={formData.start_time}
                                            onChange={(e) => handleChange('start_time', e.target.value)}
                                        >
                                            {timeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {errors.start_time && <p className="mt-1 fs-sm text-danger">{errors.start_time}</p>}
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Bitiş Saati *
                                        </label>
                                        <select className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.end_time ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`} value={formData.end_time}
                                            onChange={(e) => handleChange('end_time', e.target.value)}
                                        >
                                            {timeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {errors.end_time && <p className="mt-1 fs-sm text-danger">{errors.end_time}</p>}
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Mola Süresi
                                        </label>
                                        <select className={`form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 ${
                                                errors.break_duration ? 'border-red-300 focus: focus:border-red-500' : ''
                                            }`} value={formData.break_duration}
                                            onChange={(e) => handleChange('break_duration', e.target.value)}
                                        >
                                            {timeSlots.slice(0, 4).map(time => (
                                                <option key={time} value={time}>{time} saat</option>
                                            ))}
                                        </select>
                                        {errors.break_duration && <p className="mt-1 fs-sm text-danger">{errors.break_duration}</p>}
                                    </div>
                                </div>

                                {/* Çalışma Günleri */}
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-3">
                                        Çalışma Günleri
                                    </label>
                                    <div className="d-grid d-grid-cols-2 gap-2">
                                        {[
                                            { key: 'mon', label: 'Pazartesi' },
                                            { key: 'tue', label: 'Salı' },
                                            { key: 'wed', label: 'Çarşamba' },
                                            { key: 'thu', label: 'Perşembe' },
                                            { key: 'fri', label: 'Cuma' },
                                            { key: 'sat', label: 'Cumartesi' },
                                            { key: 'sun', label: 'Pazar' }
                                        ].map(day => (
                                            <div key={day.key} className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    id={day.key}
                                                    checked={formData.days[day.key]}
                                                    onChange={() => handleDayToggle(day.key)}
                                                    className="h-4 w-4 text-primary focus: border-secondary rounded"
                                                />
                                                <label htmlFor={day.key} className="ml-2 d-block fs-sm text-dark">
                                                    {day.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hesaplanan Bilgiler */}
                                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                    <h5 className="fw-medium text-info mb-2">Vardiya Bilgileri</h5>
                                    
                                    {/* Toplam gün sayısını hesaplayalım */}
                                    {(() => {
                                        const workDaysCount = Object.values(formData.days).filter(day => day).length;
                                        const startDate = new Date(`2024-01-01 ${formData.start_time}`);
                                        const endDate = new Date(`2024-01-01 ${formData.end_time}`); // Aynı gün tarihi
                        
                                        // Eğer bitiş saati başlangıç saatinden küçükse sonraki güne git
                                        if (endDate < startDate) {
                                            endDate.setDate(endDate.getDate() + 1);
                                        }
                                        
                                        // Saat farkını hesapla
                                        const hoursDifference = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                                        
                                        return (
                                            <div className="d-grid d-grid-cols-1 gap-3 fs-sm">
                                                <div>
                                                    <span className="text-muted">Toplam Günlük Satış</span><br />
                                                    <span className="fw-semibold">{workDaysCount} gün</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted">Günlük Süre</span><br />
                                                    <span className="fw-semibold">{hoursDifference.toFixed(1)} saat</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted">Toplam Haftalık Süre</span><br />
                                                    <span className="fw-semibold">{(hoursDifference * workDaysCount).toFixed(1)} saat</span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                </div>
                            </div>

                            {/* Submit Butonu */}
                            <div className="mt-8 d-flex justify-content-end">
                                <Link
                                    href={route('admin.shifts.index')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'Kaydediliyor...' : 'Vardiya Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Benzer Vardiyalar */}
                    {shifts && shifts.length > 0 && (
                        <div className="mt-6 bg-white rounded-3 shadow-sm-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-secondary">
                                <h5 className="fw-medium">Mevcut Vardiyalar</h5>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3">
                                    {shifts.slice(0, 5).map(shift => (
                                        <div key={shift.id} className="d-flex align-items-center justify-content-between border-b pb-3">
                                            <div>
                                                <span className="fw-medium">{shift.name}</span>
                                                <span className="fs-sm text-muted ml-2">
                                                    {shift.start_time} - {shift.end_time}
                                                </span>
                                            </div>
                                            <span className={`px-2 py-1 rounded fs-xs fw-medium ${
                                                shift.status === 'active' 
                                                    ? 'bg-success bg-opacity-10 text-success' 
                                                    : 'bg-danger bg-opacity-10 text-danger'
                                            }`}>
                                                {shift.status === 'active' ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}