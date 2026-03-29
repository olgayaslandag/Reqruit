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
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow"> {/* No p-6 as required */}

                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ücretli</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Belge Gerekiyor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maks. Gün</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(leaveTypes || []).map((leaveType) => (
                                    <tr key={leaveType.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leaveType.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {leaveType.is_paid ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Evet
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Hayır
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leaveType.requires_document ? 'Evet' : 'Hayır'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leaveType.max_duration_days || 'Sınırsız'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{leaveType.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(leaveType)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Güncelle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(leaveType.id)}
                                                className="text-red-600 hover:text-red-900"
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
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                        <div className="relative p-5 bg-white rounded-lg shadow-xl w-1/3">
                            <h3 className="text-lg font-bold mb-4">{editingId ? 'İzin Türü Düzenle' : 'Yeni İzin Türü Ekle'}</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Ad</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            checked={formData.is_paid}
                                            onChange={(e) => setFormData({...formData, is_paid: e.target.checked})}
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">Ücretli</span>
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            checked={formData.requires_document}
                                            onChange={(e) => setFormData({...formData, requires_document: e.target.checked})}
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">Belge Gerektiriyor</span>
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Maksimum Süre (Gün)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.max_duration_days}
                                        onChange={(e) => setFormData({...formData, max_duration_days: e.target.value ? parseInt(e.target.value) : ''})}
                                        min="1"
                                        max="365"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Kod</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Açıklama</label>
                                    <textarea
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows="3"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 bg-gray-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-400 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
        header={<div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">İzin Türleri</h2>
            <button
                onClick={() => document.dispatchEvent(new CustomEvent('openLeaveTypeModal'))}
                className="ml-3 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
                Yeni İzin Türü
            </button>
        </div>}
    />;
