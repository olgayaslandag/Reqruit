import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency } from '@/Utils/formatters';

export default function Approve({ period, employees, approvalHistory, approvers }) {
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [approvalNote, setApprovalNote] = useState('');
    const [processing, setProcessing] = useState(false);

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

    // Basit hesaplama
    const calculateEmployeePayroll = (employee) => {
        const gross = parseFloat(employee.gross_salary) || 0;
        const net = gross * 0.66; // Basitleştirilmiş net hesaplama
        return { gross, net };
    };

    const totals = employees.reduce((acc, emp) => {
        const calc = calculateEmployeePayroll(emp);
        return {
            gross: acc.gross + calc.gross,
            net: acc.net + calc.net,
            count: acc.count + 1,
        };
    }, { gross: 0, net: 0, count: 0 });

    const handleApprove = async () => {
        if (selectedEmployees.length === 0) {
            showError('Lütfen en az bir çalışan seçin.');
            return;
        }

        setProcessing(true);

        try {
            await router.post(route('admin.payrolls.approve', period.id), {
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

    const getApprovalStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'approved': return 'bg-success';
            case 'rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const getApprovalStatusLabel = (status) => {
        const labels = {
            pending: 'Beklemede',
            approved: 'Onaylandı',
            rejected: 'Reddedildi',
        };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Bordro Onayı',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Bordro Dönemleri', url: route('admin.payrolls.index') },
                    { label: period.name, url: route('admin.payrolls.show', period.id) },
                    { label: 'Onay', url: route('admin.payrolls.approve', period.id) },
                ],
                backUrl: route('admin.payrolls.show', period.id),
            }}
        >
            <Head title="Bordro Onayı" />

            {/* Özet Kartları */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <i className="ti ti-users fs-2 text-primary mb-2"></i>
                            <h6 className="text-primary fw-medium">Toplam Çalışan</h6>
                            <h3 className="fw-bold text-primary">{totals.count}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-coin fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Toplam Brüt</h6>
                            <h4 className="fw-bold text-success">{formatCurrency(totals.gross)}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <i className="ti ti-wallet fs-2 text-info mb-2"></i>
                            <h6 className="text-info fw-medium">Toplam Net</h6>
                            <h4 className="fw-bold text-info">{formatCurrency(totals.net)}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Çalışan Listesi */}
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-users me-2"></i> Çalışan Listesi
                            </h5>
                            <button
                                onClick={toggleSelectAll}
                                className="btn btn-outline-secondary btn-sm"
                            >
                                {selectedEmployees.length === employees.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees.length === employees.length && employees.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="form-check-input"
                                                />
                                            </th>
                                            <th>Çalışan</th>
                                            <th className="text-end">Brüt</th>
                                            <th className="text-end">Net</th>
                                            <th className="text-center">Durum</th>
                                            <th className="text-end">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((employee) => {
                                            const calc = calculateEmployeePayroll(employee);
                                            return (
                                                <tr key={employee.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmployees.includes(employee.id)}
                                                            onChange={() => toggleEmployee(employee.id)}
                                                            disabled={employee.approval_status === 'approved'}
                                                            className="form-check-input"
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="fw-medium">{employee.name}</div>
                                                        <small className="text-muted">{employee.position_title}</small>
                                                    </td>
                                                    <td className="text-end">{formatCurrency(calc.gross)}</td>
                                                    <td className="text-end fw-medium">{formatCurrency(calc.net)}</td>
                                                    <td className="text-center">
                                                        <span className={`badge ${getApprovalStatusBadgeClass(employee.approval_status)}`}>
                                                            {getApprovalStatusLabel(employee.approval_status)}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        {employee.approval_status === 'pending' && (
                                                            <button
                                                                onClick={() => handleReject(employee.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                            >
                                                                <i className="ti ti-x"></i>
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
                    </div>
                </div>

                {/* Sağ Panel */}
                <div className="col-lg-4">
                    {/* Onay Formu */}
                    <div className="card border-success mb-4">
                        <div className="card-header bg-success text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-check me-1"></i> Onayla
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Seçili Çalışan</label>
                                <div className="fs-3 fw-bold text-primary">
                                    {selectedEmployees.length} / {employees.length}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Not (Opsiyonel)</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={approvalNote}
                                    onChange={(e) => setApprovalNote(e.target.value)}
                                    placeholder="Onay notu..."
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    onClick={handleApprove}
                                    disabled={processing || selectedEmployees.length === 0}
                                    className="btn btn-success"
                                >
                                    {processing ? (
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                    ) : (
                                        <i className="ti ti-check me-1"></i>
                                    )}
                                    Seçili Onayla ({selectedEmployees.length})
                                </button>
                                
                                <button
                                    onClick={handleApproveAll}
                                    disabled={processing}
                                    className="btn btn-outline-primary"
                                >
                                    <i className="ti ti-checks me-1"></i> Tamamını Onayla
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Onay Geçmişi */}
                    <div className="card border-info mb-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-history me-1"></i> Onay Geçmişi
                            </h6>
                        </div>
                        <div className="card-body">
                            {approvalHistory?.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {approvalHistory.map((item, index) => (
                                        <div key={index} className="list-group-item px-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium">{item.approver_name}</span>
                                                <span className={`badge ${item.action === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                                                    {item.action === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                                </span>
                                            </div>
                                            <small className="text-muted">{formatDate(item.created_at)}</small>
                                            {item.note && (
                                                <p className="mb-0 small text-muted mt-1">{item.note}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted mb-0">Henüz onay geçmişi yok.</p>
                            )}
                        </div>
                    </div>

                    {/* Onay Sırası */}
                    <div className="card">
                        <div className="card-header bg-light">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-list-numbers me-1"></i> Onay Sırası
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush">
                                {approvers.map((approver, index) => (
                                    <div key={approver.id} className="list-group-item px-0 d-flex align-items-center">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                                            <small className="fw-bold">{index + 1}</small>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="fw-medium">{approver.name}</div>
                                            <small className="text-muted">{approver.role}</small>
                                        </div>
                                        {approver.status === 'approved' && (
                                            <i className="ti ti-check text-success fs-5"></i>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
