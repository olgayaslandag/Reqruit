import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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
        1: 'text-green-600 bg-green-100',
        2: 'text-red-600 bg-red-100',
        3: 'text-yellow-600 bg-yellow-100',
    };
    return colors[statusId] || 'text-gray-600 bg-gray-100';
};

export default function Index({ users }) {
    const handleDelete = (id) => {
        confirmDelete('Bu kullanıcıyı silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/users/${id}`, {
                onSuccess: () => showSuccess('Kullanıcı başarıyla silindi.'),
            });
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Kullanıcılar
                    </h2>
                    <Link
                        href="/admin/users/create"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Kullanıcı
                    </Link>
                </div>
            }
        >
            <Head title="Kullanıcılar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 table table-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="text-sm font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                                            >
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{getRankLabel(user.rank_id)}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status_id)}`}>
                                                {getStatusLabel(user.status_id)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="p-1 text-indigo-600 hover:text-indigo-900"
                                                    title="Düzenle"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1 text-red-600 hover:text-red-900"
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

                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                                            Kullanıcı bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}