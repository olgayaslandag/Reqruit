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

    const handleDelete = (id) => {
        confirmDelete('Bu başvuruyu silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/submissions/${id}`, {
                onSuccess: () => showSuccess('Başvuru başarıyla silindi.'),
            });
        });
    };

    const renderStars = (rating) => {
        if (!rating) return <span className="text-gray-400">-</span>;
        return (
            <div className="flex items-center">
                <span className="text-yellow-500">
                    {'★'.repeat(Math.round(rating))}
                </span>
                <span className="text-gray-300 ml-1">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Başvurular
                </h2>
            }
        >
            <Head title="Başvurular" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="grid grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Tümü</option>
                                    {STATUSES.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">İstihbarat</label>
                                <select
                                    value={filterInvestigation}
                                    onChange={(e) => setFilterInvestigation(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Tümü</option>
                                    {INVESTIGATIONS.map((inv) => (
                                        <option key={inv.value} value={inv.value}>
                                            {inv.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
                                <select
                                    value={filterForm}
                                    onChange={(e) => setFilterForm(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Tümü</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={applyFilters}
                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Filtrele
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 table table-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departman</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İstihbarat</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Yorum</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Puan</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr key={submission.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/submissions/${submission.id}`}
                                                className="text-sm font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                                            >
                                                {submission.applicant_name}
                                            </Link>
                                            <div className="text-xs text-gray-500">{submission.applicant_email}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(submission.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {submission.form?.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {submission.form?.department?.title || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {getStatusBadge(submission.status)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {getInvestigationBadge(submission.investigation)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-500">
                                            {submission.comment_count || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {renderStars(submission.avg_rating)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/submissions/${submission.id}`}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition"
                                                    title="Görüntüle"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(submission.id)}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition"
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
