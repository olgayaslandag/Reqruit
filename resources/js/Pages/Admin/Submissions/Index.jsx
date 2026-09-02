import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { SkeletonRow } from '@/Components/Skeleton';
import { Head, Link, router } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import Pagination from '@/Components/Pagination';

const STATUSES = [
    { value: 'new', label: 'Yeni', color: 'blue' },
    { value: 'reviewing', label: 'İnceleniyor', color: 'yellow' },
    { value: 'interview', label: 'Mülakat', color: 'purple' },
    { value: 'offer', label: 'Teklif', color: 'green' },
    { value: 'hired', label: 'İşe Alındı', color: 'green' },
    { value: 'rejected', label: 'Reddedildi', color: 'red' },
];

// Investigation status filter options
const INVESTIGATION_FILTER_OPTIONS = [
    { value: 'pending', label: 'Bekliyor', color: 'yellow' },
    { value: 'completed', label: 'Tamamlandı', color: 'green' },
    { value: 'none', label: 'Yapılmadı', color: 'gray' },
];

export default function Index({ submissions, forms, departments, filters }) {
    const submissionList = submissions?.data || submissions || [];
    const [filterStatus, setFilterStatus] = useState(filters?.status || '');
    const [filterInvestigation, setFilterInvestigation] = useState(filters?.investigation || '');
    const [filterForm, setFilterForm] = useState(filters?.form_id || '');
    const [filterDepartment, setFilterDepartment] = useState(filters?.department_id || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const cleanupStart = router.on('start', () => { setIsLoading(true); });
        const cleanupFinish = router.on('finish', () => { setIsLoading(false); });
        return () => {
            cleanupStart();
            cleanupFinish();
        };
    }, []);

    const applyFilters = () => {
        const params = {};
        if (filterStatus) params.status = filterStatus;
        if (filterInvestigation) params.investigation = filterInvestigation;
        if (filterForm) params.form_id = filterForm;
        if (filterDepartment) params.department_id = filterDepartment;

        router.get('/admin/submissions', params, { only: ['submissions', 'filters'] });
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
        const info = INVESTIGATION_FILTER_OPTIONS.find(i => i.value === investigation);
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

    // Helper to determine display investigation status based on intelligence reports
    const getDisplayInvestigationStatus = (submission) => {
        // Check if there are related intelligence reports that are loaded
        // If so, use the latest investigation status from the related data
        // Otherwise, fall back to the original 'investigation' field
        return submission.current_investigation || submission.investigation || 'none';
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Başvurular',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Başvurular', url: route('admin.submissions.index') },
                ],
                filterCollapse: 'filterCollapse',
            }}
        >
            <Head title="Başvurular" />

            <div className="card collapse mb-4" id="filterCollapse">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-2">
                            <label className="form-label">Durum</label>
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
                            <label className="form-label">İstihbarat</label>
                            <select
                                className="form-select"
                                value={filterInvestigation}
                                onChange={(e) => setFilterInvestigation(e.target.value)}
                            >
                                <option value="">Tümü</option>
                                {INVESTIGATION_FILTER_OPTIONS.map((inv) => (
                                    <option key={inv.value} value={inv.value}>
                                        {inv.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Form</label>
                            <select
                                className="form-select"
                                value={filterForm}
                                onChange={(e) => setFilterForm(e.target.value)}
                            >
                                <option value="">Tümü</option>
                                {(forms || []).map((form) => (
                                    <option key={form.id} value={form.id}>
                                        {form.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Departman</label>
                            <select
                                className="form-select"
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                            >
                                <option value="">Tümü</option>
                                {(departments || []).map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">&nbsp;</label>
                            <button
                                onClick={applyFilters}
                                className="btn btn-primary w-100"
                            >
                                <i className="ti ti-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th className="px-4 py-3">Ad Soyad</th>
                            <th className="px-4 py-3">Tarih</th>
                            <th className="px-4 py-3">Form</th>
                            <th className="px-4 py-3">Departman</th>
                            <th className="px-4 py-3">İstihbarat</th>
                            <th className="px-4 py-3 text-center">Yorum</th>
                            <th className="px-4 py-3 text-center">Puan</th>
                            <th className="px-4 py-3 text-end">İşlemler</th>
                        </tr>
                    </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <SkeletonRow key={index} columns={8} />
                                ))
                            ) : submissionList.length > 0 ? (
                                submissionList.map((submission) => {
                                    const investigationStatus = getDisplayInvestigationStatus(submission);
                                    
                                    return (
                                        <tr key={submission.id}>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/submissions/${submission.id}`}
                                                    className="text-decoration-none text-dark fw-medium"
                                                >
                                                    {submission.applicant_name}
                                                    <span className="ms-1">{getStatusBadge(submission.status)}</span>
                                                </Link>
                                                <div className="text-muted small">{submission.applicant_email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {new Date(submission.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {submission.form?.name}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {submission.form?.department?.title || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {getInvestigationBadge(investigationStatus)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {submission.comment_count || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {renderStars(submission.avg_rating)}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Link
                                                        href={`/admin/submissions/${submission.id}`}
                                                        className="btn btn-link text-primary p-0"
                                                        title="Görüntüle"
                                                        aria-label="Görüntüle"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(submission.id)}
                                                        className="btn btn-link text-danger p-0"
                                                        title="Sil"
                                                        aria-label="Sil"
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9">
                                        <EmptyState
                                            title="Başvuru bulunamadı"
                                            description={filterStatus || filterInvestigation || filterForm || filterDepartment ? 
                                                "Aradığınız kriterlere uygun başvuru bulunamadı." : 
                                                "Henüz hiç başvuru alınmamış. Başvurular formlar aracılığıyla yapılacaktır."
                                            }
                                            icon={<i className="ti ti-file-text"></i>}
                                            actionUrl={filterStatus || filterInvestigation || filterForm || filterDepartment ?
                                                route('admin.submissions.index') :
                                                route('admin.forms.index')
                                            }
                                            linkText={filterStatus || filterInvestigation || filterForm || filterDepartment ?
                                                "Aramayı Temizle" :
                                                "Formlara Git"
                                            }
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination meta={submissions} baseUrl={route('admin.submissions.index')} only={['submissions', 'filters']} />
        </AuthenticatedLayout>
    );
}
