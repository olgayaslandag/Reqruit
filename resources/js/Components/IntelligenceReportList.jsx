import { router } from '@inertiajs/react';
import { confirmDelete } from '@/Utils/sweetAlert';
import { showError } from '@/Utils/toast';

const IntelligenceReportList = ({ reports, submissionId }) => {
    // Define status badges and labels
    const getStatusConfig = (status) => {
        const config = {
            pending: { label: 'Bekliyor', color: 'warning', badge: 'badge bg-warning' },
            completed: { label: 'Tamamlandı', color: 'success', badge: 'badge bg-success' },
            none: { label: 'Yapılmadı', color: 'secondary', badge: 'badge bg-secondary' },
        };
        
        return config[status] || { label: status, color: 'dark', badge: 'badge bg-light' };
    };

    const handleDelete = (reportId, event) => {
        event.preventDefault();
        confirmDelete('Bu istihbarat raporunu silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/submissions/${submissionId}/intelligence-reports/${reportId}`, {
                onSuccess: () => {
                    // Mesaj zaten layout içinde flash olarak gösterilecek
                },
                onError: () => {
                    showError('İstihbarat raporu silinirken bir hata oluştu.');
                }
            });
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">İstihbarat Raporları</h5>
            </div>
            <div className="card-body p-0">
                {reports && reports.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3">Durum</th>
                                    <th className="px-4 py-3">Mesaj</th>
                                    <th className="px-4 py-3">Tarih</th>
                                    <th className="px-4 py-3">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(report => (
                                    <tr key={report.id}>
                                        <td className="px-4 py-3">
                                            <span className="d-flex align-items-center">
                                                <span className={getStatusConfig(report.status).badge}>
                                                    {getStatusConfig(report.status).label}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {report.notes || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(report.date_of_investigation || report.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={(e) => handleDelete(report.id, e)}
                                                className="btn btn-outline-danger btn-sm"
                                                title="Sil"
                                                aria-label="Sil"
                                            >
                                                <i className="ti ti-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-4 text-center text-muted">
                        Henüz istihbarat raporu bulunmamaktadır.
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntelligenceReportList;