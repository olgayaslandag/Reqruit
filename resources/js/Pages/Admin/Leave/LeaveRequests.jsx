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
            case 'pending': return 'bg-warning bg-opacity-10 text-warning';
            case 'approved': return 'bg-success bg-opacity-10 text-success';
            case 'rejected': return 'bg-danger bg-opacity-10 text-danger';
            case 'cancelled': return 'bg-light text-dark';
            default: return 'bg-light text-dark';
        }
    };

    return (
        <div className="py-12">
            <div className="mw-100 mx-auto">
                <div className="bg-white rounded-3 shadow-sm">

                    <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                        <form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }} className="d-flex d-flex-wrap gap-3 align-items-end">
                            <div className="d-flex-1 min-w-[200px]">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Çalışan</label>
                                <select className="form-control" value={filters.employee_id} onChange={(e) => handleFilterChange('employee_id', e.target.value)}>
                                    <option value="">Tümü</option>
                                    {(employees || []).map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-40">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Durum</label>
                                <select className="form-control" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                                    <option value="">Tümü</option>
                                    <option value="pending">Beklemede</option>
                                    <option value="approved">Onaylı</option>
                                    <option value="rejected">Reddedilmiş</option>
                                    <option value="cancelled">İptal Edilmiş</option>
                                </select>
                            </div>

                            <div className="w-32">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Yıl</label>
                                <select className="form-control" value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)}>
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </select>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="btn btn-success btn-sm"
                                >
                                    Filtrele
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden">
                        <table className="w-100 divide-y divide-gray-200">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Çalışan</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">İzin Türü</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Başlangıç</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Bitiş</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Yarım Gün</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Açıklama</th>
                                    <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(leaveRequests || []).map((request) => (
                                    <tr key={request.id} className="hover:table-light">
                                        <td className="px-6 py-4 text-nowrap fs-sm text-dark">{getEmployeeName(request.employee_id)}</td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-dark">{getLeaveTypeName(request.leave_type_id)}</td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-muted">{new Date(request.start_date).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-muted">{new Date(request.end_date).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-4 text-nowrap fs-sm">
                                            <span className={`px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill ${request.is_half_day ? 'bg-primary bg-opacity-10 text-info' : 'bg-light text-dark'}`}>
                                                {request.is_half_day ? 'Evet' : 'Hayır'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm">
                                            <span className={`px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill ${getStatusColor(request.status)}`}>
                                                {request.status === 'pending' && 'Beklemede'}
                                                {request.status === 'approved' && 'Onaylandı'}
                                                {request.status === 'rejected' && 'Reddedildi'}
                                                {request.status === 'cancelled' && 'İptal Edildi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 fs-sm text-muted">{request.reason}</td>
                                        <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                            {(request.status === 'pending') && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(request)}
                                                        className="text-success hover:text-green-900 mr-4"
                                                    >
                                                        Onayla
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request)}
                                                        className="text-danger hover:text-red-900 mr-4"
                                                    >
                                                        Reddet
                                                    </button>
                                                </>
                                            )}
                                            {(request.status === 'pending' || request.status === 'cancelled') && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(request)}
                                                        className="text-primary hover:text-indigo-900 mr-4"
                                                    >
                                                        Güncelle
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(request.id)}
                                                        className="text-danger hover:text-red-900"
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
                    <div className="position-fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-100 w-100 d-flex align-items-center justify-content-center">
                        <div className="position-relative p-5 bg-white rounded-3 shadow-sm-xl w-100 mw-100">
                            <h5 className="fw-medium">{editingId ? 'İzin Talebi Düzenle' : 'Yeni İzin Talebi Ekle'}</h5>

                            <form onSubmit={handleSubmit}>
                                <div className="d-grid d-grid-cols-1 gap-3">
                                    <div className="mb-4">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Çalışan</label>
                                        <select className="form-control" value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: parseInt(e.target.value)})} required>
                                            <option value="">Seçin...</option>
                                            {(employees || []).map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">İzin Türü</label>
                                        <select className="form-control" value={formData.leave_type_id} onChange={(e) => setFormData({...formData, leave_type_id: parseInt(e.target.value)})} required>
                                            <option value="">Seçin...</option>
                                            {(leaveTypes || []).map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Başlangıç Tarihi</label>
                                        <input type="date" className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"  
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Bitiş Tarihi</label>
                                        <input type="date" className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"  
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-secondary text-primary shadow-sm-sm focus:border-indigo-300 focus:ring focus: focus:"
                                                checked={formData.is_half_day}
                                                onChange={(e) => setFormData({...formData, is_half_day: e.target.checked})}
                                            />
                                            <span className="ml-2 fs-sm fw-medium text-dark">Yarım Gün</span>
                                        </label>
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-secondary text-primary shadow-sm-sm focus:border-indigo-300 focus:ring focus: focus:"
                                                checked={formData.requires_hr_approval}
                                                onChange={(e) => setFormData({...formData, requires_hr_approval: e.target.checked})}
                                            />
                                            <span className="ml-2 fs-sm fw-medium text-dark">İK Onayı Gerekiyor</span>
                                        </label>
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Açıklama</label>
                                        <textarea className="form-control"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                            rows="3"
                                        />
                                    </div>
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

                {/* Approve Modal */}
                {showApproveModal && (
                    <div className="position-fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-100 w-100 d-flex align-items-center justify-content-center">
                        <div className="position-relative p-5 bg-white rounded-3 shadow-sm-xl w-100 mw-100">
                            <h5 className="fw-medium">İzin Talebini Onayla</h5>

                            <p className="mb-4 text-dark">
                                <strong>{getEmployeeName(selectedRequest?.employee_id)}</strong> çalışanının{' '}
                                <strong>{getLeaveTypeName(selectedRequest?.leave_type_id)}</strong> iznine {' '}
                                <strong>{new Date(selectedRequest?.start_date).toLocaleDateString('tr-TR')}</strong> - {' '}
                                <strong>{new Date(selectedRequest?.end_date).toLocaleDateString('tr-TR')}</strong> tarihleri arasında izin talebini onaylamak istiyor musunuz?
                            </p>

                            <div className="mb-4">
                                <label className="d-block text-dark fs-sm fw-medium mb-1">Yorum (İsteğe Bağlı)</label>
                                <textarea className="form-control"
                                    value={approverComment}
                                    onChange={(e) => setApproverComment(e.target.value)}
                                    rows="3"
                                />
                            </div>

                            <div className="d-flex justify-content-end space-x-2 mt-6">
                                <button
                                    onClick={() => {
                                        setShowApproveModal(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-2 bg-gray-500 border border-transparent rounded fw-semibold fs-xs text-white text-uppercase tracking-widest hover:bg-gray-400 active:bg-gray-600 focus:outline-none focus: focus:  -out"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={confirmApprove}
                                    className="btn btn-success btn-sm"
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
        header={<div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-medium text-dark">İzin Talepleri</h5>
            <button
                onClick={() => document.dispatchEvent(new CustomEvent('openLeaveRequestModal'))}
                className="btn btn-primary btn-sm ms-auto"
            >
                Yeni İzin Talebi
            </button>
        </div>}
    />;
