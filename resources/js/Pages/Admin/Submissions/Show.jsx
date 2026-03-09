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
            blue: 'bg-blue-100 text-blue-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            purple: 'bg-purple-100 text-purple-800',
            green: 'bg-green-100 text-green-800',
            red: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[statusInfo?.color] || 'bg-gray-100'}`}>
                {statusInfo?.label || status}
            </span>
        );
    };

    const getInvestigationBadge = (investigation) => {
        const info = INVESTIGATIONS.find(i => i.value === investigation);
        const colors = {
            yellow: 'bg-yellow-100 text-yellow-800',
            green: 'bg-green-100 text-green-800',
            gray: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[info?.color] || 'bg-gray-100'}`}>
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Link
                                            href="/admin/submissions"
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
                                            title="Geri"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </Link>
                                        <h1 className="text-2xl font-semibold">
                                            Başvuru: {submission.reference_no}
                                        </h1>
                                    </div>
                                    <p className="text-gray-600 mt-1 ml-11">
                                        {submission.form?.name} - {submission.form?.department?.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 ml-11">
                                        Gönderim Tarihi: {new Date(submission.created_at).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition"
                                        title="Sil"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm"
                                    >
                                        {STATUSES.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleStatusChange}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Durumu Güncelle
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Form Details */}
                        <div className="col-span-2">
                            <div className="bg-white rounded-lg shadow mb-6">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold mb-4">Başvuru Detayları</h2>
                                    <div className="space-y-4">
                                        {submission.details?.map((detail, index) => {
                                            const field = submission.form?.fields?.find(f => f.name === detail.field_name);
                                            const isFile = field?.type === 'file';
                                            
                                            return (
                                                <div key={index} className="border-b pb-4 last:border-b-0">
                                                    <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                                        {isFile && (
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                            </svg>
                                                        )}
                                                        {detail.field_label || detail.field_name}
                                                    </label>
                                                    <div className="text-gray-900">
                                                        {isFile && detail.field_value?.startsWith('http') ? (
                                                            <div className="flex items-center gap-3">
                                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                                </svg>
                                                                <a
                                                                    href={detail.field_value}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                                >
                                                                    Dosyayı Görüntüle / İndir
                                                                </a>
                                                            </div>
                                                        ) : detail.field_value?.startsWith('http') ? (
                                                            <a
                                                                href={detail.field_value}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-indigo-600 hover:text-indigo-900"
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
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold mb-4">İstihbarat</h2>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">Mevcut Durum:</span>
                                        {getInvestigationBadge(submission.investigation)}
                                    </div>
                                    <div className="mt-4 flex items-center gap-4">
                                        <select
                                            value={newInvestigation}
                                            onChange={(e) => setNewInvestigation(e.target.value)}
                                            className="border-gray-300 rounded-md shadow-sm flex-1"
                                        >
                                            {INVESTIGATIONS.map((inv) => (
                                                <option key={inv.value} value={inv.value}>
                                                    {inv.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleInvestigationChange}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Güncelle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold mb-4">Değerlendirmeler</h2>
                                    
                                    {/* Add Comment Form */}
                                    <form onSubmit={handleCommentSubmit} className="mb-6">
                                        <div className="mb-3">
                                            <textarea
                                                value={commentData.comment}
                                                onChange={(e) => setCommentData('comment', e.target.value)}
                                                placeholder="Yorumunuzu yazın..."
                                                className="w-full border-gray-300 rounded-md shadow-sm"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-sm text-gray-600 mb-1">Puan (1-5)</label>
                                            <select
                                                value={commentData.rating}
                                                onChange={(e) => setCommentData('rating', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm"
                                            >
                                                <option value="">Puan vermek için seçin</option>
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <option key={n} value={n}>{n} Yıldız</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3 flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={commentData.is_private}
                                                onChange={(e) => setCommentData('is_private', e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">Gizli not</label>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Yorum Ekle
                                        </button>
                                    </form>

                                    {/* Comments List */}
                                    <div className="space-y-4">
                                        {submission.comments?.map((comment) => (
                                            <div key={comment.id} className={`p-3 rounded ${comment.is_private ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-medium text-sm">
                                                        {comment.user?.name || 'Kullanıcı'}
                                                    </div>
                                                    {comment.rating && (
                                                        <div className="text-yellow-500">
                                                            {'★'.repeat(comment.rating)}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.comment}</p>
                                                <div className="text-xs text-gray-500 mt-2">
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
