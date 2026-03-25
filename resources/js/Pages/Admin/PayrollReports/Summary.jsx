import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

export default function Summary({ summary }) {
    const { period, total_employees, total_earnings, total_deductions, net_total, by_component } = summary;

    // Ek gelir ve sabit gelir kalemlerini ayır
    const earnings = by_component.filter(item => item.component.type === 'earning');
    const deductions = by_component.filter(item => item.component.type === 'deduction');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Bordro Özeti - {period?.name}
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
            <Head title={`Bordro Özeti - ${period?.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Genel Bilgiler */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Toplam Çalışan</h3>
                            <p className="text-3xl font-semibold text-indigo-600">{total_employees}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Toplam Gelir</h3>
                            <p className="text-3xl font-semibold text-green-600">{formatCurrency(total_earnings)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Toplam Kesinti</h3>
                            <p className="text-3xl font-semibold text-red-600">{formatCurrency(total_deductions)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Net Toplam</h3>
                            <p className="text-3xl font-semibold text-blue-600">{formatCurrency(net_total)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Kazanç Kalemleri */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="bg-green-50 px-6 py-4">
                                <h2 className="text-lg font-medium text-green-800 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Kazanç Kalemleri
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kalem</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Toplam</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kişi Sayısı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {earnings.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.component.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                                    {formatCurrency(item.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                    {item.employee_count}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="px-6 py-4 text-sm text-gray-900">TOPLAM</td>
                                            <td className="px-6 py-4 text-right text-gray-900">
                                                {formatCurrency(total_earnings)}
                                            </td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Kesinti Kalemleri */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="bg-red-50 px-6 py-4">
                                <h2 className="text-lg font-medium text-red-800 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                    </svg>
                                    Kesinti Kalemleri
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kalem</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Toplam</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kişi Sayısı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {deductions.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.component.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                                                    {formatCurrency(item.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                    {item.employee_count}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="px-6 py-4 text-sm text-gray-900">TOPLAM</td>
                                            <td className="px-6 py-4 text-right text-red-600 font-medium">
                                                {formatCurrency(total_deductions)}
                                            </td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}