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
            pending: { label: 'Beklemede', class: 'bg-warning bg-opacity-10 text-warning' },
            approved: { label: 'Onaylandı', class: 'bg-success bg-opacity-10 text-success' },
            rejected: { label: 'Reddedildi', class: 'bg-danger bg-opacity-10 text-danger' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-light text-dark' };
        
        return (
            <span className={`px-2 py-1 fs-xs fw-medium rounded-pill ${config.class}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <Link
                            href={route('admin.payrolls.show', period.id)}
                            className="p-2 text-muted hover:text-dark hover:bg-light rounded"
                            title="Geri"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h5 className="fw-semibold">
                                Bordro Onayı
                            </h5>
                            <p className="fs-sm text-muted">
                                {period.name} - {formatDate(period.start_date)} / {formatDate(period.end_date)}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Bordro Onayı" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Özet */}
                    <div className="d-grid d-grid-cols-1 gap-3 mb-5">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Toplam Çalışan</div>
                            <div className="fs-2 fw-bold text-dark">{totals.count}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Toplam Brüt</div>
                            <div className="fs-2 fw-bold text-dark">{formatCurrency(totals.gross)}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Toplam Net</div>
                            <div className="fs-2 fw-bold text-success">{formatCurrency(totals.net)}</div>
                        </div>
                    </div>

                    <div className="d-grid d-grid-cols-1 gap-4">
                        {/* Çalışan Listesi */}
                        <div className="bg-white rounded-3 shadow-sm">
                            <div className="p-4 border-b border-secondary d-flex justify-content-between align-items-center">
                                <h5 className="fw-semibold">Çalışan Listesi</h5>
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="fs-sm text-primary hover:text-indigo-800"
                                    >
                                        {selectedEmployees.length === employees.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-auto">
                                <table className="w-100 divide-y divide-gray-200">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees.length === employees.length && employees.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="rounded border-secondary"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                                Çalışan
                                            </th>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                                Brüt
                                            </th>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                                Net
                                            </th>
                                            <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                                Durum
                                            </th>
                                            <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">
                                                İşlem
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employees.map((employee) => {
                                            const calc = calculateEmployeePayroll(employee);
                                            return (
                                                <tr key={employee.id} className="hover:table-light">
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmployees.includes(employee.id)}
                                                            onChange={() => toggleEmployee(employee.id)}
                                                            disabled={employee.approval_status === 'approved'}
                                                            className="rounded border-secondary"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="fs-sm fw-medium text-dark">
                                                            {employee.name}
                                                        </div>
                                                        <div className="fs-xs text-muted">
                                                            {employee.position_title}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 fs-sm text-dark">
                                                        {formatCurrency(calc.gross)}
                                                    </td>
                                                    <td className="px-4 py-3 fs-sm fw-medium text-dark">
                                                        {formatCurrency(calc.net)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {getApprovalStatusBadge(employee.approval_status)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {employee.approval_status === 'pending' && (
                                                            <button
                                                                onClick={() => handleReject(employee.id)}
                                                                className="text-danger hover:text-danger fs-sm"
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
                        <div className="mb-3">
                            {/* Onay Formu */}
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h5 className="fw-semibold">Onayla</h5>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Seçili Çalışan
                                        </label>
                                        <div className="fs-2 fw-bold text-primary">
                                            {selectedEmployees.length} / {employees.length}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Not (Opsiyonel)
                                        </label>
                                        <textarea value={approvalNote}
                                            onChange={(e) => setApprovalNote(e.target.value)}
                                            rows={3}
                                            placeholder="Onay notu..."
                                            className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="d-flex d-flex-column gap-2">
                                        <button
                                            onClick={handleApprove}
                                            disabled={processing || selectedEmployees.length === 0}
                                            className="btn btn-success btn-sm w-100 disabled:opacity-50"
                                        >
                                            Seçili Onayla ({selectedEmployees.length})
                                        </button>
                                        
                                        <button
                                            onClick={handleApproveAll}
                                            disabled={processing}
                                            className="btn btn-primary btn-sm w-100 disabled:opacity-50"
                                        >
                                            Tamamını Onayla
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Onay Geçmişi */}
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h5 className="fw-semibold">Onay Geçmişi</h5>
                                
                                {approvalHistory?.length > 0 ? (
                                    <div className="space-y-3">
                                        {approvalHistory.map((item, index) => (
                                            <div key={index} className="border-l-2 border-indigo-500 pl-3 py-1">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="fs-sm fw-medium text-dark">
                                                        {item.approver_name}
                                                    </span>
                                                    <span className={`px-2 py-0.5 fs-xs rounded-pill ${
                                                        item.action === 'approved' 
                                                            ? 'bg-success bg-opacity-10 text-success' 
                                                            : 'bg-danger bg-opacity-10 text-danger'
                                                    }`}>
                                                        {item.action === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                                    </span>
                                                </div>
                                                <div className="fs-xs text-muted">
                                                    {formatDate(item.created_at)}
                                                </div>
                                                {item.note && (
                                                    <div className="fs-sm text-muted mt-1">
                                                        {item.note}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="fs-sm text-muted">Henüz onay geçmişi yok.</p>
                                )}
                            </div>

                            {/* Onay Yetkilileri */}
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h5 className="fw-semibold">Onay Sırası</h5>
                                
                                <div className="space-y-2">
                                    {approvers.map((approver, index) => (
                                        <div key={approver.id} className="d-flex align-items-center gap-2">
                                            <div className="w-6 h-6 rounded-pill bg-indigo-100 text-primary d-flex align-items-center justify-content-center fs-xs fw-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="fs-sm fw-medium text-dark">
                                                    {approver.name}
                                                </div>
                                                <div className="fs-xs text-muted">
                                                    {approver.role}
                                                </div>
                                            </div>
                                            {approver.status === 'approved' && (
                                                <svg className="w-5 h-5 text-success ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
