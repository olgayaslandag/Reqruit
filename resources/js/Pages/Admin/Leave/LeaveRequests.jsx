import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LeaveRequests({ leaveRequests: initialLeaveRequests, employees: initialEmployees, leaveTypes: initialLeaveTypes, filters: initialFilters }) {
    // usePage props fallback - server-side rendering için
    const { props } = usePage();
    const pageProps = props || {};
    const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests || []);
    const [employees, setEmployees] = useState(initialEmployees || []);
    const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes || []);
    const [filters, setFilters] = useState(initialFilters || { employee_id: '', status: '', year: new Date().getFullYear() });
    const [showModal, setShowModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [approverComment, setApproverComment] = useState('');
    const [formData, setFormData] = useState({
        employee_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        is_half_day: false,
        reason: '',
        requires_hr_approval: false
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (initialLeaveRequests) setLeaveRequests(initialLeaveRequests);
        if (initialEmployees) setEmployees(initialEmployees);
        if (initialLeaveTypes) setLeaveTypes(initialLeaveTypes);
        if (initialFilters) setFilters(initialFilters);

        // Listen for custom event to open modal
        const handleOpenModal = () => {
            setFormData({
                employee_id: '',
                leave_type_id: '',
                start_date: '',
                end_date: '',
                is_half_day: false,
                reason: '',
                requires_hr_approval: false
            });
            setEditingId(null);
            setShowModal(true);
        };

        document.addEventListener('openLeaveRequestModal', handleOpenModal);

        return () => {
            document.removeEventListener('openLeaveRequestModal', handleOpenModal);
        };
    }, [initialLeaveRequests, initialEmployees, initialLeaveTypes, initialFilters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            router.put(`/admin/leave/requests/${editingId}`, formData);
        } else {
            router.post('/admin/leave/requests', formData);
        }

        resetForm();
    };

    const handleEdit = (request) => {
        setFormData({
            employee_id: request.employee_id,
            leave_type_id: request.leave_type_id,
            start_date: request.start_date,
            end_date: request.end_date,
            is_half_day: request.is_half_day,
            reason: request.reason,
            requires_hr_approval: request.requires_hr_approval
        });
        setEditingId(request.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Bu izin talebini silmek istediğinize emin misiniz?')) {
            router.delete(`/admin/leave/requests/${id}`);
        }
    };

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setShowApproveModal(true);
    };

    const confirmApprove = () => {
        router.put(`/admin/leave/requests/${selectedRequest.id}`, {
            ...selectedRequest,
            status: 'approved',
            approval_comment: approverComment
        });
        setShowApproveModal(false);
        setApproverComment('');
        setSelectedRequest(null);
    };

    const handleReject = (request) => {
        const rejectionReason = prompt('Reddetme gerekçesini belirtin:');
        if (rejectionReason) {
            router.put(`/admin/leave/requests/${request.id}`, {
                ...request,
                status: 'rejected',
                rejection_reason: rejectionReason
            });
        }
    };

    const resetForm = () => {
        setFormData({
            employee_id: '',
            leave_type_id: '',
            start_date: '',
            end_date: '',
            is_half_day: false,
            reason: '',
            requires_hr_approval: false
        });
        setEditingId(null);
        setShowModal(false);
    };

    const handleApplyFilters = () => {
        router.get('/admin/leave/requests', filters, {
            preserveState: true,
            replace: true
        });
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(emp => emp.id === employeeId);
        return employee ? `${employee.first_name} ${employee.last_name}` : 'Bulunamadı';
    };

    const getLeaveTypeName = (typeId) => {
        const type = leaveTypes.find(t => t.id === typeId);
        return type ? type.name : 'Bulunamadı';
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">

                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }} className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Çalışan</label>
                                <select
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={filters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {(employees || []).map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                                <select
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    <option value="pending">Beklemede</option>
                                    <option value="approved">Onaylı</option>
                                    <option value="rejected">Reddedilmiş</option>
                                    <option value="cancelled">İptal Edilmiş</option>
                                </select>
                            </div>

                            <div className="w-32">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label>
                                <select
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={filters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                >
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </select>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Filtrele
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İzin Türü</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yarım Gün</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(leaveRequests || []).map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getEmployeeName(request.employee_id)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLeaveTypeName(request.leave_type_id)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.start_date).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.end_date).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.is_half_day ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {request.is_half_day ? 'Evet' : 'Hayır'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                {request.status === 'pending' && 'Beklemede'}
                                                {request.status === 'approved' && 'Onaylandı'}
                                                {request.status === 'rejected' && 'Reddedildi'}
                                                {request.status === 'cancelled' && 'İptal Edildi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{request.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {(request.status === 'pending') && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(request)}
                                                        className="text-green-600 hover:text-green-900 mr-4"
                                                    >
                                                        Onayla
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request)}
                                                        className="text-red-600 hover:text-red-900 mr-4"
                                                    >
                                                        Reddet
                                                    </button>
                                                </>
                                            )}
                                            {(request.status === 'pending' || request.status === 'cancelled') && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(request)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Güncelle
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(request.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Sil
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                        <div className="relative p-5 bg-white rounded-lg shadow-xl w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">{editingId ? 'İzin Talebi Düzenle' : 'Yeni İzin Talebi Ekle'}</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Çalışan</label>
                                        <select
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.employee_id}
                                            onChange={(e) => setFormData({...formData, employee_id: parseInt(e.target.value)})}
                                            required
                                        >
                                            <option value="">Seçin...</option>
                                            {(employees || []).map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">İzin Türü</label>
                                        <select
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.leave_type_id}
                                            onChange={(e) => setFormData({...formData, leave_type_id: parseInt(e.target.value)})}
                                            required
                                        >
                                            <option value="">Seçin...</option>
                                            {(leaveTypes || []).map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Başlangıç Tarihi</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Bitiş Tarihi</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                checked={formData.is_half_day}
                                                onChange={(e) => setFormData({...formData, is_half_day: e.target.checked})}
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Yarım Gün</span>
                                        </label>
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                checked={formData.requires_hr_approval}
                                                onChange={(e) => setFormData({...formData, requires_hr_approval: e.target.checked})}
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">İK Onayı Gerekiyor</span>
                                        </label>
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Açıklama</label>
                                        <textarea
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                            rows="3"
                                        />
                                    </div>
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

                {/* Approve Modal */}
                {showApproveModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                        <div className="relative p-5 bg-white rounded-lg shadow-xl w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">İzin Talebini Onayla</h3>

                            <p className="mb-4 text-gray-700">
                                <strong>{getEmployeeName(selectedRequest?.employee_id)}</strong> çalışanının{' '}
                                <strong>{getLeaveTypeName(selectedRequest?.leave_type_id)}</strong> iznine {' '}
                                <strong>{new Date(selectedRequest?.start_date).toLocaleDateString('tr-TR')}</strong> - {' '}
                                <strong>{new Date(selectedRequest?.end_date).toLocaleDateString('tr-TR')}</strong> tarihleri arasında izin talebini onaylamak istiyor musunuz?
                            </p>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">Yorum (İsteğe Bağlı)</label>
                                <textarea
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={approverComment}
                                    onChange={(e) => setApproverComment(e.target.value)}
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={() => {
                                        setShowApproveModal(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-2 bg-gray-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-400 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={confirmApprove}
                                    className="px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Onayla
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

LeaveRequests.layout = page =>
    <AuthenticatedLayout
        children={page}
        header={<div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">İzin Talepleri</h2>
            <button
                onClick={() => document.dispatchEvent(new CustomEvent('openLeaveRequestModal'))}
                className="ml-3 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
                Yeni İzin Talebi
            </button>
        </div>}
    />;
