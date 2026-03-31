import { useState } from 'react';
import { router, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate, formatCurrency, formatMoney } from '@/Utils/formatters';
import { calculateNetSalary } from '@/Utils/payrollCalculations';

/**
 * Bordro dönemi detay sayfası
 * GET /admin/payrolls/{id}
 */
export default function Show({ period, employees, salaryComponents }) {
    const [activeTab, setActiveTab] = useState('employees');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Tab tanımları
    const TABS = [
        { id: 'employees', label: 'Çalışanlar', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { id: 'summary', label: 'Özet', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { id: 'details', label: 'Detaylar', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    // Durum badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { label: 'Taslak', class: 'bg-light text-dark' },
            pending: { label: 'Beklemede', class: 'bg-warning bg-opacity-10 text-warning' },
            approved: { label: 'Onaylandı', class: 'bg-success bg-opacity-10 text-success' },
            paid: { label: 'Ödendi', class: 'bg-primary bg-opacity-10 text-info' },
            locked: { label: 'Kilitli', class: 'bg-danger bg-opacity-10 text-danger' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-light text-dark' };
        
        return (
            <span className={`px-3 py-1 fs-sm fw-medium rounded-pill ${config.class}`}>
                {config.label}
            </span>
        );
    };

    // Çalışan seçme
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
            allowances: acc.allowances + calc.allowances.total,
            ssk: acc.ssk + calc.deductions.ssk,
            tax: acc.tax + calc.deductions.tax,
            net: acc.net + calc.net,
        };
    }, { gross: 0, allowances: 0, ssk: 0, tax: 0, net: 0 });

    // Filtrelenmiş çalışanlar
    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.identity_no?.includes(searchTerm)
    );

    // Onayla
    const handleApprove = () => {
        router.post(route('admin.payrolls.approve', period.id), {}, {
            onSuccess: () => showSuccess('Bordro onaylandı.'),
            onError: () => showError('Bordro onaylanırken hata oluştu.'),
        });
    };

    // Öde
    const handleMarkAsPaid = () => {
        router.post(route('admin.payrolls.markPaid', period.id), {}, {
            onSuccess: () => showSuccess('Bordro ödendi olarak işaretlendi.'),
            onError: () => showError('İşaretleme sırasında hata oluştu.'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <Link
                            href={route('admin.payrolls.index')}
                            className="p-2 text-muted hover:text-dark hover:bg-light rounded"
                            title="Geri"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h5 className="fw-semibold">
                                {period.name}
                            </h5>
                            <p className="fs-sm text-muted">
                                {formatDate(period.start_date)} - {formatDate(period.end_date)}
                            </p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {getStatusBadge(period.status)}
                        
                        {period.status === 'draft' && (
                            <Link
                                href={route('admin.payrolls.edit', period.id)}
                                className="btn btn-primary btn-sm"
                            >
                                Düzenle
                            </Link>
                        )}
                        
                        {period.status === 'pending' && (
                            <button
                                onClick={handleApprove}
                                className="btn btn-success btn-sm"
                            >
                                Onayla
                            </button>
                        )}
                        
                        {period.status === 'approved' && (
                            <button
                                onClick={handleMarkAsPaid}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 fs-sm"
                            >
                                Ödendi İşaretle
                            </button>
                        )}
                        
                        <Link
                            href={route('admin.payrolls.export', period.id)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                        >
                            Dışa Aktar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Bordro: ${period.name}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Özet Kartları */}
                    <div className="d-grid d-grid-cols-1 gap-3 mb-5">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Çalışan Sayısı</div>
                            <div className="fs-2 fw-bold text-dark">{employees.length}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Toplam Brüt</div>
                            <div className="fs-2 fw-bold text-dark">{formatCurrency(totals.gross)}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Toplam Kesinti</div>
                            <div className="fs-2 fw-bold text-danger">{formatCurrency(totals.ssk + totals.tax)}</div>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="fs-sm text-muted">Toplam Net</div>
                            <div className="fs-2 fw-bold text-success">{formatCurrency(totals.net)}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-3 shadow-sm mb-5">
                        <div className="border-b border-secondary">
                            <nav className="d-flex -mb-px">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-1/3 py-4 px-1 text-center border-b-2 fw-medium fs-sm ${
                                            activeTab === tab.id
                                                ? 'border-indigo-500 text-primary'
                                                : 'border-transparent text-muted hover:text-dark hover:border-secondary'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                        </svg>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-4">
                            {/* Çalışanlar Tab */}
                            {activeTab === 'employees' && (
                                <div>
                                    {/* Arama ve İşlemler */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="d-flex-1 mw-100">
                                            <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Çalışan ara..."
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="px-3 py-2 fs-sm text-muted hover:text-dark"
                                            >
                                                {selectAll ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tablo */}
                                    <div className="overflow-auto">
                                        <table className="w-100 divide-y divide-gray-200">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
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
                                                        Ek Ödemeler
                                                    </th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                                        SGK
                                                    </th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                                        Vergi
                                                    </th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">
                                                        Net
                                                    </th>
                                                    <th className="px-4 py-3 text-right fs-xs fw-medium text-muted text-uppercase">
                                                        İşlemler
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredEmployees.map((employee) => {
                                                    const calc = calculateEmployeePayroll(employee);
                                                    return (
                                                        <tr key={employee.id} className="hover:table-light">
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedEmployees.includes(employee.id)}
                                                                    onChange={() => toggleEmployee(employee.id)}
                                                                    className="rounded border-secondary"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="fs-sm fw-medium text-dark">
                                                                    {employee.name}
                                                                </div>
                                                                <div className="fs-xs text-muted">
                                                                    {employee.identity_no}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 fs-sm text-dark">
                                                                {formatCurrency(calc.gross)}
                                                            </td>
                                                            <td className="px-4 py-3 fs-sm text-success">
                                                                +{formatCurrency(calc.allowances.total)}
                                                            </td>
                                                            <td className="px-4 py-3 fs-sm text-danger">
                                                                -{formatCurrency(calc.deductions.ssk)}
                                                            </td>
                                                            <td className="px-4 py-3 fs-sm text-danger">
                                                                -{formatCurrency(calc.deductions.tax)}
                                                            </td>
                                                            <td className="px-4 py-3 fs-sm fw-bold text-dark">
                                                                {formatCurrency(calc.net)}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <Link
                                                                    href={route('admin.payrolls.employeeShow', { payroll: period.id, employee: employee.id })}
                                                                    className="text-primary hover:text-indigo-900 fs-sm"
                                                                >
                                                                    Detay
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot className="table-light fw-medium">
                                                <tr>
                                                    <td colSpan="2" className="px-4 py-3 text-right">TOPLAM</td>
                                                    <td className="px-4 py-3">{formatCurrency(totals.gross)}</td>
                                                    <td className="px-4 py-3 text-success">+{formatCurrency(totals.allowances)}</td>
                                                    <td className="px-4 py-3 text-danger">-{formatCurrency(totals.ssk)}</td>
                                                    <td className="px-4 py-3 text-danger">-{formatCurrency(totals.tax)}</td>
                                                    <td className="px-4 py-3">{formatCurrency(totals.net)}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Özet Tab */}
                            {activeTab === 'summary' && (
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    <div className="table-light rounded p-4">
                                        <h5 className="fw-semibold">Dönem Bilgileri</h5>
                                        <div className="space-y-3">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Dönem Adı</span>
                                                <span className="fw-medium">{period.name}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Başlangıç</span>
                                                <span className="fw-medium">{formatDate(period.start_date)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Bitiş</span>
                                                <span className="fw-medium">{formatDate(period.end_date)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Çalışma Günü</span>
                                                <span className="fw-medium">{period.work_days} gün</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Çalışan Sayısı</span>
                                                <span className="fw-medium">{employees.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-light rounded p-4">
                                        <h5 className="fw-semibold">Mali Özet</h5>
                                        <div className="space-y-3">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Toplam Brüt Maaş</span>
                                                <span className="fw-medium">{formatCurrency(totals.gross)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Toplam Ek Ödemeler</span>
                                                <span className="fw-medium text-success">{formatCurrency(totals.allowances)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between border-t pt-3">
                                                <span className="text-muted">Toplam SGK Kesintisi</span>
                                                <span className="fw-medium text-danger">{formatCurrency(totals.ssk)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Toplam Vergi</span>
                                                <span className="fw-medium text-danger">{formatCurrency(totals.tax)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between border-t pt-3">
                                                <span className="text-muted fw-semibold">Toplam Net</span>
                                                <span className="fw-bold text-success fs-3">{formatCurrency(totals.net)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Detaylar Tab */}
                            {activeTab === 'details' && (
                                <div className="mb-3">
                                    <div>
                                        <h5 className="fw-semibold">Bordro Detayları</h5>
                                        <div className="table-light rounded p-4">
                                            <pre className="fs-sm text-muted whitespace-pre-wrap">
                                                {JSON.stringify(period, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
