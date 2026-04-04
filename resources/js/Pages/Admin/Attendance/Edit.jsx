import { useEffect } from 'react';
import { router, useForm, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/toast';

export default function Edit({ attendance, employees }) {
    const { props } = usePage();
    const flash = props.flash;

    useEffect(() => {
        if (flash?.success) {
            showSuccess(flash.success);
        }
        if (flash?.error) {
            showError(flash.error);
        }
    }, [flash]);

    const { data, setData, put, processing, errors, hasErrors } = useForm({
        employee_id: attendance?.employee_id || '',
        date: attendance?.date ? new Date(attendance.date).toISOString().split('T')[0] : '',
        time: attendance?.time ? (typeof attendance.time === 'string' ? attendance.time : new Date(attendance.time).toTimeString().slice(0, 8)) : '',
        type: attendance?.type?.value || attendance?.type || '',
        status: attendance?.status?.value || attendance?.status || '',
        notes: attendance?.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('admin.attendance.update', attendance.id), {
            preserveScroll: true,
            onSuccess: () => {
                showSuccess('Devam kaydı başarıyla güncellendi.');
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ');
                showError(errorMessage || 'Güncelleme sırasında bir hata oluştu.');
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Devam Kaydı Düzenle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: route('admin.attendance.index') },
                    { label: 'Devam Takibi', url: route('admin.attendance.index') },
                    { label: 'Düzenle', url: '#' },
                ],
                backUrl: route('admin.attendance.index'),
            }}
        >
            <Head title="Devam Kaydı Düzenle" />

            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-edit me-2"></i> Devam Kaydı Düzenle
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Çalışan</label>
                                        <select
                                            name="employee_id"
                                            className={`form-select ${errors.employee_id ? 'is-invalid' : ''}`}
                                            value={data.employee_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Çalışan Seçin</option>
                                            {(employees || []).map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.employee_id && <div className="invalid-feedback">{errors.employee_id}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Tür</label>
                                        <select
                                            name="type"
                                            className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                            value={data.type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Tür Seçin</option>
                                            <option value="clock_in">Giriş</option>
                                            <option value="clock_out">Çıkış</option>
                                            <option value="break_in">Mola Başı</option>
                                            <option value="break_out">Mola Sonu</option>
                                        </select>
                                        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Tarih</label>
                                        <input
                                            type="date"
                                            name="date"
                                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                            value={data.date}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Saat</label>
                                        <input
                                            type="time"
                                            name="time"
                                            className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                                            value={data.time}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Statü</label>
                                        <select
                                            name="status"
                                            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                            value={data.status}
                                            onChange={handleChange}
                                        >
                                            <option value="">Statü Seçin</option>
                                            <option value="present">Devrede</option>
                                            <option value="absent">Devre Dışı</option>
                                            <option value="late">Geç</option>
                                            <option value="early_departure">Erken Çıkış</option>
                                            <option value="on_leave">İzinli</option>
                                        </select>
                                        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label fw-medium">Notlar</label>
                                        <textarea
                                            name="notes"
                                            className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                                            rows="3"
                                            value={data.notes}
                                            onChange={handleChange}
                                            placeholder="Notlar..."
                                        ></textarea>
                                        {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                                    </div>
                                </div>

                                <div className="mt-4 d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Kaydediliyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-device-floppy me-2"></i> Kaydet
                                            </>
                                        )}
                                    </button>
                                    <Link
                                        href={route('admin.attendance.index')}
                                        className="btn btn-secondary"
                                    >
                                        İptal
                                    </Link>
                                </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
