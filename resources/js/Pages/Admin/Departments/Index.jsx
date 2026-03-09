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

    const flatDepartments = flattenDepartments(departments);

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
                <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center" style={{ paddingLeft: indent }}>
                        {isParent && (
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                        {!isParent && level > 0 && (
                            <span className="w-4 h-4 mr-1 text-gray-300">└</span>
                        )}
                        <span className={level > 0 ? 'text-gray-600' : 'font-medium text-gray-900'}>
                            {department.title}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{department.slug}</td>
                <td className="px-4 py-3">
                    {department.emails?.map((email, i) => (
                        <span key={i} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1">
                            {email}
                        </span>
                    ))}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => openModal(department)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition"
                            title="Düzenle"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleDelete(department.id)}
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
        ];

        if (department.children) {
            department.children.forEach(child => {
                rows.push(...collectDepartmentRows(child, level + 1));
            });
        }

        return rows;
    };

    const allRows = departments.flatMap(dept => collectDepartmentRows(dept));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Departmanlar
                    </h2>
                    <button
                        onClick={() => openModal()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Departman
                    </button>
                </div>
            }
        >
            <Head title="Departmanlar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 table table-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-postalar</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        {editingDepartment ? 'Departman Düzenle' : 'Yeni Departman'}
                                    </h3>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Üst Departman</label>
                                        <select
                                            value={data.parent_id}
                                            onChange={(e) => setData('parent_id', e.target.value || '')}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E-postalar</label>
                                        {data.emails.map((email, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                                    placeholder="email@example.com"
                                                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeEmailField(index)}
                                                    className="p-2 text-red-600 hover:text-red-900"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addEmailField}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                                        >
                                            + E-posta ekle
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingDepartment ? 'Güncelle' : 'Oluştur'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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