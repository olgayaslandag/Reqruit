import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import { Head } from '@inertiajs/react';
import { confirmDelete } from '@/Utils/sweetAlert';
import { useFlashWithToast } from '@/Hooks/useFlash';

export default function Index({ forms, departments, filters }) {
    const flash = useFlashWithToast();
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const formList = forms?.data || forms || [];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.forms.index'), {
            search: searchTerm,
        }, { replace: true, only: ['forms', 'filters'] });
    };

    const handleDelete = (id) => {
        confirmDelete('Bu formu silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/forms/${id}`);
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Formlar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İnsan Kaynakları', url: '#' },
                    { label: 'Formlar', url: route('admin.forms.index') },
                ],
                newUrl: route('admin.forms.create'),
                filterCollapse: 'filterCollapse',
            }}
        >
            <Head title="Formlar" />

            {/* Arama */}
            <div className="card collapse mb-4" id="filterCollapse">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="row g-3 align-items-end">
                        <div className="col-md-10">
                            <label className="form-label">Form Ara</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Form ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary">
                                <i className="ti ti-search me-1"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="px-4 py-3">Form Adı</th>
                                <th className="px-4 py-3">Departman</th>
                                <th className="px-4 py-3">Alan Sayısı</th>
                                <th className="px-4 py-3 text-end">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formList.length > 0 ? (
                                formList.map((form) => (
                                <tr key={form.id}>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/forms/${form.id}/edit`}
                                            className="text-decoration-none text-dark fw-medium"
                                        >
                                            {form.name}
                                        </Link>
                                        <div className="text-muted small">/{form.slug}</div>
                                    </td>
                                    <td className="px-4 py-3 text-nowrap">
                                        {form.department?.title || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-nowrap">
                                        {form.fields?.length || 0}
                                    </td>
                                    <td className="px-4 py-3 text-nowrap text-end">
                                        <div className="d-flex gap-2 justify-content-end">
                                            <Link
                                                href={`/admin/forms/${form.id}/edit`}
                                                className="btn btn-link text-secondary p-0"
                                                title="Düzenle"
                                            >
                                                <i className="ti ti-edit"></i>
                                            </Link>
                                            <Link
                                                href={`/forms/${form.slug}`}
                                                target="_blank"
                                                className="btn btn-link text-primary p-0"
                                                title="Önizleme"
                                            >
                                                <i className="ti ti-external-link"></i>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(form.id)}
                                                className="btn btn-link text-danger p-0"
                                                title="Sil"
                                            >
                                                <i className="ti ti-trash"></i>
                                            </button>
                                        </div>
                                </td>
                            </tr>
                        ))) : (
                            <tr>
                                <td colSpan="4">
                                    <EmptyState
                                        title="Form bulunamadı"
                                        description={searchTerm ? 
                                            "Aradığınız kriterlere uygun form bulunamadı." : 
                                            "Henüz hiç form oluşturulmamış. İlk formunuzu oluşturmak için aşağıdaki butona tıklayabilirsiniz."
                                        }
                                        icon={<i className="ti ti-forms"></i>}
                                        actionUrl={searchTerm ?
                                            route('admin.forms.index') :
                                            route('admin.forms.create')
                                        }
                                        linkText={searchTerm ?
                                            "Aramayı Temizle" :
                                            "Yeni Form Oluştur"
                                        }
                                    />
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination meta={forms} baseUrl={route('admin.forms.index')} only={['forms', 'filters']} />
        </AuthenticatedLayout>
    );
}
