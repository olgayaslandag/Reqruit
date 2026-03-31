import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function DepartmentSummary({ summary, period }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Departman Bazlı Bordro Özeti - {period?.name}
                    </h5>
                    <Link
                        href={route('admin.payroll-reports.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                    >
                        Geri Dön
                    </Link>
                </div>
            }
        >
            <Head title={`Departmanları - ${period?.name}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 table-light border-b border-secondary">
                            <h5 className="fw-medium">
                                Departman Bazlı Maaş Özeti - {summary.length} departman
                            </h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Çalişan Sayısı
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Brüt
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Kesinti
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Net
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Ort. Brüt
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {summary.map((item, index) => (
                                        <tr key={index} className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                {item.department?.name || 'Tanımsız'}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                {formatNumber(item.employee_count)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark fw-medium">
                                                {formatCurrency(item.total_gross)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-danger">
                                                {formatCurrency(item.total_deductions)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark fw-medium">
                                                {formatCurrency(item.total_net)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark">
                                                {formatCurrency(item.average_gross)}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Toplam satiri */}
                                    <tr className="table-light fw-bold">
                                        <td className="px-6 py-4 fs-sm text-dark">
                                            TOPLAM
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatNumber(summary.reduce((sum, item) => sum + item.employee_count, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatCurrency(summary.reduce((sum, item) => sum + item.total_gross, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-danger">
                                            {formatCurrency(summary.reduce((sum, item) => sum + item.total_deductions, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatCurrency(summary.reduce((sum, item) => sum + item.total_net, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatCurrency(
                                                summary.reduce((sum, item) => sum + item.total_gross, 0) /
                                                Math.max(summary.reduce((sum, item) => sum + item.employee_count, 0), 1)
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grafi̇k alan覺 (optional) */}
                    <div className="mt-8 bg-white rounded-3 shadow-sm p-4">
                        <h5 className="fw-medium">
                            Departmanlara G철re Maaş Da─ƒilimi
                        </h5>
                        <div className="space-y-4">
                            {summary.slice(0, 5).map((item, index) => (
                                <div key={index}>
                                    <div className="d-flex justify-content-between fs-sm text-muted mb-1">
                                        <span>{item.department?.name || 'Tan覺ms覺z'}</span>
                                        <span>{formatCurrency(item.total_gross)}</span>
                                    </div>
                                    <div className="w-100 bg-gray-200 rounded-pill h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-pill"
                                            style={{
                                                width: `${Math.min(
                                                    (item.total_gross / Math.max(...summary.map(s => s.total_gross), 1)) * 100,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}