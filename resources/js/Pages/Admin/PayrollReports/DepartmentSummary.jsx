import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function DepartmentSummary({ summary, period }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Departman Bazlı Bordro Özeti - {period?.name}
                    </h2>
                    <Link
                        href={route('admin.payroll-reports.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Geri Dön
                    </Link>
                </div>
            }
        >
            <Head title={`Departmanları - ${period?.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Departman Bazlı Maaş Özeti - {summary.length} departman
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Çalişan Sayısı
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Toplam Brüt
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Toplam Kesinti
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Toplam Net
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ort. Brüt
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {summary.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.department?.name || 'Tanımsız'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {formatNumber(item.employee_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                                {formatCurrency(item.total_gross)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                                {formatCurrency(item.total_deductions)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                                {formatCurrency(item.total_net)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                {formatCurrency(item.average_gross)}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Toplam satiri */}
                                    <tr className="bg-gray-50 font-bold">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            TOPLAM
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                                            {formatNumber(summary.reduce((sum, item) => sum + item.employee_count, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                                            {formatCurrency(summary.reduce((sum, item) => sum + item.total_gross, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-red-600">
                                            {formatCurrency(summary.reduce((sum, item) => sum + item.total_deductions, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                                            {formatCurrency(summary.reduce((sum, item) => sum + item.total_net, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-700">
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
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Departmanlara G철re Maaş Da─ƒilimi
                        </h3>
                        <div className="space-y-4">
                            {summary.slice(0, 5).map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>{item.department?.name || 'Tan覺ms覺z'}</span>
                                        <span>{formatCurrency(item.total_gross)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
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