import { useMemo, useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency } from '@/Utils/formatters';

export default function Show({ period, employees, salaryComponents }) {
    const [activeTab, setActiveTab] = useState('employees');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const TABS = [
        { id: 'employees', label: 'Çalışanlar', icon: 'ti-users' },
        { id: 'summary', label: 'Özet', icon: 'ti-chart-bar' },
        { id: 'details', label: 'Detaylar', icon: 'ti-file-analytics' },
    ];

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'draft': return 'bg-light text-dark border';
            case 'pending': return 'bg-warning text-dark';
            case 'approved': return 'bg-success';
            case 'paid': return 'bg-primary';
            case 'locked': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Taslak',
            pending: 'Beklemede',
            approved: 'Onaylandı',
            paid: 'Ödendi',
            locked: 'Kilitli',
        };
        return labels[status] || status;
    };

    const toggleEmployee = (employeeId) => {
        setSelectedEmployees(prev => 
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(emp => emp.id));
        }
        setSelectAll(!selectAll);
    };

    // Basit hesaplama
    const calculateEmployeePayroll = (employee) => {
        const gross = parseFloat(employee.gross_salary) || 0;
        const ssk = gross * 0.14; // SSK işçi payı %14
        const tax = gross * 0.15; // Gelir vergisi %15 (basitleştirilmiş)
        const net = gross - ssk - tax;
        return { gross, ssk, tax, net };
    };

    const totals = useMemo(() => employees.reduce((acc, emp) => {
        const calc = calculateEmployeePayroll(emp);
        return {
            gross: acc.gross + calc.gross,
            ssk: acc.ssk + calc.ssk,
            tax: acc.tax + calc.tax,
            net: acc.net + calc.net,
        };
    }, { gross: 0, ssk: 0, tax: 0, net: 0 }), [employees]);

    const filteredEmployees = useMemo(() => employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.identity_no?.includes(searchTerm)
    ), [employees, searchTerm]);

    const handleApprove = () => {
        confirmDelete('Bu bordroyu onaylamak istediğinize emin misiniz?', () => {
            router.post(route('admin.payrolls.approve', period.id), {}, {
                onSuccess: () => showSuccess('Bordro onaylandı.'),
                onError: () => showError('Bordro onaylanırken hata oluştu.'),
            });
        });
    };

    const handleMarkAsPaid = () => {
        confirmDelete('Bu bordroyu ödendi olarak işaretlemek istediğinize emin misiniz?', () => {
            router.post(route('admin.payrolls.markPaid', period.id), {}, {
                onSuccess: () => showSuccess('Bordro ödendi olarak işaretlendi.'),
                onError: () => showError('İşaretleme sırasında hata oluştu.'),
            });
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: period.name,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro ve Maaş', url: '#' },
                    { label: 'Bordro Dönemleri', url: route('admin.payrolls.index') },
                    { label: period.name, url: route('admin.payrolls.show', period.id) },
                ],
                backUrl: route('admin.payrolls.index'),
            }}
        >
            <Head title={`Bordro: ${period.name}`} />

            {/* Durum ve İşlem Butonları */}
            <div className="card border-primary mb-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <span className={`badge ${getStatusBadgeClass(period.status)} fs-6`}>
                            {getStatusLabel(period.status)}
                        </span>
                        <small className="text-muted ms-3">
                            {formatDate(period.start_date)} - {formatDate(period.end_date)}
                        </small>
                    </div>
                    <div className="d-flex gap-2">
                        {period.status === 'draft' && (
                            <Link
                                href={route('admin.payrolls.edit', period.id)}
                                className="btn btn-outline-primary btn-sm"
                            >
                                <i className="ti ti-edit me-1"></i> Düzenle
                            </Link>
                        )}
                        
                        {period.status === 'pending' && (
                            <button
                                onClick={handleApprove}
                                className="btn btn-success btn-sm"
                            >
                                <i className="ti ti-check me-1"></i> Onayla
                            </button>
                        )}
                        
                        {period.status === 'approved' && (
                            <button
                                onClick={handleMarkAsPaid}
                                className="btn btn-primary btn-sm"
                            >
                                <i className="ti ti-coin me-1"></i> Ödendi İşaretle
                            </button>
                        )}
                        
                        <Link
                            href={route('admin.payrolls.export', period.id)}
                            className="btn btn-outline-info btn-sm"
                        >
                            <i className="ti ti-download me-1"></i> Dışa Aktar
                        </Link>
                    </div>
                </div>
            </div>

            {/* Özet Kartları */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <i className="ti ti-users fs-2 text-primary mb-2"></i>
                            <h6 className="text-primary fw-medium">Çalışan Sayısı</h6>
                            <h3 className="fw-bold text-primary">{employees.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-coin fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Toplam Brüt</h6>
                            <h4 className="fw-bold text-success">{formatCurrency(totals.gross)}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-danger">
                        <div className="card-body text-center">
                            <i className="ti ti-minus fs-2 text-danger mb-2"></i>
                            <h6 className="text-danger fw-medium">Toplam Kesinti</h6>
                            <h4 className="fw-bold text-danger">{formatCurrency(totals.ssk + totals.tax)}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <i className="ti ti-wallet fs-2 text-info mb-2"></i>
                            <h6 className="text-info fw-medium">Toplam Net</h6>
                            <h4 className="fw-bold text-info">{formatCurrency(totals.net)}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card">
                <div className="card-header bg-light">
                    <ul className="nav nav-tabs card-header-tabs">
                        {TABS.map((tab) => (
                            <li key={tab.id} className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <i className={`ti ${tab.icon} me-1`}></i> {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card-body">
                    {/* Çalışanlar Tab */}
                    {activeTab === 'employees' && (
                        <div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Çalışan ara..."
                                    />
                                </div>
                                <div className="col-md-6 text-end">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        {selectAll ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={toggleSelectAll}
                                                    className="form-check-input"
                                                />
                                            </th>
                                            <th>Çalışan</th>
                                            <th className="text-end">Brüt</th>
                                            <th className="text-end">SGK</th>
                                            <th className="text-end">Vergi</th>
                                            <th className="text-end">Net</th>
                                            <th className="text-end">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees.map((employee) => {
                                            const calc = calculateEmployeePayroll(employee);
                                            return (
                                                <tr key={employee.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmployees.includes(employee.id)}
                                                            onChange={() => toggleEmployee(employee.id)}
                                                            className="form-check-input"
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="fw-medium">{employee.name}</div>
                                                        <small className="text-muted">{employee.identity_no}</small>
                                                    </td>
                                                    <td className="text-end">{formatCurrency(calc.gross)}</td>
                                                    <td className="text-end text-danger">-{formatCurrency(calc.ssk)}</td>
                                                    <td className="text-end text-danger">-{formatCurrency(calc.tax)}</td>
                                                    <td className="text-end fw-bold">{formatCurrency(calc.net)}</td>
                                                    <td className="text-end">
                                                        <Link
                                                            href={route('admin.payrolls.employeeShow', { payroll: period.id, employee: employee.id })}
                                                            className="btn btn-sm btn-outline-info"
                                                        >
                                                            <i className="ti ti-eye"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="table-light fw-bold">
                                        <tr>
                                            <td colSpan="2" className="text-end">TOPLAM:</td>
                                            <td className="text-end">{formatCurrency(totals.gross)}</td>
                                            <td className="text-end text-danger">-{formatCurrency(totals.ssk)}</td>
                                            <td className="text-end text-danger">-{formatCurrency(totals.tax)}</td>
                                            <td className="text-end">{formatCurrency(totals.net)}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Özet Tab */}
                    {activeTab === 'summary' && (
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card border-info">
                                    <div className="card-header bg-info text-white">
                                        <h6 className="mb-0 fw-bold">Dönem Bilgileri</h6>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted">Dönem Adı:</td>
                                                    <td className="text-end fw-medium">{period.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Başlangıç:</td>
                                                    <td className="text-end fw-medium">{formatDate(period.start_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Bitiş:</td>
                                                    <td className="text-end fw-medium">{formatDate(period.end_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Çalışma Günü:</td>
                                                    <td className="text-end fw-medium">{period.work_days} gün</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Çalışan Sayısı:</td>
                                                    <td className="text-end fw-medium">{employees.length}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-success">
                                    <div className="card-header bg-success text-white">
                                        <h6 className="mb-0 fw-bold">Mali Özet</h6>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted">Toplam Brüt:</td>
                                                    <td className="text-end fw-medium">{formatCurrency(totals.gross)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Toplam SGK:</td>
                                                    <td className="text-end fw-medium text-danger">-{formatCurrency(totals.ssk)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Toplam Vergi:</td>
                                                    <td className="text-end fw-medium text-danger">-{formatCurrency(totals.tax)}</td>
                                                </tr>
                                                <tr className="border-top">
                                                    <td className="fw-bold">Toplam Net:</td>
                                                    <td className="text-end fw-bold text-success fs-5">{formatCurrency(totals.net)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detaylar Tab */}
                    {activeTab === 'details' && (
                        <div>
                            <h6 className="fw-bold mb-3">Bordro Detayları</h6>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Dönem</th>
                                            <th>Durum</th>
                                            <th>Başlangıç</th>
                                            <th>Bitiş</th>
                                            <th>Ödeme Sıklığı</th>
                                            <th>Oluşturan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-semibold">{period.name}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(period.status)}`}>
                                                    {getStatusLabel(period.status)}
                                                </span>
                                            </td>
                                            <td>{period.start_date ? formatDate(period.start_date) : '-'}</td>
                                            <td>{period.end_date ? formatDate(period.end_date) : '-'}</td>
                                            <td>{period.payment_frequency || '-'}</td>
                                            <td>{period.creator?.name || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {period.payrollItems?.length > 0 && (
                                <div className="table-responsive mt-3">
                                    <table className="table table-sm table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Çalışan</th>
                                                <th>Bileşen</th>
                                                <th className="text-end">Tutar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {period.payrollItems.slice(0, 100).map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        {item.employee?.first_name} {item.employee?.last_name}
                                                    </td>
                                                    <td>{item.salaryComponent?.name || '-'}</td>
                                                    <td className="text-end">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {period.payrollItems.length > 100 && (
                                        <p className="text-muted small mt-2">
                                            İlk 100 kalem gösteriliyor (toplam {period.payrollItems.length}).
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
