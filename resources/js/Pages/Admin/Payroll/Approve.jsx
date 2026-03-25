import { useState } from 'react';
import { router, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError, confirmDelete } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency, formatMoney } from '@/Utils/formatters';
import { calculateNetSalary } from '@/Utils/payrollCalculations';

/**
 * Bordro onay akışı
 * GET /admin/payrolls/{id}/approve
 */
export default function Approve({ period, employees, approvalHistory, approvers }) {
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [approvalNote, setApprovalNote] = useState('');
    const [processing, setProcessing] = useState(false);

    // Çalışan seçme
    const toggleEmployee = (employeeId) => {
        setSelectedEmployees(prev => 
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(emp => emp.id));
        }
    };

    // Bordro hesapla
    const calculateEmployeePayroll = (employee) => {
        const calculation = calculateNetSalary(employee.gross_salary, {
            maritalStatus: employee.marital_status,
            childrenCount: employee.children_count,
            mealAllowance: employee.meal_allowance || 0,
            transportAllowance: employee.transport_allowance || 0,
            housingAllowance: employee.housing_allowance || 0,
        });
        return calculation;
    };

    // Toplamlar
    const totals = employees.reduce((acc, emp) => {
        const calc = calculateEmployeePayroll(emp);
        return {
            gross: acc.gross + calc.gross,
            net: acc.net + calc.net,
            count: acc.count + 1,
        };
    }, { gross: 0, net: 0, count: 0 });

    // Onayla
    const handleApprove = async () => {
        if (selectedEmployees.length === 0) {
            showError('Lütfen en az bir çalışan seçin.');
            return;
        }

        setProcessing(true);

        try {
            const response = await router.post(route('admin.payrolls.approve', period.id), {
                employee_ids: selectedEmployees,
                note: approvalNote,
            });

            showSuccess('Bordro onaylandı.');
            router.reload();
        } catch (error) {
            showError('Onaylama sırasında hata oluştu.');
        } finally {
            setProcessing(false);
        }
    };

    // Reddet
    const handleReject = async (employeeId) => {
        confirmDelete('Bu çalışanın bordrosunu reddetmek istediğinize emin misiniz?', async () => {
            try {
                await router.post(route('admin.payrolls.rejectEmployee', {
                    payroll: period.id,
                    employee: employeeId
                }), {
                    note: 'Bordro reddedildi.',
                });
                showSuccess('Bordro reddedildi.');
                router.reload();
            } catch (error) {
                showError('Reddetme sırasında hata oluştu.');
            }
        });
    };

    // Tamamını onayla
    const handleApproveAll = async () => {
        confirmDelete('Tüm çalışanların bordrosunu onaylamak istediğinize emin misiniz?', async () => {
            setProcessing(true);
            try {
                await router.post(route('admin.payrolls.approveAll', period.id));
                showSuccess('Tüm bordrolar onaylandı.');
                router.reload();
            } catch (error) {
                showError('Onaylama sırasında hata oluştu.');
            } finally {
                setProcessing(false);
            }
        });
    };

    // Onay durumu badge
    const getApprovalStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Beklemede', class: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Onaylandı', class: 'bg-green-100 text-green-800' },
            rejected: { label: 'Reddedildi', class: 'bg-red-100 text-red-800' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.payrolls.show', period.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
                            title="Geri"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Bordro Onayı
                            </h2>
                            <p className="text-sm text-gray-500">
                                {period.name} - {formatDate(period.start_date)} / {formatDate(period.end_date)}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Bordro Onayı" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Özet */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Toplam Çalışan</div>
                            <div className="text-2xl font-bold text-gray-900">{totals.count}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Toplam Brüt</div>
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totals.gross)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Toplam Net</div>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.net)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Çalışan Listesi */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Çalışan Listesi</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        {selectedEmployees.length === employees.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees.length === employees.length && employees.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="rounded border-gray-300"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Çalışan
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Brüt
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Net
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Durum
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                İşlem
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employees.map((employee) => {
                                            const calc = calculateEmployeePayroll(employee);
                                            return (
                                                <tr key={employee.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmployees.includes(employee.id)}
                                                            onChange={() => toggleEmployee(employee.id)}
                                                            disabled={employee.approval_status === 'approved'}
                                                            className="rounded border-gray-300"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {employee.position_title}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {formatCurrency(calc.gross)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                        {formatCurrency(calc.net)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {getApprovalStatusBadge(employee.approval_status)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {employee.approval_status === 'pending' && (
                                                            <button
                                                                onClick={() => handleReject(employee.id)}
                                                                className="text-red-600 hover:text-red-800 text-sm"
                                                            >
                                                                Reddet
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Onay Paneli */}
                        <div className="space-y-6">
                            {/* Onay Formu */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Onayla</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Seçili Çalışan
                                        </label>
                                        <div className="text-2xl font-bold text-indigo-600">
                                            {selectedEmployees.length} / {employees.length}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Not (Opsiyonel)
                                        </label>
                                        <textarea
                                            value={approvalNote}
                                            onChange={(e) => setApprovalNote(e.target.value)}
                                            rows={3}
                                            placeholder="Onay notu..."
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={handleApprove}
                                            disabled={processing || selectedEmployees.length === 0}
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Seçili Onayla ({selectedEmployees.length})
                                        </button>
                                        
                                        <button
                                            onClick={handleApproveAll}
                                            disabled={processing}
                                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            Tamamını Onayla
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Onay Geçmişi */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Onay Geçmişi</h3>
                                
                                {approvalHistory?.length > 0 ? (
                                    <div className="space-y-3">
                                        {approvalHistory.map((item, index) => (
                                            <div key={index} className="border-l-2 border-indigo-500 pl-3 py-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {item.approver_name}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        item.action === 'approved' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item.action === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDate(item.created_at)}
                                                </div>
                                                {item.note && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {item.note}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Henüz onay geçmişi yok.</p>
                                )}
                            </div>

                            {/* Onay Yetkilileri */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Onay Sırası</h3>
                                
                                <div className="space-y-2">
                                    {approvers.map((approver, index) => (
                                        <div key={approver.id} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {approver.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {approver.role}
                                                </div>
                                            </div>
                                            {approver.status === 'approved' && (
                                                <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
