import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError, confirmDelete } from '@/Utils/sweetAlert';

export default function LeaveEntitlements({ entitlements, employees, leaveTypes, filters }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState('');
    const [localFilters, setLocalFilters] = useState({
        employee_id: filters?.employee_id || '',
        year: filters?.year || new Date().getFullYear(),
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.leave.entitlements.index'), newFilters, { replace: true });
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees?.find(emp => emp.id === employeeId);
        return employee ? `${employee.first_name} ${employee.last_name}` : 'Bulunamadı';
    };

    const getLeaveTypeName = (typeId) => {
        const type = leaveTypes?.find(t => t.id === typeId);
        return type ? type.name : 'Bulunamadı';
    };

    // Toplam istatistikler - array kontrolü
    const entitlementsArray = Array.isArray(entitlements) ? entitlements : (entitlements?.data || []);
    const totalEntitled = entitlementsArray.reduce((sum, e) => sum + (e.entitled_days || 0), 0) || 0;
    const totalUsed = entitlementsArray.reduce((sum, e) => sum + (e.used_days || 0), 0) || 0;
    const totalRemaining = totalEntitled - totalUsed;

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'İzin Hakları',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İzin Yönetimi', url: '#' },
                    { label: 'İzin Hakları', url: route('admin.leave.entitlements.index') },
                ],
                newUrl: route('admin.leave.entitlements.create'),
                filterCollapse: true,
            }}
        >
            <Head title="İzin Hakları" />

            {/* Collapse Filtre Paneli */}
            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-5">
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

                            <div className="col-md-4">
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

                            <div className="col-md-3 d-flex align-items-end">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="btn btn-primary w-100"
                                >
                                    <i className="ti ti-plus me-1"></i> Yeni Hak
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
                            <h6 className="text-primary fw-medium">Toplam Hak</h6>
                            <h3 className="fw-bold text-primary">{totalEntitled}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <i className="ti ti-clock fs-2 text-warning mb-2"></i>
                            <h6 className="text-warning fw-medium">Kullanılan</h6>
                            <h3 className="fw-bold text-warning">{totalUsed}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-check fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Kalan</h6>
                            <h3 className="fw-bold text-success">{totalRemaining}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Haklar Tablosu */}
            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-clipboard-list me-2"></i> İzin Hakları Listesi
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Çalışan</th>
                                    <th className="fw-medium">İzin Türü</th>
                                    <th className="fw-medium text-center">Hakedilen</th>
                                    <th className="fw-medium text-center">Kullanılan</th>
                                    <th className="fw-medium text-center">Kalan</th>
                                    <th className="fw-medium text-center">Yıl</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(entitlementsArray || []).length > 0 ? (
                                    entitlementsArray.map((entitlement) => {
                                        const remaining = entitlement.entitled_days - entitlement.used_days;
                                        return (
                                            <tr key={entitlement.id}>
                                                <td>
                                                    <div className="fw-medium">{getEmployeeName(entitlement.employee_id)}</div>
                                                </td>
                                                <td>
                                                    <div className="fw-medium">{getLeaveTypeName(entitlement.leave_type_id)}</div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge bg-primary">{entitlement.entitled_days}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge bg-warning text-dark">{entitlement.used_days}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge ${remaining > 10 ? 'bg-success' : 'bg-danger'}`}>
                                                        {remaining}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    {new Date(entitlement.calculation_year_start).getFullYear()}
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-1">
                                                        <button
                                                            onClick={() => handleEdit(entitlement)}
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Düzenle"
                                                        >
                                                            <i className="ti ti-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(entitlement.id)}
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Sil"
                                                        >
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            <i className="ti ti-clipboard-off fs-1 d-block mb-2"></i>
                                            İzin hakkı bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
