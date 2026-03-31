import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

export default function Index({ forms, departments, filters }) {
    const { props } = usePage();
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const url = typeof route !== 'undefined' ? route('admin.forms.index') : '/admin/forms';
        router.get(url, {
            search: searchTerm,
        }, { replace: true });
    };

    const handleDelete = (id) => {
        confirmDelete('Bu formu silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/forms/${id}`, {
                onSuccess: () => showSuccess('Form başarıyla silindi.'),
            });
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Formlar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: typeof route !== 'undefined' ? route('dashboard') : '/' },
                    { label: 'İnsan Kaynakları', url: '#' },
                    { label: 'Formlar', url: typeof route !== 'undefined' ? route('admin.forms.index') : '/admin/forms' },
                ],
                newUrl: typeof route !== 'undefined' ? route('admin.forms.create') : '/admin/forms/create',
                exportUrl: typeof route !== 'undefined' ? route('admin.forms.export') : '/admin/forms/export',
            }}
        >
            <Head title="Formlar" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Arama */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body p-3">
                            <form onSubmit={handleSearch} className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Form ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">
                                    <i className="ti ti-search"></i> Ara
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <table className="w-100 table table-sm mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Form Adı</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Departman</th>
                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Alan Sayısı</th>
                                    <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(forms?.data || []).map((form) => (
                                    <tr key={form.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/forms/${form.id}/edit`}
                                                className="fs-sm fw-medium text-dark"
                                            >
                                                {form.name}
                                            </Link>
                                            <div className="fs-sm text-muted">/{form.slug}</div>
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            {form.department?.title || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-nowrap">
                                            {form.fields?.length || 0}
                                        </td>
                                        <td className="px-4 py-3 text-nowrap text-right">
                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                <Link
                                                    href={`/admin/forms/${form.id}/edit`}
                                                    className="btn btn-link btn-sm text-primary p-0"
                                                    title="Düzenle"
                                                >
                                                    <i className="ti ti-edit"></i>
                                                </Link>
                                                <Link
                                                    href={`/forms/${form.slug}`}
                                                    target="_blank"
                                                    className="btn btn-link btn-sm text-success p-0"
                                                    title="Önizleme"
                                                >
                                                    <i className="ti ti-external-link"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(form.id)}
                                                    className="btn btn-link btn-sm text-danger p-0"
                                                    title="Sil"
                                                >
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!forms?.data || forms.data.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center fs-sm text-muted">
                                            Form bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {forms?.meta && forms.meta.last_page > 1 && (
                        <Pagination meta={forms.meta} baseUrl={typeof route !== 'undefined' ? route('admin.forms.index') : '/admin/forms'} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
