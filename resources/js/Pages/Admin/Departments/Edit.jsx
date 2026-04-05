import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess } from '@/Utils/toast';
import { flattenDepartments } from '@/Utils/commonUtils';

export default function Edit({ department, departments }) {
    const flatDepartments = flattenDepartments(departments || []);

    const { data, setData, put, processing, errors } = useForm({
        title: department.title || '',
        emails: department.emails || [],
        parent_id: department.parent_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/departments/${department.id}`, {
            onSuccess: () => showSuccess('Departman başarıyla güncellendi.'),
        });
    };

    const handleEmailChange = (index, value) => {
        const newEmails = [...data.emails];
        newEmails[index] = value;
        setData('emails', newEmails);
    };

    const addEmailField = () => {
        setData('emails', [...data.emails, '']);
    };

    const removeEmailField = (index) => {
        const newEmails = data.emails.filter((_, i) => i !== index);
        setData('emails', newEmails);
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Departman Düzenle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Departmanlar', url: route('admin.departments.index') },
                    { label: 'Departman Düzenle', url: route('admin.departments.edit', department.id) },
                ],
            }}
        >
            <Head title="Departman Düzenle" />


            <div className="card mb-3">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-medium">Üst Departman</label>
                            <select
                                className="form-select"
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value || '')}
                            >
                                <option value="">Yok (Ana Departman)</option>
                                {flatDepartments.map((dept) => (
                                    <option
                                        key={dept.id}
                                        value={dept.id}
                                        disabled={department.id === dept.id}
                                    >
                                        {'—'.repeat(dept.level)} {dept.title}
                                    </option>
                                ))}
                            </select>
                            {errors.parent_id && (
                                <p className="mt-1 small text-danger">{errors.parent_id}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium">Başlık</label>
                            <input
                                type="text"
                                className="form-control"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 small text-danger">{errors.title}</p>
                            )}
                        </div>

                            <div className="mb-4">
                                <label className="form-label fw-medium">E-postalar</label>
                                {data.emails.map((email, idx) => (
                                    <div key={`${idx}-${email || 'empty'}`} className="input-group mb-2">
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeEmailField(index)}
                                        className="btn btn-outline-danger"
                                    >
                                        <i className="ti ti-x"></i>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addEmailField}
                                className="btn btn-link text-primary p-0"
                            >
                                <i className="ti ti-plus me-1"></i>
                                E-posta ekle
                            </button>
                            {errors.emails && (
                                <p className="mt-1 small text-danger">{errors.emails}</p>
                            )}
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <a
                                href={route('admin.departments.index')}
                                className="btn btn-secondary"
                            >
                                İptal
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                Güncelle
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
