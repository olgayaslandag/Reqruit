import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import { showSuccess as showToastSuccess, showWarning as showToastWarning, showError as showToastError } from '@/Utils/toast';
import IntelligenceReportForm from '@/Components/IntelligenceReportForm';
import IntelligenceReportList from '@/Components/IntelligenceReportList';

const STATUSES = [
    { value: 'new', label: 'Yeni', color: 'blue' },
    { value: 'reviewing', label: 'İnceleniyor', color: 'yellow' },
    { value: 'interview', label: 'Mülakat', color: 'purple' },
    { value: 'offer', label: 'Teklif', color: 'green' },
    { value: 'hired', label: 'İşe Alındı', color: 'green' },
    { value: 'rejected', label: 'Reddedildi', color: 'red' },
];

// Investigation statuses for backward compatibility
const INVESTIGATIONS = [
    { value: 'pending', label: 'Bekliyor', color: 'yellow' },
    { value: 'completed', label: 'Tamamlandı', color: 'green' },
    { value: 'none', label: 'Yapılmadı', color: 'gray' },
];

// Investigation types for new multi-report system
const INVESTIGATION_TYPES = [
    { value: 'background', label: 'Arka Plan' },
    { value: 'criminal', label: 'Ceza Sicili' },
    { value: 'financial', label: 'Finansal' },
    { value: 'employment', label: 'İstihdam Geçmişi' },
    { value: 'education', label: 'Eğitim Geçmişi' },
    { value: 'others', label: 'Diğerleri' },
];

// Priority levels
const PRIORITY_LEVELS = [
    { value: 'low', label: 'Düşük' },
    { value: 'medium', label: 'Orta' },
    { value: 'high', label: 'Yüksek' },
    { value: 'critical', label: 'Kritik' },
];

// Interaction types for contact timeline
const INTERACTION_TYPES = [
    { value: 'meeting', label: 'Görüşme', color: 'blue' },
    { value: 'phone', label: 'Telefon', color: 'green' },
    { value: 'email', label: 'E-posta', color: 'purple' },
    { value: 'offer', label: 'Teklif', color: 'yellow' },
    { value: 'negotiation', label: 'Pazarlık', color: 'orange' },
    { value: 'other', label: 'Diğer', color: 'gray' },
];

