import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LeaveEntitlements({ entitlements: initialEntitlements, employees: initialEmployees, leaveTypes: initialLeaveTypes, filters: initialFilters }) {
    // usePage props fallback - server-side rendering için
    const { props } = usePage();
    const pageProps = props || {};
    const [entitlements, setEntitlements] = useState(initialEntitlements || []);
    const [employees, setEmployees] = useState(initialEmployees || []);
    const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes || []);
    const [filters, setFilters] = useState(initialFilters || { employee_id: '', year: new Date().getFullYear() });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: '',
        leave_type_id: '',
        entitled_days: 0,
        used_days: 0,
        calculation_year_start: '',
        accrual_date: '',
        can_carry_over: true,
        max_carry_over_days: 0
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (initialEntitlements) setEntitlements(initialEntitlements);
        if (initialEmployees) setEmployees(initialEmployees);
        if (initialLeaveTypes) setLeaveTypes(initialLeaveTypes);
        if (initialFilters) setFilters(initialFilters);

        // Listen for custom event to open modal
        const handleOpenModal = () => {
            setFormData({
                employee_id: '',
                leave_type_id: '',
                entitled_days: 0,
                used_days: 0,
                calculation_year_start: '',
                accrual_date: '',
                can_carry_over: true,
                max_carry_over_days: 0
            });
            setEditingId(null);
            setShowModal(true);
        };

        document.addEventListener('openLeaveEntitlementModal', handleOpenModal);

        return () => {
            document.removeEventListener('openLeaveEntitlementModal', handleOpenModal);
        };
    }, [initialEntitlements, initialEmployees, initialLeaveTypes, initialFilters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            router.put(`/admin/leave/entitlements/${editingId}`, formData);
        } else {
            router.post('/admin/leave/entitlements', formData);
        }

        resetForm();
    };

    const handleEdit = (entitlement) => {
        setFormData({
            employee_id: entitlement.employee_id,
            leave_type_id: entitlement.leave_type_id,
            entitled_days: entitlement.entitled_days,
            used_days: entitlement.used_days,
            calculation_year_start: entitlement.calculation_year_start,
            accrual_date: entitlement.accrual_date,
            can_carry_over: entitlement.can_carry_over,
            max_carry_over_days: entitlement.max_carry_over_days
        });
        setEditingId(entitlement.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Bu izin hakkını silmek istediğinize emin misiniz?')) {
            router.delete(`/admin/leave/entitlements/${id}`);
        }
    };

    const resetForm = () => {
        setFormData({
            employee_id: '',
            leave_type_id: '',
            entitled_days: 0,
            used_days: 0,
            calculation_year_start: '',
            accrual_date: '',
            can_carry_over: true,
            max_carry_over_days: 0
        });
        setEditingId(null);
        setShowModal(false);
    };

    const handleApplyFilters = () => {
        router.get('/admin/leave/entitlements', filters, {
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

    return (
        <div className="py-12">
            <div className="mw-100 mx-auto">
                <div className="bg-white rounded-3 shadow-sm">  {/* No p-4 as required */}


                    <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                        <form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }} className="d-flex d-flex-wrap gap-3 align-items-end">
                            <div className="d-flex-1 min-w-[200px]">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Çalışan</label>
                                <select className="form-control" value={filters.employee_id}
                                    onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {(employees || []).map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-40">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">Yıl</label>
                                <select className="form-control" value={filters.year}
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
                                    className="btn btn-success btn-sm"
                                >
                                    Filtrele
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden">
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Çalışan</th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">İzin Türü</th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Hakedilen Gün</th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Kullanılan Gün</th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Kalan Gün</th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">Hesaplanan Yıl</th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(entitlements || []).map((entitlement) => (
                                        <tr key={entitlement.id} className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm text-dark">{getEmployeeName(entitlement.employee_id)}</td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-dark">{getLeaveTypeName(entitlement.leave_type_id)}</td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-dark">{entitlement.entitled_days}</td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-muted">{entitlement.used_days}</td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-muted">
                                                <span className={`px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill ${
                                                    (entitlement.entitled_days - entitlement.used_days) > 10
                                                        ? 'bg-success bg-opacity-10 text-success'
                                                        : 'bg-warning bg-opacity-10 text-warning'
                                                }`}>
                                                    {entitlement.entitled_days - entitlement.used_days}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-muted">{new Date(entitlement.calculation_year_start).getFullYear()}</td>
                                            <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                                <button
                                                    onClick={() => handleEdit(entitlement)}
                                                    className="text-primary hover:text-indigo-900 mr-4"
                                                >
                                                    Güncelle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(entitlement.id)}
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
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="position-fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-100 w-100 d-flex align-items-center justify-content-center">
                        <div className="position-relative p-5 bg-white rounded-3 shadow-sm-xl w-100 mw-100">
                            <h5 className="fw-medium">{editingId ? 'İzin Hakkı Düzenle' : 'Yeni İzin Hakkı Ekle'}</h5>

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
                                        <select className="form-control" value={formData.leave_type_id}
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
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Hakedilen Gün</label>
                                        <input type="number" className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" min="1"
                                            max="365"
                                            value={formData.entitled_days}
                                            onChange={(e) => setFormData({...formData, entitled_days: parseInt(e.target.value)}) || 0}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Kullanılan Gün</label>
                                        <input type="number" className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" min="0"
                                            max={formData.entitled_days}
                                            value={formData.used_days}
                                            onChange={(e) => setFormData({...formData, used_days: parseInt(e.target.value)}) || 0}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Hesap Yılı Başlangıcı</label>
                                        <input type="date" className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"  
                                            value={formData.calculation_year_start}
                                            onChange={(e) => setFormData({...formData, calculation_year_start: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="d-block text-dark fs-sm fw-medium mb-1">Hak Kazanma Tarihi</label>
                                        <input type="date" className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"  
                                            value={formData.accrual_date}
                                            onChange={(e) => setFormData({...formData, accrual_date: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-secondary text-primary shadow-sm-sm focus:border-indigo-300 focus:ring focus: focus:"
                                                checked={formData.can_carry_over}
                                                onChange={(e) => setFormData({...formData, can_carry_over: e.target.checked})}
                                            />
                                            <span className="ml-2 fs-sm fw-medium text-dark">Devredilebilir</span>
                                        </label>
                                    </div>

                                    {formData.can_carry_over && (
                                        <div className="mb-4">
                                            <label className="d-block text-dark fs-sm fw-medium mb-1">Maks. Devir Günü</label>
                                            <input type="number" className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" min="0"
                                                max="365"
                                                value={formData.max_carry_over_days}
                                                onChange={(e) => setFormData({...formData, max_carry_over_days: parseInt(e.target.value)}) || 0}
                                                required
                                            />
                                        </div>
                                    )}
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

LeaveEntitlements.layout = page =>
    <AuthenticatedLayout
        children={page}
        header={<div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-medium text-dark">İzin Hakları</h5>
            <button
                onClick={() => document.dispatchEvent(new CustomEvent('openLeaveEntitlementModal'))}
                className="btn btn-primary btn-sm ms-auto"
            >
                Yeni İzin Hakkı
            </button>
        </div>}
    />;
