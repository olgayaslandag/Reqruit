import { useForm } from '@inertiajs/react';
import { showSuccess, showWarning } from '@/Utils/toast';

const IntelligenceReportForm = ({ submissionId, initialData = {}, onReportAdded = () => {} }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        status: initialData.status || 'pending',
        notes: initialData.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!data.notes.trim()) {
            showWarning('Lütfen mesaj giriniz.');
            return;
        }

        post(`/admin/submissions/${submissionId}/intelligence-reports`, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccess('İstihbarat raporu başarıyla eklendi.');
                reset();
                if (onReportAdded && typeof onReportAdded === 'function') {
                    onReportAdded();
                }
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ');
                showWarning(errorMessage || 'Rapor eklenirken bir hata oluştu.');
            },
            only: ['submission', 'intelligenceReports'] // Refresh props to show new report
        });
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">Yeni İstihbarat Raporu Ekle</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-12">
                        <label className="form-label">Durum <span className="text-danger">*</span></label>
                        <select
                            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            disabled={processing}
                        >
                            <option value="pending">Bekliyor</option>
                            <option value="completed">Tamamlandı</option>
                            <option value="none">Yapılmadı</option>
                        </select>
                        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                    </div>

                    <div className="col-md-12">
                        <label className="form-label">Mesaj <span className="text-danger">*</span></label>
                        <textarea
                            className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Mesajınızı giriniz..."
                            rows={4}
                            disabled={processing}
                        />
                        {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                    </div>

                    <div className="col-md-12">
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={processing}
                        >
                            {processing ? 'Gönderiliyor...' : 'Rapor Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IntelligenceReportForm;
