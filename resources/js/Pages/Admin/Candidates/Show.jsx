import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess } from '@/Utils/toast';

const STATUSES = [
    { value: 'active', label: 'Aktif', color: 'green' },
    { value: 'engaged', label: 'İlgileniyor', color: 'blue' },
    { value: 'passive', label: 'Pasif', color: 'gray' },
    { value: 'closed', label: 'Kapandı', color: 'red' },
];

const INTERACTION_TYPES = [
    { value: 'meeting', label: 'Görüşme', color: 'blue' },
    { value: 'phone', label: 'Telefon', color: 'green' },
    { value: 'email', label: 'E-posta', color: 'purple' },
    { value: 'offer', label: 'Teklif', color: 'yellow' },
    { value: 'negotiation', label: 'Pazarlık', color: 'orange' },
    { value: 'other', label: 'Diğer', color: 'gray' },
];

export default function Show({ candidate, interactions = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        interaction_type: 'meeting',
        interaction_date: '',
        description: '',
        response: '',
    });

    const getStatusBadge = (status) => {
        const statusInfo = STATUSES.find(s => s.value === status);
        const colors = {
            green: 'badge bg-success bg-opacity-10 text-success',
            blue: 'badge bg-info bg-opacity-10 text-info',
            gray: 'badge bg-secondary bg-opacity-10 text-dark',
            red: 'badge bg-danger bg-opacity-10 text-danger',
        };
        return (
            <span className={`badge ${colors[statusInfo?.color] || 'bg-light'}`}>
                {statusInfo?.label || status}
            </span>
        );
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/candidates/${candidate.id}/interactions`, {
            preserveScroll: true,
            only: ['candidate', 'interactions'],
            onSuccess: () => {
                showSuccess('Takip kaydı başarıyla eklendi.');
                reset();
            },
        });
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('tr-TR');
    };

    const formatDateTime = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('tr-TR');
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: candidate.name,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Kalifiye Elemanlar', url: route('admin.candidates.index') },
                    { label: candidate.name, url: '#' },
                ],
            }}
        >
            <Head title={candidate.name} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Kalifiye Eleman Detayı</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <h4 className="mb-0 me-2">{candidate.name}</h4>
                                {getStatusBadge(candidate.status)}
                            </div>
                            <p className="text-muted mb-3">
                                {candidate.current_position || '-'}
                                {candidate.current_employer && ` • ${candidate.current_employer}`}
                            </p>
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td width="40%" className="text-muted">E-posta:</td>
                                        <td>{candidate.email || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">Telefon:</td>
                                        <td>{candidate.phone || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">Kaynak:</td>
                                        <td>{candidate.source || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">Kayıt Tarihi:</td>
                                        <td>{formatDate(candidate.created_at)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {candidate.notes && (
                                <div className="mt-3 p-3 bg-light rounded">
                                    <small className="text-muted d-block mb-1">Notlar</small>
                                    <p className="mb-0">{candidate.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Yeni Takip Ekle</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Takip Türü</label>
                                    <select
                                        className={`form-select ${errors.interaction_type ? 'is-invalid' : ''}`}
                                        value={data.interaction_type}
                                        onChange={(e) => setData('interaction_type', e.target.value)}
                                        disabled={processing}
                                    >
                                        {INTERACTION_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.interaction_type && <div className="invalid-feedback">{errors.interaction_type}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Takip Tarihi</label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.interaction_date ? 'is-invalid' : ''}`}
                                        value={data.interaction_date}
                                        onChange={(e) => setData('interaction_date', e.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.interaction_date && <div className="invalid-feedback">{errors.interaction_date}</div>}
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        placeholder="Görüşme detaylarını yazın..."
                                        disabled={processing}
                                    />
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Yanıt</label>
                                    <textarea
                                        className={`form-control ${errors.response ? 'is-invalid' : ''}`}
                                        value={data.response}
                                        onChange={(e) => setData('response', e.target.value)}
                                        rows={3}
                                        placeholder="Adayın yanıtı..."
                                        disabled={processing}
                                    />
                                    {errors.response && <div className="invalid-feedback">{errors.response}</div>}
                                </div>

                                <div className="col-md-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={processing}
                                    >
                                        {processing ? 'Gönderiliyor...' : 'Takip Ekle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Takip Geçmişi</h5>
                        </div>
                        <div className="card-body">
                            {interactions.length > 0 ? (
                                <div className="position-relative">
                                    {interactions.map((interaction) => (
                                        <div key={interaction.id} className="d-flex mb-4">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <i className="ti ti-message-circle text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <div>
                                                        {getInteractionBadge(interaction.interaction_type)}
                                                        <span className="text-muted small ms-2">
                                                            {formatDate(interaction.interaction_date)}
                                                        </span>
                                                    </div>
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
                                                    {interaction.creator?.name || 'Kullanıcı'} • {formatDateTime(interaction.created_at)}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="ti ti-message-circle fs-1 text-muted mb-2"></i>
                                    <p className="text-muted">Henüz takip kaydı yok.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}