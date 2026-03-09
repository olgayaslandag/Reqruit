import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

export default function Index({ forms, departments }) {
    const handleDelete = (id) => {
        confirmDelete('Bu formu silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/forms/${id}`, {
                onSuccess: () => showSuccess('Form başarıyla silindi.'),
            });
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Formlar
                    </h2>
                    <Link
                        href="/admin/forms/create"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Form
                    </Link>
                </div>
            }
        >
            <Head title="Formlar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 table table-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Adı</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departman</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alan Sayısı</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {forms.map((form) => (
                                    <tr key={form.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/forms/${form.id}/edit`}
                                                className="text-sm font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                                            >
                                                {form.name}
                                            </Link>
                                            <div className="text-sm text-gray-500">/{form.slug}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {form.department?.title || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {form.fields?.length || 0}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/forms/${form.id}/edit`}
                                                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition"
                                                    title="Düzenle"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={`/forms/${form.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition"
                                                    title="Önizleme"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(form.id)}
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
