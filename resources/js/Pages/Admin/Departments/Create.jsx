import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess } from '@/Utils/toast';

export default function Create({ departments }) {
    const flattenDepartments = (depts, level = 0) => {
        let result = [];
        depts.forEach(dept => {
            result.push({ ...dept, level });
            if (dept.children && dept.children.length > 0) {
                result = result.concat(flattenDepartments(dept.children, level + 1));
            }
        });
        return result;
    };

    const flatDepartments = flattenDepartments(departments || []);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        emails: [],
        parent_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/departments', {
            onSuccess: () => showSuccess('Departman başarıyla oluşturuldu.'),
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
                title: 'Yeni Departman',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Departmanlar', url: route('admin.departments.index') },
                    { label: 'Yeni Departman', url: route('admin.departments.create') },
                ],
            }}
        >
            <Head title="Yeni Departman" />

            <div className="py-4">
                <div className="container-fluid px-0">
                    <div className="card shadow-sm">
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
                                            <option key={dept.id} value={dept.id}>
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
                                    {data.emails.map((email, index) => (
                                        <div key={index} className="input-group mb-2">
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
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}