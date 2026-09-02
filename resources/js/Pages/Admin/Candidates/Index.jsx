import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import { SkeletonRow } from '@/Components/Skeleton';
import { Head, Link, router } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

const STATUSES = [
    { value: 'active', label: 'Aktif', color: 'green' },
    { value: 'engaged', label: 'İlgileniyor', color: 'blue' },
    { value: 'passive', label: 'Pasif', color: 'gray' },
    { value: 'closed', label: 'Kapandı', color: 'red' },
];

export default function Index({ candidates, filters }) {
    const candidateList = candidates?.data || candidates || [];
    const [search, setSearch] = useState(filters?.search || '');
    const [filterStatus, setFilterStatus] = useState(filters?.status || '');
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
        if (search) params.search = search;
        if (filterStatus) params.status = filterStatus;

        router.get('/admin/candidates', params, { only: ['candidates', 'filters'] });
    };

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

    const handleDelete = (id) => {
        confirmDelete('Bu kalifiye elemanı silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/candidates/${id}`, {
                onSuccess: () => showSuccess('Kalifiye eleman başarıyla silindi.'),
            });
        });
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('tr-TR');
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Kalifiye Elemanlar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Kalifiye Elemanlar', url: route('admin.candidates.index') },
                ],
                newUrl: route('admin.candidates.create'),
            }}
        >
            <Head title="Kalifiye Elemanlar" />

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label">Arama</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            applyFilters();
                                        }
                                    }}
                                    placeholder="Ad Soyad veya şirket ara..."
                                />
                                <button
                                    onClick={applyFilters}
                                    className="btn btn-primary"
                                    title="Ara"
                                >
                                    <i className="ti ti-search"></i>
                                </button>
                            </div>
                        </div>

                        <div className="col-md-3">
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

                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                onClick={applyFilters}
                                className="btn btn-outline-secondary w-100"
                            >
                                Filtrele
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3">Ad Soyad</th>
                                    <th className="px-4 py-3">E-posta</th>
                                    <th className="px-4 py-3">Telefon</th>
                                    <th className="px-4 py-3">Şu Anki Şirket</th>
                                    <th className="px-4 py-3">Pozisyon</th>
                                    <th className="px-4 py-3">Son Görüşme</th>
                                    <th className="px-4 py-3">Kayıt Tarihi</th>
                                    <th className="px-4 py-3 text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <SkeletonRow key={index} columns={8} />
                                    ))
                                ) : candidateList.length > 0 ? (
                                    candidateList.map((candidate) => (
                                        <tr key={candidate.id}>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/candidates/${candidate.id}`}
                                                    className="text-decoration-none text-dark fw-medium"
                                                >
                                                    {candidate.name}
                                                    <span className="ms-1">{getStatusBadge(candidate.status)}</span>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {candidate.email || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {candidate.phone || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {candidate.current_employer || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {candidate.current_position || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {candidate.last_interaction_date ? formatDate(candidate.last_interaction_date) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {formatDate(candidate.created_at)}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Link
                                                        href={`/admin/candidates/${candidate.id}`}
                                                        className="btn btn-link text-primary p-0"
                                                        title="Görüntüle"
                                                        aria-label="Görüntüle"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(candidate.id)}
                                                        className="btn btn-link text-danger p-0"
                                                        title="Sil"
                                                        aria-label="Sil"
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">
                                            <EmptyState
                                                title="Kalifiye eleman bulunamadı"
                                                description={search || filterStatus ?
                                                    "Aradığınız kriterlere uygun kalifiye eleman bulunamadı." :
                                                    "Henüz hiç kalifiye eleman eklenmemiş."
                                                }
                                                icon={<i className="ti ti-users"></i>}
                                                actionUrl={search || filterStatus ?
                                                    route('admin.candidates.index') :
                                                    route('admin.candidates.create')
                                                }
                                                linkText={search || filterStatus ?
                                                    "Aramayı Temizle" :
                                                    "Yeni Ekle"
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Pagination meta={candidates} baseUrl="/admin/candidates" only={['candidates', 'filters']} />
        </AuthenticatedLayout>
    );
}