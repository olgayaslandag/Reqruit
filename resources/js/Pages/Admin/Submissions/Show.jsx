import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import { showSuccess as showToastSuccess, showWarning as showToastWarning } from '@/Utils/toast';

const STATUSES = [
    { value: 'new', label: 'Yeni', color: 'blue' },
    { value: 'reviewing', label: 'İnceleniyor', color: 'yellow' },
    { value: 'interview', label: 'Mülakat', color: 'purple' },
    { value: 'offer', label: 'Teklif', color: 'green' },
    { value: 'hired', label: 'İşe Alındı', color: 'green' },
    { value: 'rejected', label: 'Reddedildi', color: 'red' },
];

const INVESTIGATIONS = [
    { value: 'pending', label: 'Bekliyor', color: 'yellow' },
    { value: 'completed', label: 'Tamamlandı', color: 'green' },
    { value: 'none', label: 'Yapılmadı', color: 'gray' },
];

export default function Show({ submission }) {
    const { data: commentData, setData: setCommentData, post } = useForm({
        comment: '',
        rating: '',
        is_private: true,
    });

    const [newStatus, setNewStatus] = useState(submission.status);
    const [newInvestigation, setNewInvestigation] = useState(submission.investigation || 'none');
    const [investigationNotes, setInvestigationNotes] = useState('');

    const handleStatusChange = () => {
        router.put(`/admin/submissions/${submission.id}/status`, {
            status: newStatus,
        }, {
            onSuccess: () => showToastSuccess('Durum başarıyla güncellendi.'),
        });
    };

    const handleInvestigationChange = () => {
        router.put(`/admin/submissions/${submission.id}/investigation`, {
            investigation: newInvestigation,
            notes: investigationNotes,
        }, {
            onSuccess: () => {
                showToastSuccess('İstihbarat durumu güncellendi.');
                setInvestigationNotes('');
                router.reload({ only: ['submission'] });
            },
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
            yellow: 'badge bg-warning',
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
                <div className="col-lg-8">
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">Başvuru Detayları</h5>
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

                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Başvuru Bilgileri</h5>
                        </div>
                        <div className="card-body">
                            {submission.details?.map((detail, index) => {
                                const field = submission.form?.fields?.find(f => f.name === detail.field_name);
                                const isFile = field?.type === 'file';

                                return (
                                    <div key={index} className="mb-3">
                                        <label className="form-label text-muted">
                                            {isFile && <i className="ti ti-file me-1"></i>}
                                            {detail.field_label || detail.field_name}
                                        </label>
                                        <div>
                                            {isFile && detail.field_value?.startsWith('http') ? (
                                                <a
                                                    href={detail.field_value}
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
                                                    Dosyayı Görüntüle
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

                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">İstihbarat</h5>
                        </div>
                        <div className="card-body">
                            {submission.investigation_notes && (
                                <div className="mb-3">
                                    <span className="text-muted">Mevcut Açıklama:</span>
                                    <p className="mb-2">{submission.investigation_notes}</p>
                                </div>
                            )}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <span className="text-muted">Mevcut Durum:</span>
                                {getInvestigationBadge(submission.investigation)}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Durum</label>
                                <select
                                    className="form-select"
                                    value={newInvestigation}
                                    onChange={(e) => setNewInvestigation(e.target.value)}
                                >
                                    {INVESTIGATIONS.map((inv) => (
                                        <option key={inv.value} value={inv.value}>
                                            {inv.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Açıklama</label>
                                <textarea
                                    className="form-control"
                                    value={investigationNotes}
                                    onChange={(e) => setInvestigationNotes(e.target.value)}
                                    placeholder="İstihbarat açıklaması..."
                                    rows={3}
                                />
                            </div>
                            <button
                                onClick={handleInvestigationChange}
                                className="btn btn-primary"
                            >
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Değerlendirmeler</h5>
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
            </div>
        </AuthenticatedLayout>
    );
}
