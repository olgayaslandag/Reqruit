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
            draft: { label: 'Taslak', class: 'bg-gray-100 text-gray-800' },
            pending: { label: 'Beklemede', class: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Onaylandı', class: 'bg-green-100 text-green-800' },
            paid: { label: 'Ödendi', class: 'bg-blue-100 text-blue-800' },
            locked: { label: 'Kilitli', class: 'bg-red-100 text-red-800' },
        };
        
        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.class}`}>
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
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.payrolls.index')}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
                            title="Geri"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                {period.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {formatDate(period.start_date)} - {formatDate(period.end_date)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(period.status)}
                        
                        {period.status === 'draft' && (
                            <Link
                                href={route('admin.payrolls.edit', period.id)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                            >
                                Düzenle
                            </Link>
                        )}
                        
                        {period.status === 'pending' && (
                            <button
                                onClick={handleApprove}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                                Onayla
                            </button>
                        )}
                        
                        {period.status === 'approved' && (
                            <button
                                onClick={handleMarkAsPaid}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                                Ödendi İşaretle
                            </button>
                        )}
                        
                        <Link
                            href={route('admin.payrolls.export', period.id)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                            Dışa Aktar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Bordro: ${period.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Özet Kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Çalışan Sayısı</div>
                            <div className="text-2xl font-bold text-gray-900">{employees.length}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Toplam Brüt</div>
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totals.gross)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Toplam Kesinti</div>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(totals.ssk + totals.tax)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Toplam Net</div>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.net)}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                            activeTab === tab.id
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

                        <div className="p-6">
                            {/* Çalışanlar Tab */}
                            {activeTab === 'employees' && (
                                <div>
                                    {/* Arama ve İşlemler */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex-1 max-w-md">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Çalışan ara..."
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                {selectAll ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tablo */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
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
                                                        Ek Ödemeler
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        SGK
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Vergi
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Net
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                        İşlemler
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredEmployees.map((employee) => {
                                                    const calc = calculateEmployeePayroll(employee);
                                                    return (
                                                        <tr key={employee.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedEmployees.includes(employee.id)}
                                                                    onChange={() => toggleEmployee(employee.id)}
                                                                    className="rounded border-gray-300"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {employee.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {employee.identity_no}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {formatCurrency(calc.gross)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-green-600">
                                                                +{formatCurrency(calc.allowances.total)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-red-600">
                                                                -{formatCurrency(calc.deductions.ssk)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-red-600">
                                                                -{formatCurrency(calc.deductions.tax)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                                                {formatCurrency(calc.net)}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <Link
                                                                    href={route('admin.payrolls.employeeShow', { payroll: period.id, employee: employee.id })}
                                                                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                                >
                                                                    Detay
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot className="bg-gray-50 font-medium">
                                                <tr>
                                                    <td colSpan="2" className="px-4 py-3 text-right">TOPLAM</td>
                                                    <td className="px-4 py-3">{formatCurrency(totals.gross)}</td>
                                                    <td className="px-4 py-3 text-green-600">+{formatCurrency(totals.allowances)}</td>
                                                    <td className="px-4 py-3 text-red-600">-{formatCurrency(totals.ssk)}</td>
                                                    <td className="px-4 py-3 text-red-600">-{formatCurrency(totals.tax)}</td>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dönem Bilgileri</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Dönem Adı</span>
                                                <span className="font-medium">{period.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Başlangıç</span>
                                                <span className="font-medium">{formatDate(period.start_date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Bitiş</span>
                                                <span className="font-medium">{formatDate(period.end_date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Çalışma Günü</span>
                                                <span className="font-medium">{period.work_days} gün</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Çalışan Sayısı</span>
                                                <span className="font-medium">{employees.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mali Özet</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Toplam Brüt Maaş</span>
                                                <span className="font-medium">{formatCurrency(totals.gross)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Toplam Ek Ödemeler</span>
                                                <span className="font-medium text-green-600">{formatCurrency(totals.allowances)}</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-3">
                                                <span className="text-gray-500">Toplam SGK Kesintisi</span>
                                                <span className="font-medium text-red-600">{formatCurrency(totals.ssk)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Toplam Vergi</span>
                                                <span className="font-medium text-red-600">{formatCurrency(totals.tax)}</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-3">
                                                <span className="text-gray-500 font-semibold">Toplam Net</span>
                                                <span className="font-bold text-green-600 text-lg">{formatCurrency(totals.net)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Detaylar Tab */}
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bordro Detayları</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
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
