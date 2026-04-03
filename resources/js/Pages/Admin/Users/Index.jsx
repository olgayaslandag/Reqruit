import { useState } from 'react';
import { router, Link, Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

const getRankLabel = (rankId) => {
    const ranks = {
        1: 'Yönetici',
        2: 'İK Yöneticisi',
        3: 'İşe Alım Uzmanı',
        4: 'Departman Sorumlusu',
        5: 'Gözlemci',
    };
    return ranks[rankId] || '-';
};

const getStatusLabel = (statusId) => {
    const statuses = {
        1: 'Aktif',
        2: 'Pasif',
        3: 'Beklemede',
    };
    return statuses[statusId] || '-';
};

const getStatusColor = (statusId) => {
    const colors = {
        1: 'text-success bg-success bg-opacity-10',
        2: 'text-danger bg-danger bg-opacity-10',
        3: 'text-warning bg-warning bg-opacity-10',
    };
    return colors[statusId] || 'text-muted bg-light';
};

export default function Index({ users, filters }) {
    const { props } = usePage();
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search: searchTerm,
        }, { replace: true });
    };

    const handleDelete = (id) => {
        confirmDelete('Bu kullanıcıyı silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/users/${id}`, {
                onSuccess: () => showSuccess('Kullanıcı başarıyla silindi.'),
            });
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Kullanıcılar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İnsan Kaynakları', url: '#' },
                    { label: 'Kullanıcılar', url: route('admin.users.index') },
                ],
                newUrl: route('admin.users.create'),

            }}
        >
            <Head title="Kullanıcılar" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Arama */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body p-3">
                            <form onSubmit={handleSearch} className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Kullanıcı ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">
                                    <i className="ti ti-search"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <table className="w-100 table table-sm mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Ad Soyad</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">E-posta</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Rol</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Durum</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Kayıt Tarihi</th>
                                    <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(users?.data || []).map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="fs-sm fw-medium text-dark"
                                            >
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            <div className="fs-sm text-dark">{user.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            <div className="fs-sm text-dark">{getRankLabel(user.rank_id)}</div>
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            <span className={`px-2 py-1 fs-xs fw-medium rounded-pill ${getStatusColor(user.status_id)}`}>
                                                {getStatusLabel(user.status_id)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            <div className="fs-sm text-muted">
                                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-nowrap">
                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="btn btn-link btn-sm text-primary p-0"
                                                    title="Düzenle"
                                                >
                                                    <i className="ti ti-edit"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="btn btn-link btn-sm text-danger p-0"
                                                    title="Sil"
                                                >
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {(users?.data?.length === 0 || !users?.data) && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center fs-sm text-muted">
                                            Kullanıcı bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.meta && users.meta.last_page > 1 && (
                        <Pagination meta={users.meta} baseUrl={route('admin.users.index')} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
