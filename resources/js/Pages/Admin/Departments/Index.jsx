import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';

export default function Index({ departments }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const { data, setData, post, reset } = useForm({
        title: '',
        emails: [],
        parent_id: '',
    });

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

    const openModal = (department = null) => {
        if (department) {
            setEditingDepartment(department);
            setData({
                title: department.title,
                emails: department.emails || [],
                parent_id: department.parent_id || '',
            });
        } else {
            setEditingDepartment(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDepartment(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingDepartment) {
            router.put(`/admin/departments/${editingDepartment.id}`, {
                ...data,
                emails: data.emails.filter(e => e !== ''),
            }, {
                onSuccess: closeModal,
            });
        } else {
            router.post('/admin/departments', {
                ...data,
                emails: data.emails.filter(e => e !== ''),
            }, {
                onSuccess: closeModal,
            });
        }
    };

    const handleDelete = (id) => {
        confirmDelete('Bu departmanı silmek istediğinize emin misiniz?', () => {
            router.delete(`/admin/departments/${id}`, {
                onSuccess: () => showSuccess('Departman başarıyla silindi.'),
            });
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

    const collectDepartmentRows = (department, level = 0) => {
        const indent = level * 24;
        const isParent = department.children && department.children.length > 0;

        const rows = [
            <tr key={department.id}>
                <td className="px-4 py-3 text-nowrap">
                    <div className="d-flex align-items-center" style={{ paddingLeft: indent }}>
                        {isParent && (
                            <i className="bi bi-chevron-down me-1 text-muted"></i>
                        )}
                        {!isParent && level > 0 && (
                            <span className="me-1 text-muted">└</span>
                        )}
                        <span className={level > 0 ? 'text-muted' : 'fw-medium text-dark'}>
                            {department.title}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3">
                    {(department.emails || []).map((email, i) => (
                        <span key={i} className="badge bg-light text-dark me-1">
                            {email}
                        </span>
                    ))}
                </td>
                <td className="px-4 py-3 text-nowrap text-end">
                    <div className="d-flex align-items-center justify-content-end gap-1">
                        <button
                            onClick={() => openModal(department)}
                            className="btn btn-link text-primary p-0"
                            title="Düzenle"
                        >
                            <i className="ti ti-edit"></i>
                        </button>
                        <button
                            onClick={() => handleDelete(department.id)}
                            className="btn btn-link text-danger p-0"
                            title="Sil"
                        >
                            <i className="ti ti-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        ];

        if (department.children) {
            department.children.forEach(child => {
                rows.push(...collectDepartmentRows(child, level + 1));
            });
        }

        return rows;
    };

    const allRows = (departments || []).flatMap(dept => collectDepartmentRows(dept));

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Departmanlar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Departmanlar', url: route('admin.departments.index') },
                ],
                newUrl: route('admin.departments.create'),
            }}
        >
            <Head title="Departmanlar" />

            <div className="py-4">
                <div className="container-fluid px-0">
                    <div className="card shadow-sm">
                        <div className="table-responsive">
                            <table className="table table-hover table-sm mb-0">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3">Başlık</th>
                                        <th className="px-4 py-3">E-postalar</th>
                                        <th className="px-4 py-3 text-end">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" onClick={closeModal}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingDepartment ? 'Departman Düzenle' : 'Yeni Departman'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Üst Departman</label>
                                        <select className="form-select" value={data.parent_id}
                                            onChange={(e) => setData('parent_id', e.target.value || '')}
                                        >
                                            <option value="">Yok (Ana Departman)</option>
                                            {flatDepartments.map((dept) => (
                                                <option
                                                    key={dept.id}
                                                    value={dept.id}
                                                    disabled={editingDepartment?.id === dept.id}
                                                >
                                                    {'—'.repeat(dept.level)} {dept.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Başlık</label>
                                        <input className="form-control" type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-0">
                                        <label className="form-label fw-medium">E-postalar</label>
                                        {data.emails.map((email, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <input className="form-control" type="email"
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
                                    </div>
                                </div>
                                <div className="modal-footer d-flex flex-column gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        {editingDepartment ? 'Güncelle' : 'Oluştur'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="btn btn-secondary w-100"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
