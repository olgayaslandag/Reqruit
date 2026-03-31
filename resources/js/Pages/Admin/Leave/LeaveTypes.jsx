import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LeaveTypes({ leaveTypes: initialLeaveTypes }) {
    // usePage props fallback - server-side rendering için
    const { props } = usePage();
    const pageProps = props || {};
    const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes || []);
    const [formData, setFormData] = useState({
        name: '',
        is_paid: true,
        requires_document: false,
        max_duration_days: '',
        code: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (initialLeaveTypes) {
            setLeaveTypes(initialLeaveTypes);
        }

        // Listen for custom event to open modal
        const handleOpenModal = () => {
            setShowModal(true);
        };

        document.addEventListener('openLeaveTypeModal', handleOpenModal);

        return () => {
            document.removeEventListener('openLeaveTypeModal', handleOpenModal);
        };
    }, [initialLeaveTypes]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            // Update existing
            router.put(`/admin/leave/types/${editingId}`, formData);
        } else {
            // Create new
            router.post('/admin/leave/types', formData);
        }

        resetForm();
    };

    const handleEdit = (leaveType) => {
        setFormData({
            name: leaveType.name,
            is_paid: leaveType.is_paid,
            requires_document: leaveType.requires_document,
            max_duration_days: leaveType.max_duration_days || '',
            code: leaveType.code,
            description: leaveType.description
        });
        setEditingId(leaveType.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Bu izin türünü silmek istediğinize emin misiniz?')) {
            router.delete(`/admin/leave/types/${id}`);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            is_paid: true,
            requires_document: false,
            max_duration_days: '',
            code: '',
            description: ''
        });
        setEditingId(null);
        setShowModal(false);
    };

    return (
        <div className="py-12">
            <div className="mw-100 mx-auto">
                <div className="bg-white rounded-3 shadow-sm"> {/* No p-4 as required */}

                    <div className="overflow-hidden">
                        <table className="w-100 divide-y divide-gray-200">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Ad</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Ücretli</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Belge Gerekiyor</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Maks. Gün</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Açıklama</th>
                                    <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(leaveTypes || []).map((leaveType) => (
                                    <tr key={leaveType.id} className="hover:table-light">
                                        <td className="px-6 py-4 text-nowrap fs-sm text-dark">{leaveType.name}</td>
                                        <td className="px-6 py-4 text-nowrap fs-sm">
                                            {leaveType.is_paid ? (
                                                <span className="px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill bg-success bg-opacity-10 text-success">
                                                    Evet
                                                </span>
                                            ) : (
                                                <span className="px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill bg-danger bg-opacity-10 text-danger">
                                                    Hayır
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-muted">{leaveType.requires_document ? 'Evet' : 'Hayır'}</td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-muted">{leaveType.max_duration_days || 'Sınırsız'}</td>
                                        <td className="px-6 py-4 fs-sm text-muted">{leaveType.description}</td>
                                        <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                            <button
                                                onClick={() => handleEdit(leaveType)}
                                                className="text-primary hover:text-indigo-900 mr-4"
                                            >
                                                Güncelle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(leaveType.id)}
                                                className="text-danger hover:text-red-900"
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="position-fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-100 w-100 d-flex align-items-center justify-content-center">
                        <div className="position-relative p-5 bg-white rounded-3 shadow-sm-xl w-1/3">
                            <h5 className="fw-medium">{editingId ? 'İzin Türü Düzenle' : 'Yeni İzin Türü Ekle'}</h5>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="d-block text-dark fs-sm fw-medium mb-1">Ad</label>
                                    <input type="text" className="form-control"  
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-secondary text-primary shadow-sm-sm focus:border-indigo-300 focus:ring focus: focus:"
                                            checked={formData.is_paid}
                                            onChange={(e) => setFormData({...formData, is_paid: e.target.checked})}
                                        />
                                        <span className="ml-2 fs-sm fw-medium text-dark">Ücretli</span>
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <label className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-secondary text-primary shadow-sm-sm focus:border-indigo-300 focus:ring focus: focus:"
                                            checked={formData.requires_document}
                                            onChange={(e) => setFormData({...formData, requires_document: e.target.checked})}
                                        />
                                        <span className="ml-2 fs-sm fw-medium text-dark">Belge Gerektiriyor</span>
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <label className="d-block text-dark fs-sm fw-medium mb-1">Maksimum Süre (Gün)</label>
                                    <input type="number" className="form-control"  
                                        value={formData.max_duration_days}
                                        onChange={(e) => setFormData({...formData, max_duration_days: e.target.value ? parseInt(e.target.value) : ''})}
                                        min="1"
                                        max="365"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="d-block text-dark fs-sm fw-medium mb-1">Kod</label>
                                    <input type="text" className="form-control"  
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="d-block text-dark fs-sm fw-medium mb-1">Açıklama</label>
                                    <textarea className="form-control"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows={3}
                                    />
                                </div>

                                <div className="d-flex justify-content-end space-x-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 bg-gray-500 border border-transparent rounded fw-semibold fs-xs text-white text-uppercase tracking-widest hover:bg-gray-400 active:bg-gray-600 focus:outline-none focus: focus:  -out"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                    >
                                        {editingId ? 'Güncelle' : 'Oluştur'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Pass the header with action button to the layout
LeaveTypes.layout = page =>
    <AuthenticatedLayout
        children={page}
        header={<div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-medium text-dark">İzin Türleri</h5>
            <button
                onClick={() => document.dispatchEvent(new CustomEvent('openLeaveTypeModal'))}
                className="btn btn-primary btn-sm ms-auto"
            >
                Yeni İzin Türü
            </button>
        </div>}
    />;
