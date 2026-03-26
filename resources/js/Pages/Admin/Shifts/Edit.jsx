import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Edit({ shift, departments }) {
    const { props } = usePage();
    const flash = props.flash;

    const [formData, setFormData] = useState({
        name: shift.name || '',
        description: shift.description || '',
        department_id: shift.department_id || '',
        start_time: shift.start_time || '09:00',
        end_time: shift.end_time || '18:00',
        break_duration: shift.break_duration || '01:00',
        days: shift.days || {
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: false,
            sun: false
        },
        status: shift.status || 'active'
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
        
        router.put(route('admin.shifts.update', shift.id), formData, {
            onSuccess: () => {
                showSuccess('Vardiya başarıyla güncellendi.');
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Vardiya Güncelle
                    </h2>
                    <Link
                        href={route('admin.shifts.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Geri
                    </Link>
                </div>
            }
        >
            <Head title={`Vardiya Düzenle: ${shift.name}`} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Vardiya Bilgileri</h3>
                            <p className="mt-1 text-sm text-gray-600">Vardiya bilgilerini buradan güncelleyebilirsiniz</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                {/* Temel Bilgiler */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vardiya Adı *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                        }`}
                                        placeholder="Sabah Vardiyası, Part-Time vs."
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                                        placeholder="Vardiya hakkında detaylı bilgi..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Departman
                                        </label>
                                        <select
                                            value={formData.department_id}
                                            onChange={(e) => handleChange('department_id', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleChange('status', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Pasif</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Saat Tanımları */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Başlangıç Saati *
                                        </label>
                                        <select
                                            value={formData.start_time}
                                            onChange={(e) => handleChange('start_time', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.start_time ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                        >
                                            {timeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bitiş Saati *
                                        </label>
                                        <select
                                            value={formData.end_time}
                                            onChange={(e) => handleChange('end_time', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.end_time ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                        >
                                            {timeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mola Süresi
                                        </label>
                                        <select
                                            value={formData.break_duration}
                                            onChange={(e) => handleChange('break_duration', e.target.value)}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.break_duration ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                            }`}
                                        >
                                            <option value="00:00">Yok</option>
                                            {['00:15', '00:30', '00:45', '01:00', '01:15', '01:30'].map(time => (
                                                <option key={time} value={time}>{time} saat</option>
                                            ))}
                                        </select>
                                        {errors.break_duration && <p className="mt-1 text-sm text-red-600">{errors.break_duration}</p>}
                                    </div>
                                </div>

                                {/* Çalışma Günleri */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Çalışma Günleri
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { key: 'mon', label: 'Pazartesi' },
                                            { key: 'tue', label: 'Salı' },
                                            { key: 'wed', label: 'Çarşamba' },
                                            { key: 'thu', label: 'Perşembe' },
                                            { key: 'fri', label: 'Cuma' },
                                            { key: 'sat', label: 'Cumartesi' },
                                            { key: 'sun', label: 'Pazar' }
                                        ].map(day => (
                                            <div key={day.key} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={day.key}
                                                    checked={formData.days[day.key]}
                                                    onChange={() => handleDayToggle(day.key)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={day.key} className="ml-2 block text-sm text-gray-700">
                                                    {day.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hesaplanan Bilgiler */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-800 mb-2">Vardiya Bilgileri</h4>
                                    
                                    {/* Hesaplama kısmı */}
                                    {(() => {
                                        const workDaysCount = Object.values(formData.days).filter(day => day).length;
                                        const startTime = formData.start_time.split(':');
                                        const endTime = formData.end_time.split(':');
                                        
                                        let totalHours = 0;
                                        let totalMinutes = 0;
                                        
                                        // Zaman farkı hesaplaması
                                        if(endTime[0] < startTime[0] || (endTime[0] === startTime[0] && endTime[1] < startTime[1])) {
                                            // 24 saat üzerinden hesaplama (gece vardiyası)
                                            totalHours = (parseInt(endTime[0])*24 + 24) - parseInt(startTime[0]);
                                        } else {
                                            // Normal saat farkı
                                            totalHours = Math.abs(parseInt(endTime[0]) - parseInt(startTime[0]));
                                        }
                                        
                                        totalMinutes = parseInt(endTime[1]) - parseInt(startTime[1]);
                                        if(totalMinutes < 0) {
                                            totalHours -= 1;
                                            totalMinutes += 60;
                                        }
                                        
                                        // Mola süresini çıkar
                                        const breakParts = formData.break_duration.split(':');
                                        const breakHours = parseInt(breakParts[0]);
                                        const breakMinutes = parseInt(breakParts[1]);
                                        totalHours -= breakHours;
                                        totalMinutes -= breakMinutes;
                                        
                                        if(totalMinutes < 0) {
                                            totalHours -= 1;
                                            totalMinutes += 60;
                                        }
                                        
                                        const dailyDuration = totalHours + (totalMinutes / 60);
                                        const weeklyDuration = dailyDuration * workDaysCount;
                                        
                                        return (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Çalışılan Gün Sayısı</span><br />
                                                    <span className="font-semibold">{workDaysCount} gün</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Günlük Net Süre</span><br />
                                                    <span className="font-semibold">{dailyDuration.toFixed(1)} saat</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Haftalık Net Süre</span><br />
                                                    <span className="font-semibold">{weeklyDuration.toFixed(1)} saat</span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                </div>
                            </div>

                            {/* Submit Butonu */}
                            <div className="mt-8 flex justify-end gap-3">
                                <Link
                                    href={route('admin.shifts.index')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    İptal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? 'Güncelleniyor...' : 'Vardiya Güncelle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}