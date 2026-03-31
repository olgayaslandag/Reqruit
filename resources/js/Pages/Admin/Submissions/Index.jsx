import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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

export default function Index({ submissions, forms, departments, filters }) {
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterInvestigation, setFilterInvestigation] = useState(filters.investigation || '');
    const [filterForm, setFilterForm] = useState(filters.form_id || '');
    const [filterDepartment, setFilterDepartment] = useState(filters.department_id || '');

    const applyFilters = () => {
        const params = {};
        if (filterStatus) params.status = filterStatus;
        if (filterInvestigation) params.investigation = filterInvestigation;
        if (filterForm) params.form_id = filterForm;
        if (filterDepartment) params.department_id = filterDepartment;

        router.get('/admin/submissions', params);
    };

    const getStatusBadge = (status) => {
        const statusInfo = STATUSES.find(s => s.value === status);
        const colors = {
            blue: 'badge bg-info bg-opacity-10 text-info',
            yellow: 'badge bg-warning bg-opacity-10 text-warning',
            purple: 'badge bg-purple bg-opacity-10 text-purple',
            green: 'badge bg-success bg-opacity-10 text-success',
            red: 'badge bg-danger bg-opacity-10 text-danger',
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
            yellow: 'badge bg-warning bg-opacity-10 text-warning',
            green: 'badge bg-success bg-opacity-10 text-success',
            gray: 'badge bg-secondary bg-opacity-10 text-dark',
        };
        return (
            <span className={`badge ${colors[info?.color] || 'bg-light'}`}>
                {info?.label || '-'}
            </span>
        );
    };

    const handleDelete = (id) => {
        confirmDelete('Bu başvuruyu silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/submissions/${id}`, {
                onSuccess: () => showSuccess('Başvuru başarıyla silindi.'),
            });
        });
    };

    const renderStars = (rating) => {
        if (!rating) return <span className="text-muted">-</span>;
        return (
            <div className="d-flex align-items-center">
                <span className="text-warning">
                    {'★'.repeat(Math.round(rating))}
                </span>
                <span className="text-muted ms-1">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout header="Başvurular">
            <Head title="Başvurular" />

            <div className="py-5">
                <div className="container">
                    <div className="card bg-white p-4 rounded-3 shadow-sm mb-5">
                        <div className="row g-3">
                            <div className="col-md-2">
                                <label className="d-block fs-sm fw-medium mb-1">Durum</label>
                                <select
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {STATUSES.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <label className="d-block fs-sm fw-medium mb-1">İstihbarat</label>
                                <select
                                    className="form-select"
                                    value={filterInvestigation}
                                    onChange={(e) => setFilterInvestigation(e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {INVESTIGATIONS.map((inv) => (
                                        <option key={inv.value} value={inv.value}>
                                            {inv.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <label className="d-block fs-sm fw-medium mb-1">Form</label>
                                <select
                                    className="form-select"
                                    value={filterForm}
                                    onChange={(e) => setFilterForm(e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {forms.map((form) => (
                                        <option key={form.id} value={form.id}>
                                            {form.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Departman</label>
                                <select
                                    className="form-control w-100 border-secondary rounded-3 shadow-sm-sm"
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-flex align-items-end">
                                <button
                                    onClick={applyFilters}
                                    className="btn btn-primary btn-sm w-100"
                                >
                                    Filtrele
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm-sm">
                        <table className="w-100 divide-y divide-gray-200 table table-sm">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Ad Soyad</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Tarih</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Form</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Departman</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Durum</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">İstihbarat</th>
                                    <th className="px-4 py-3 text-center fs-xs fw-medium text-muted text-uppercase">Yorum</th>
                                    <th className="px-4 py-3 text-center fs-xs fw-medium text-muted text-uppercase">Puan</th>
                                    <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr key={submission.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/submissions/${submission.id}`}
                                                className="fs-sm fw-medium text-dark hover:text-primary hover:underline"
                                            >
                                                {submission.applicant_name}
                                            </Link>
                                            <div className="fs-xs text-muted">{submission.applicant_email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-nowrap fs-sm text-muted">
                                            {new Date(submission.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-4 py-3 fs-xs text-dark">
                                            {submission.form?.name}
                                        </td>
                                        <td className="px-4 py-3 text-nowrap fs-xs text-muted">
                                            {submission.form?.department?.title || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            {getStatusBadge(submission.status)}
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            {getInvestigationBadge(submission.investigation)}
                                        </td>
                                        <td className="px-4 py-3 text-center fs-sm text-muted">
                                            {submission.comment_count || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {renderStars(submission.avg_rating)}
                                        </td>
                                        <td className="px-4 py-3 text-nowrap text-right">
                                            <div className="d-flex align-items-center justify-content-end">
                                                <Link
                                                    href={`/admin/submissions/${submission.id}`}
                                                    className="p-2 text-info hover:text-info hover:bg-blue-50 rounded"
                                                    title="Görüntüle"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(submission.id)}
                                                    className="p-2 text-danger hover:text-danger hover:bg-red-50 rounded"
                                                    title="Sil"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