export default function Show({ submission, intelligenceReports = [], investigators = [], interactions = [], aiEvaluations = [] }) {
    const { data: commentData, setData: setCommentData, post } = useForm({
        comment: '',
        rating: '',
        is_private: true,
    });

    const { data: interactionData, setData: setInteractionData, post: postInteraction, processing: interactionProcessing, errors: interactionErrors } = useForm({
        interaction_type: 'meeting',
        interaction_date: '',
        description: '',
        response: '',
    });

    const [newStatus, setNewStatus] = useState(submission.status);
    const [isEvaluating, setIsEvaluating] = useState(false);

    const handleStatusChange = () => {
        router.put(`/admin/submissions/${submission.id}/status`, {
            status: newStatus,
        }, {
            onSuccess: () => showToastSuccess('Durum başarıyla güncellendi.'),
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        if (!commentData.rating) {
            showToastWarning('Lütfen puan seçiniz.');
            return;
        }

        post(`/admin/submissions/${submission.id}/comments`, {
            onSuccess: () => {
                setCommentData({ comment: '', rating: '', is_private: true });
                showToastSuccess('Yorum başarıyla eklendi.');
            },
        });
    };

    const handleInteractionSubmit = (e) => {
        e.preventDefault();

        postInteraction(`/admin/submissions/${submission.id}/interactions`, {
            preserveScroll: true,
            only: ['submission', 'intelligenceReports', 'interactions', 'aiEvaluations'],
            onSuccess: () => {
                setInteractionData({ interaction_type: 'meeting', interaction_date: '', description: '', response: '' });
                showToastSuccess('Takip kaydı başarıyla eklendi.');
            },
        });
    };

    const handleAiEvaluate = () => {
        setIsEvaluating(true);
        router.post(`/admin/submissions/${submission.id}/ai-evaluate`, {}, {
            preserveScroll: true,
            only: ['submission', 'intelligenceReports', 'interactions', 'aiEvaluations'],
            onFinish: () => setIsEvaluating(false),
            onError: () => {
                showToastError('AI değerlendirmesi sırasında bir hata oluştu.');
            },
        });
    };

    const getInteractionBadge = (type) => {
        const typeInfo = INTERACTION_TYPES.find(t => t.value === type);
        const colors = {
            blue: 'badge bg-info bg-opacity-10 text-info',
            green: 'badge bg-success bg-opacity-10 text-success',
            purple: 'badge bg-purple bg-opacity-10 text-purple',
            yellow: 'badge bg-warning bg-opacity-10 text-warning',
            orange: 'badge bg-warning bg-opacity-10 text-warning',
            gray: 'badge bg-secondary bg-opacity-10 text-dark',
        };
        return (
            <span className={`badge ${colors[typeInfo?.color] || 'bg-light'}`}>
                {typeInfo?.label || type}
            </span>
        );
    };

    const latestCompletedEvaluation = (aiEvaluations || []).find(e => e.status === 'completed');
    const latestFailedEvaluation = (aiEvaluations || []).find(e => e.status === 'failed');

    const getStatusBadge = (status) => {
        const statusInfo = STATUSES.find(s => s.value === status);
        const colors = {
            blue: 'badge bg-info',
            yellow: 'badge bg-warning',
            purple: 'badge bg-purple',
            green: 'badge bg-success',
            red: 'badge bg-danger',
        };
        return (
            <span className={`badge ${colors[statusInfo?.color] || 'bg-light'}`}>
                {statusInfo?.label || status}
            </span>
        );
    };

    const getInvestigationBadge = (investigation) => {
        const info = INVESTIGATIONS.find(i => i.value === investigation);
        const colors = {
            yellow: 'badge bg_warning',
            green: 'badge bg-success',
            gray: 'badge bg-secondary',
        };
        return (
            <span className={`badge ${colors[info?.color] || 'bg-light'}`}>
                {info?.label || '-'}
            </span>
        );
    };

    const handleDelete = () => {
        confirmDelete('Bu başvuruyu silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/submissions/${submission.id}`, {
                onSuccess: () => showSuccess('Başvuru başarıyla silindi.'),
            });
        });
    };

    // Calculate investigation status for backward compatibility
    const getDisplayInvestigationStatus = () => {
        if (intelligenceReports && intelligenceReports.length > 0) {
            // Get the status from the latest report
            const newestReport = [...intelligenceReports].sort((a, b) => new Date(b.date_of_investigation) - new Date(a.date_of_investigation))[0];
            return newestReport.status;
        }
        return submission.investigation;
    };

    const calculateOverallStatus = () => {
        if (!intelligenceReports || intelligenceReports.length === 0) {
            return submission.investigation || 'none';
        }

        const completedCount = intelligenceReports.filter(report => report.status === 'completed').length;
        const pendingCount = intelligenceReports.filter(report => report.status === 'pending').length;

        // If all reports are completed, set to completed
        if (completedCount === intelligenceReports.length) {
            return 'completed';
        }
        // If some reports are pending, set to pending
        else if (pendingCount > 0) {
            return 'pending';
        }
        // If none are completed or pending, return 'none'
        else {
            return 'none';
        }
    };

    const displayInvestigationStatus = getDisplayInvestigationStatus();
    const overallInvestigationStatus = calculateOverallStatus();

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: `Başvuru: ${submission.reference_no}`,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Başvurular', url: route('admin.submissions.index') },
                    { label: submission.reference_no, url: '#' },
                ],
            }}
        >
            <Head title={`Başvuru: ${submission.reference_no}`} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Başvuru Detayı</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Durum</label>
                                <div className="d-flex gap-2">
                                    <select
                                        className="form-select"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        {STATUSES.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleStatusChange}
                                        className="btn btn-primary"
                                    >
                                        Güncelle
                                    </button>
                                </div>
                            </div>
                            <small className="text-muted">
                                Gönderim Tarihi: {new Date(submission.created_at).toLocaleString('tr-TR')}
                            </small>
                        </div>
                    </div>

                    <div className="card mb-4 border-primary">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">
                                    <i className="ti ti-robot me-1 text-primary"></i>
                                    AI Değerlendirme
                                </h5>
                                <small className="text-muted">OpenAI ile otomatik değerlendirme</small>
                            </div>
                        </div>
                        <div className="card-body">
                            {latestCompletedEvaluation ? (
                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="text-warning fs-4 me-2">
                                            {'★'.repeat(latestCompletedEvaluation.rating)}
                                        </span>
                                        <span className="fw-bold">{latestCompletedEvaluation.rating}/5</span>
                                    </div>
                                    {latestCompletedEvaluation.review && (
                                        <p className="mb-2">{latestCompletedEvaluation.review}</p>
                                    )}
                                    <small className="text-muted d-block">
                                        {latestCompletedEvaluation.model || latestCompletedEvaluation.provider}
                                    </small>
                                    <small className="text-muted d-block">
                                        {new Date(latestCompletedEvaluation.created_at).toLocaleString('tr-TR')}
                                    </small>
                                </div>
                            ) : latestFailedEvaluation ? (
                                <div className="alert alert-danger mb-0">
                                    <i className="ti ti-alert-triangle me-1"></i>
                                    {latestFailedEvaluation.error || 'AI değerlendirmesi başarısız oldu.'}
                                </div>
                            ) : (
                                <p className="text-muted mb-3">Henüz AI değerlendirmesi yapılmadı.</p>
                            )}

                            <button
                                onClick={handleAiEvaluate}
                                disabled={isEvaluating}
                                className="btn btn-primary w-100 mt-3"
                            >
                                {isEvaluating ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Değerlendiriliyor...
                                    </>
                                ) : (
                                    <>
                                        <i className="ti ti-robot me-1"></i>
                                        AI Değerlendir
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">Değerlendirmeler</h5>
                                <small className="text-muted">
                                    {submission.form?.name} - {submission.form?.department?.title}
                                </small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-outline-danger btn-sm"
                                    title="Sil"
                                >
                                    <i className="ti ti-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCommentSubmit} className="mb-4">
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        value={commentData.comment}
                                        onChange={(e) => setCommentData('comment', e.target.value)}
                                        placeholder="Yorumunuzu yazın..."
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Puan (1-5)</label>
                                    <select
                                        className="form-select"
                                        value={commentData.rating}
                                        onChange={(e) => setCommentData('rating', e.target.value)}
                                    >
                                        <option value="">Puan vermek için seçin</option>
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <option key={n} value={n}>{n} Yıldız</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        checked={commentData.is_private}
                                        onChange={(e) => setCommentData('is_private', e.target.checked)}
                                        className="form-check-input"
                                        id="is_private"
                                    />
                                    <label className="form-check-label" htmlFor="is_private">
                                        Gizli not
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Yorum Ekle
                                </button>
                            </form>

                            <div className="d-flex flex-column gap-3">
                                {(submission.comments?.length > 0) ? (
                                    [...submission.comments]
                                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                        .map((comment) => (
                                            <div key={comment.id} className={`p-3 border rounded ${comment.is_private ? 'bg-warning-subtle' : 'bg-light'}`}>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="fw-medium">
                                                        {comment.user?.name || 'Kullanıcı'}
                                                    </div>
                                                    {comment.rating && (
                                                        <div className="text-warning">
                                                            {'★'.repeat(comment.rating)}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="mb-1">{comment.comment}</p>
                                                <small className="text-muted">
                                                    {new Date(comment.created_at).toLocaleString('tr-TR')}
                                                    {comment.is_private && ' • Gizli'}
                                                </small>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-muted text-center">Henüz değerlendirme yok.</p>
                                )}
                            </div>
                        </div>
                    </div>


                </div>

                <div className="col-lg-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Başvuru Bilgileri</h5>
                        </div>
                        <div className="card-body">
                            {submission.details?.map(detail => {
                                const field = submission.form?.fields?.find(f => f.name === detail.field_name);
                                const isFile = field?.type === 'file' && detail.file_url; // Only files with accessible URLs

                                return (
                                    <div key={`${detail.field_name}-${submission.id}`} className="mb-3">
                                        <label className="form-label text-muted">
                                            {isFile && <i className="ti ti-file me-1"></i>}
                                            {detail.field_label || detail.field_name}
                                        </label>
                                        <div>
                                            {isFile ? (
                                                <a
                                                    href={detail.file_url} // Use the authorized file URL from backend
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary"
                                                >
                                                    <i className="ti ti-download me-1"></i>
                                                    Dosyayı Görüntüle / İndir
                                                </a>
                                            ) : detail.field_value?.startsWith('http') ? (
                                                <a
                                                    href={detail.field_value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary"
                                                >
                                                    <i className="ti ti-external-link me-1"></i>
                                                    Bağlantıyı Aç
                                                </a>
                                            ) : (
                                                <span>{detail.field_value}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Takip Geçmişi</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleInteractionSubmit} className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">Takip Türü</label>
                                    <select
                                        className={`form-select ${interactionErrors.interaction_type ? 'is-invalid' : ''}`}
                                        value={interactionData.interaction_type}
                                        onChange={(e) => setInteractionData('interaction_type', e.target.value)}
                                        disabled={interactionProcessing}
                                    >
                                        {INTERACTION_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {interactionErrors.interaction_type && <div className="invalid-feedback">{interactionErrors.interaction_type}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Takip Tarihi</label>
                                    <input
                                        type="date"
                                        className={`form-control ${interactionErrors.interaction_date ? 'is-invalid' : ''}`}
                                        value={interactionData.interaction_date}
                                        onChange={(e) => setInteractionData('interaction_date', e.target.value)}
                                        disabled={interactionProcessing}
                                    />
                                    {interactionErrors.interaction_date && <div className="invalid-feedback">{interactionErrors.interaction_date}</div>}
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        className={`form-control ${interactionErrors.description ? 'is-invalid' : ''}`}
                                        value={interactionData.description}
                                        onChange={(e) => setInteractionData('description', e.target.value)}
                                        rows={3}
                                        placeholder="Görüşme detaylarını yazın..."
                                        disabled={interactionProcessing}
                                    />
                                    {interactionErrors.description && <div className="invalid-feedback">{interactionErrors.description}</div>}
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Yanıt</label>
                                    <textarea
                                        className={`form-control ${interactionErrors.response ? 'is-invalid' : ''}`}
                                        value={interactionData.response}
                                        onChange={(e) => setInteractionData('response', e.target.value)}
                                        rows={3}
                                        placeholder="Adayın yanıtı..."
                                        disabled={interactionProcessing}
                                    />
                                    {interactionErrors.response && <div className="invalid-feedback">{interactionErrors.response}</div>}
                                </div>

                                <div className="col-md-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={interactionProcessing}
                                    >
                                        {interactionProcessing ? 'Gönderiliyor...' : 'Takip Ekle'}
                                    </button>
                                </div>
                            </form>

                            {interactions.length > 0 ? (
                                <div>
                                    {interactions.map((interaction) => (
                                        <div key={interaction.id} className="d-flex mb-4">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <i className="ti ti-message-circle text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="mb-1">
                                                    {getInteractionBadge(interaction.interaction_type)}
                                                    <span className="text-muted small ms-2">
                                                        {new Date(interaction.interaction_date || interaction.created_at).toLocaleDateString('tr-TR')}
                                                    </span>
                                                </div>
                                                {interaction.description && (
                                                    <p className="mb-1">{interaction.description}</p>
                                                )}
                                                {interaction.response && (
                                                    <div className="p-2 bg-light rounded mb-1">
                                                        <small className="text-muted d-block">Yanıt:</small>
                                                        <span>{interaction.response}</span>
                                                    </div>
                                                )}
                                                <small className="text-muted">
                                                    {interaction.creator?.name || 'Kullanıcı'} • {new Date(interaction.created_at).toLocaleString('tr-TR')}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="ti ti-message-circle fs-1 text-muted mb-2"></i>
                                    <p className="text-muted">Henüz takip kaydı yok.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Intelligence Reports Section */}
                    <IntelligenceReportList reports={intelligenceReports} submissionId={submission.id} />
                    <IntelligenceReportForm
                        submissionId={submission.id}
                        initialData={{
                            status: intelligenceReports.length > 0 ? intelligenceReports.reduce((prev, current) => new Date(prev.date_of_investigation) > new Date(current.date_of_investigation) ? prev : current).status : 'pending',
                            investigation_type: 'background',
                            priority_level: 'medium'
                        }}
                        onReportAdded={(newReport) => {
                            // Reload after adding new report for immediate visualization
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
