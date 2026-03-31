import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

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

    const handleStatusChange = () => {
        router.put(`/admin/submissions/${submission.id}/status`, {
            status: newStatus,
        });
    };

    const handleInvestigationChange = () => {
        router.put(`/admin/submissions/${submission.id}/investigation`, {
            investigation: newInvestigation,
        }, {
            onSuccess: () => showSuccess('İstihbarat durumu güncellendi.'),
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        post(`/admin/submissions/${submission.id}/comments`, {
            onSuccess: () => {
                setCommentData({ comment: '', rating: '', is_private: true });
            },
        });
    };

    const getStatusBadge = (status) => {
        const statusInfo = STATUSES.find(s => s.value === status);
        const colors = {
            blue: 'bg-primary bg-opacity-10 text-info',
            yellow: 'bg-warning bg-opacity-10 text-warning',
            purple: 'bg-purple-100 text-purple-800',
            green: 'bg-success bg-opacity-10 text-success',
            red: 'bg-danger bg-opacity-10 text-danger',
        };
        return (
            <span className={`px-2 py-1 rounded-pill fs-xs fw-medium ${colors[statusInfo?.color] || 'bg-light'}`}>
                {statusInfo?.label || status}
            </span>
        );
    };

    const getInvestigationBadge = (investigation) => {
        const info = INVESTIGATIONS.find(i => i.value === investigation);
        const colors = {
            yellow: 'bg-warning bg-opacity-10 text-warning',
            green: 'bg-success bg-opacity-10 text-success',
            gray: 'bg-light text-dark',
        };
        return (
            <span className={`px-2 py-1 rounded-pill fs-xs fw-medium ${colors[info?.color] || 'bg-light'}`}>
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
        <AuthenticatedLayout>
            <Head title={`Başvuru: ${submission.reference_no}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-3 shadow-sm mb-5">
                        <div className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <Link
                                            href="/admin/submissions"
                                            className="p-2 text-muted hover:text-dark hover:bg-light rounded"
                                            title="Geri"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </Link>
                                        <h1 className="fs-2 fw-semibold">
                                            Başvuru: {submission.reference_no}
                                        </h1>
                                    </div>
                                    <p className="text-muted mt-1 ml-11">
                                        {submission.form?.name} - {submission.form?.department?.title}
                                    </p>
                                    <p className="fs-sm text-muted mt-1 ml-11">
                                        Gönderim Tarihi: {new Date(submission.created_at).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-danger hover:text-danger hover:bg-red-50 rounded"
                                        title="Sil"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <select
                                        className="form-control border-secondary rounded-3 shadow-sm-sm"
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
                                        className="btn btn-primary btn-sm"
                                    >
                                        Durumu Güncelle
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-grid d-grid-cols-3 gap-4">
                        {/* Form Details */}
                        <div className="col-span-2">
                            <div className="bg-white rounded-3 shadow-sm mb-5">
                                <div className="p-4">
                                    <h5 className="fw-semibold mb-3">Başvuru Detayları</h5>
                                    <div className="space-y-4">
                                        {submission.details?.map((detail, index) => {
                                            const field = submission.form?.fields?.find(f => f.name === detail.field_name);
                                            const isFile = field?.type === 'file';
                                            
                                            return (
                                                <div key={index} className="border-b pb-4 last:border-b-0">
                                                    <label className="d-block fs-sm fw-medium text-muted mb-1 d-flex align-items-center gap-2">
                                                        {isFile && (
                                                            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                            </svg>
                                                        )}
                                                        {detail.field_label || detail.field_name}
                                                    </label>
                                                    <div className="text-dark">
                                                        {isFile && detail.field_value?.startsWith('http') ? (
                                                            <div className="d-flex align-items-center gap-2">
                                                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                                </svg>
                                                                <a
                                                                    href={detail.field_value}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary hover:text-indigo-900 fw-medium"
                                                                >
                                                                    Dosyayı Görüntüle / İndir
                                                                </a>
                                                            </div>
                                                        ) : detail.field_value?.startsWith('http') ? (
                                                            <a
                                                                href={detail.field_value}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:text-indigo-900"
                                                            >
                                                                Dosyayı Görüntüle
                                                            </a>
                                                        ) : (
                                                            detail.field_value
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* İstihbarat */}
                            <div className="bg-white rounded-3 shadow-sm">
                                <div className="p-4">
                                    <h5 className="fw-semibold mb-3">İstihbarat</h5>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="fs-sm text-muted">Mevcut Durum:</span>
                                        {getInvestigationBadge(submission.investigation)}
                                    </div>
                                    <div className="mt-4 d-flex align-items-center gap-3">
                                        <select
                                            className="form-control border-secondary rounded-3 shadow-sm-sm d-flex-1"
                                            value={newInvestigation}
                                            onChange={(e) => setNewInvestigation(e.target.value)}
                                        >
                                            {INVESTIGATIONS.map((inv) => (
                                                <option key={inv.value} value={inv.value}>
                                                    {inv.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleInvestigationChange}
                                        className="btn btn-primary btn-sm"
                                        >
                                            Güncelle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="col-span-1">
                            <div className="bg-white rounded-3 shadow-sm">
                                <div className="p-4">
                                    <h5 className="fw-semibold mb-3">Değerlendirmeler</h5>
                                    
                                    {/* Add Comment Form */}
                                    <form onSubmit={handleCommentSubmit} className="mb-5">
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control w-100 border-secondary rounded-3 shadow-sm-sm"
                                                value={commentData.comment}
                                                onChange={(e) => setCommentData('comment', e.target.value)}
                                                placeholder="Yorumunuzu yazın..."
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="d-block fs-sm text-muted mb-1">Puan (1-5)</label>
                                            <select
                                                className="form-control w-100 border-secondary rounded-3 shadow-sm-sm"
                                                value={commentData.rating}
                                                onChange={(e) => setCommentData('rating', e.target.value)}
                                            >
                                                <option value="">Puan vermek için seçin</option>
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <option key={n} value={n}>{n} Yıldız</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                checked={commentData.is_private}
                                                onChange={(e) => setCommentData('is_private', e.target.checked)}
                                                className="h-4 w-4 text-primary border-secondary rounded"
                                            />
                                            <label className="ml-2 fs-sm text-dark">Gizli not</label>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm w-100"
                                        >
                                            Yorum Ekle
                                        </button>
                                    </form>

                                    {/* Comments List */}
                                    <div className="space-y-4">
                                        {submission.comments?.map((comment) => (
                                            <div key={comment.id} className={`p-3 rounded ${comment.is_private ? 'bg-yellow-50' : 'table-light'}`}>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="fw-medium fs-sm">
                                                        {comment.user?.name || 'Kullanıcı'}
                                                    </div>
                                                    {comment.rating && (
                                                        <div className="text-warning">
                                                            {'★'.repeat(comment.rating)}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="fs-sm text-dark">{comment.comment}</p>
                                                <div className="fs-xs text-muted mt-2">
                                                    {new Date(comment.created_at).toLocaleString('tr-TR')}
                                                    {comment.is_private && ' • Gizli'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
