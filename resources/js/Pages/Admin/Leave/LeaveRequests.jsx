import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError, confirmDelete } from '@/Utils/sweetAlert';

export default function LeaveRequests({ leaveRequests, employees, leaveTypes, filters }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState('');
    const [localFilters, setLocalFilters] = useState({
        employee_id: filters?.employee_id || '',
        status: filters?.status || '',
        year: filters?.year || new Date().getFullYear(),
    });
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

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.leave.requests.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            router.put(route('admin.leave.requests.update', editingId), formData, {
                onSuccess: () => {
                    showSuccess('İzin talebi güncellendi.');
                    resetForm();
                },
                onError: () => showError('Güncelleme başarısız.')
            });
        } else {
            router.post(route('admin.leave.requests.store'), formData, {
                onSuccess: () => {
                    showSuccess('İzin talebi oluşturuldu.');
                    resetForm();
                },
                onError: () => showError('Oluşturma başarısız.')
            });
        }
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
        confirmDelete('Bu izin talebini silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.leave.requests.destroy', id), {
                onSuccess: () => showSuccess('İzin talebi silindi.')
            });
        });
    };

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setShowApproveModal(true);
    };

    const confirmApprove = () => {
        router.put(route('admin.leave.requests.update', selectedRequest.id), {
            status: 'approved',
            approval_comment: approverComment
        }, {
            onSuccess: () => {
                showSuccess('İzin talebi onaylandı.');
                setShowApproveModal(false);
                setApproverComment('');
                setSelectedRequest(null);
            }
        });
    };

    const handleReject = (request) => {
        const rejectionReason = prompt('Reddetme gerekçesini belirtin:');
        if (rejectionReason) {
            router.put(route('admin.leave.requests.update', request.id), {
                status: 'rejected',
                rejection_reason: rejectionReason
            }, {
                onSuccess: () => showSuccess('İzin talebi reddedildi.')
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

    const getEmployeeName = (employeeId) => {
        const employee = employees?.find(emp => emp.id === employeeId);
        return employee ? `${employee.first_name} ${employee.last_name}` : 'Bulunamadı';
    };

    const getLeaveTypeName = (typeId) => {
        const type = leaveTypes?.find(t => t.id === typeId);
        return type ? type.name : 'Bulunamadı';
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'approved': return 'bg-success';
            case 'rejected': return 'bg-danger';
            case 'cancelled': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Beklemede';
            case 'approved': return 'Onaylandı';
            case 'rejected': return 'Reddedildi';
            case 'cancelled': return 'İptal Edildi';
            default: return status;
        }
    };

    // İstatistikler - leaveRequests array kontrolü
    const leaveRequestsArray = Array.isArray(leaveRequests) ? leaveRequests : (leaveRequests?.data || []);
    
    const stats = {
        total: leaveRequestsArray.length || 0,
        pending: leaveRequestsArray.filter(r => r.status === 'pending').length || 0,
        approved: leaveRequestsArray.filter(r => r.status === 'approved').length || 0,
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'İzin Talepleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İzin Yönetimi', url: '#' },
                    { label: 'İzin Talepleri', url: route('admin.leave.requests.index') },
                ],
                newUrl: '#',
                filterCollapse: true,
            }}
        >
            <Head title="İzin Talepleri" />

            {/* Collapse Filtre Paneli */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-user me-1"></i> Çalışan
                                </label>
                                <select
                                    className="form-select"
                                    value={localFilters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {(employees || []).map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-toggle-right me-1"></i> Durum
                                </label>
                                <select
                                    className="form-select"
                                    value={localFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    <option value="pending">Beklemede</option>
                                    <option value="approved">Onaylandı</option>
                                    <option value="rejected">Reddedildi</option>
                                    <option value="cancelled">İptal Edildi</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-medium">
                                    <i className="ti ti-calendar me-1"></i> Yıl
                                </label>
                                <select
                                    className="form-select"
                                    value={localFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                >
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </select>
                            </div>

                            <div className="col-md-2 d-flex align-items-end">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="btn btn-primary w-100"
                                >
                                    <i className="ti ti-plus me-1"></i> Yeni Talep
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <i className="ti ti-calendar fs-2 text-primary mb-2"></i>
                            <h6 className="text-primary fw-medium">Toplam Talep</h6>
                            <h3 className="fw-bold text-primary">{stats.total}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <i className="ti ti-clock fs-2 text-warning mb-2"></i>
                            <h6 className="text-warning fw-medium">Bekleyen</h6>
                            <h3 className="fw-bold text-warning">{stats.pending}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-check fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Onaylanan</h6>
                            <h3 className="fw-bold text-success">{stats.approved}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Talepler Tablosu */}
            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-calendar-event me-2"></i> İzin Talepleri Listesi
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Çalışan</th>
                                    <th className="fw-medium">İzin Türü</th>
                                    <th className="fw-medium">Başlangıç</th>
                                    <th className="fw-medium">Bitiş</th>
                                    <th className="fw-medium text-center">Yarım Gün</th>
                                    <th className="fw-medium text-center">Durum</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(leaveRequestsArray || []).length > 0 ? (
                                    leaveRequestsArray.map((request) => (
                                        <tr key={request.id}>
                                            <td>
                                                <div className="fw-medium">{getEmployeeName(request.employee_id)}</div>
                                            </td>
                                            <td>
                                                <div className="fw-medium">{getLeaveTypeName(request.leave_type_id)}</div>
                                            </td>
                                            <td>
                                                <div className="fw-medium">{new Date(request.start_date).toLocaleDateString('tr-TR')}</div>
                                            </td>
                                            <td>
                                                <div className="fw-medium">{new Date(request.end_date).toLocaleDateString('tr-TR')}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${request.is_half_day ? 'bg-primary' : 'bg-light text-dark'}`}>
                                                    {request.is_half_day ? 'Evet' : 'Hayır'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                                                    {getStatusLabel(request.status)}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(request)}
                                                                className="btn btn-sm btn-outline-success"
                                                                title="Onayla"
                                                            >
                                                                <i className="ti ti-check"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request)}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Reddet"
                                                            >
                                                                <i className="ti ti-x"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    {(request.status === 'pending' || request.status === 'cancelled') && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEdit(request)}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="Düzenle"
                                                            >
                                                                <i className="ti ti-edit"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(request.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Sil"
                                                            >
                                                                <i className="ti ti-trash"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            <i className="ti ti-calendar-off fs-1 d-block mb-2"></i>
                                            İzin talebi bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    {editingId ? 'İzin Talebi Düzenle' : 'Yeni İzin Talebi'}
                                </h5>
                                <button type="button" className="btn-close" onClick={resetForm}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Çalışan <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                value={formData.employee_id}
                                                onChange={(e) => setFormData({ ...formData, employee_id: parseInt(e.target.value) })}
                                                required
                                            >
                                                <option value="">Seçin...</option>
                                                {(employees || []).map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">İzin Türü <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                value={formData.leave_type_id}
                                                onChange={(e) => setFormData({ ...formData, leave_type_id: parseInt(e.target.value) })}
                                                required
                                            >
                                                <option value="">Seçin...</option>
                                                {(leaveTypes || []).map(type => (
                                                    <option key={type.id} value={type.id}>{type.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Başlangıç Tarihi <span className="text-danger">*</span></label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.start_date}
                                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Bitiş Tarihi <span className="text-danger">*</span></label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.end_date}
                                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-medium">Açıklama</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={formData.reason}
                                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="is_half_day"
                                                    checked={formData.is_half_day}
                                                    onChange={(e) => setFormData({ ...formData, is_half_day: e.target.checked })}
                                                />
                                                <label className="form-check-label" htmlFor="is_half_day">Yarım Gün</label>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="requires_hr_approval"
                                                    checked={formData.requires_hr_approval}
                                                    onChange={(e) => setFormData({ ...formData, requires_hr_approval: e.target.checked })}
                                                />
                                                <label className="form-check-label" htmlFor="requires_hr_approval">İK Onayı Gerekiyor</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" onClick={resetForm}>İptal</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    {editingId ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {showApproveModal && selectedRequest && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">İzin Talebini Onayla</h5>
                                <button type="button" className="btn-close" onClick={() => setShowApproveModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <strong>{getEmployeeName(selectedRequest.employee_id)}</strong> çalışanının{' '}
                                    <strong>{getLeaveTypeName(selectedRequest.leave_type_id)}</strong> izni talebini{' '}
                                    <strong>{new Date(selectedRequest.start_date).toLocaleDateString('tr-TR')}</strong> - {' '}
                                    <strong>{new Date(selectedRequest.end_date).toLocaleDateString('tr-TR')}</strong> tarihleri arasında onaylamak istiyor musunuz?
                                </p>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Yorum (İsteğe Bağlı)</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={approverComment}
                                        onChange={(e) => setApproverComment(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" onClick={() => setShowApproveModal(false)}>İptal</button>
                                <button type="button" className="btn btn-success" onClick={confirmApprove}>Onayla</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
