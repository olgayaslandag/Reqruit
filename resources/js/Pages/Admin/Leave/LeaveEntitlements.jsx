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
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">  {/* No p-6 as required */}


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
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İzin Türü</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hakedilen Gün</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanılan Gün</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kalan Gün</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesaplanan Yıl</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(entitlements || []).map((entitlement) => (
                                        <tr key={entitlement.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getEmployeeName(entitlement.employee_id)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLeaveTypeName(entitlement.leave_type_id)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entitlement.entitled_days}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entitlement.used_days}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    (entitlement.entitled_days - entitlement.used_days) > 10
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {entitlement.entitled_days - entitlement.used_days}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entitlement.calculation_year_start).getFullYear()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(entitlement)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Güncelle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(entitlement.id)}
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
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                        <div className="relative p-5 bg-white rounded-lg shadow-xl w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">{editingId ? 'İzin Hakkı Düzenle' : 'Yeni İzin Hakkı Ekle'}</h3>

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
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Hakedilen Gün</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.entitled_days}
                                            onChange={(e) => setFormData({...formData, entitled_days: parseInt(e.target.value)}) || 0}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Kullanılan Gün</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={formData.entitled_days}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.used_days}
                                            onChange={(e) => setFormData({...formData, used_days: parseInt(e.target.value)}) || 0}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Hesap Yılı Başlangıcı</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.calculation_year_start}
                                            onChange={(e) => setFormData({...formData, calculation_year_start: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Hak Kazanma Tarihi</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.accrual_date}
                                            onChange={(e) => setFormData({...formData, accrual_date: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4 col-span-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                checked={formData.can_carry_over}
                                                onChange={(e) => setFormData({...formData, can_carry_over: e.target.checked})}
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Devredilebilir</span>
                                        </label>
                                    </div>

                                    {formData.can_carry_over && (
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-1">Maks. Devir Günü</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="365"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                value={formData.max_carry_over_days}
                                                onChange={(e) => setFormData({...formData, max_carry_over_days: parseInt(e.target.value)}) || 0}
                                                required
                                            />
                                        </div>
                                    )}
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

LeaveEntitlements.layout = page =>
    <AuthenticatedLayout
        children={page}
        header={<div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">İzin Hakları</h2>
            <button
                onClick={() => document.dispatchEvent(new CustomEvent('openLeaveEntitlementModal'))}
                className="ml-3 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
                Yeni İzin Hakkı
            </button>
        </div>}
    />;
