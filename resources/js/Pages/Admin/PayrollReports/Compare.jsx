import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function Compare({ comparison }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dönemsel Karşılaştırmlar
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
            <Head title="Dönemsel Karşılaştırmalar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Seçilen Dönemler Arasý Deðiþim
                        </h3>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dönem
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Çaliþan Sayýsý
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Toplam Brüt
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Toplam Kesinti
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Net Toplam
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {comparison.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {item.period.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                            {formatNumber(item.employee_count)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                                            {formatCurrency(item.total_gross)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                            {formatCurrency(item.total_deductions)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-medium">
                                            {formatCurrency(item.total_net)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Trend Grafik (Optional) */}
                    {comparison.length > 1 && (
                        <div className="mt-8 bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Brüt Ücret Trendi
                            </h3>
                            <div className="space-y-6">
                                {comparison.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>{item.period.name}</span>
                                            <span>{formatCurrency(item.total_gross)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                                                style={{
                                                    width: `${Math.min(
                                                        (item.total_gross / Math.max(...comparison.map(c => c.total_gross), 1)) * 100,
                                                        100
                                                    )}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Artýþ Yüzdesi Analizi */}
                    {comparison.length > 1 && (
                        <div className="mt-8 bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Ay Deðiþim Oranlarý (Artýþlar Pozitif, Azalmalar Negatif)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {comparison.slice(1).map((item, index) => {
                                    const prevItem = comparison[index];
                                    if (!prevItem) return null;
                                    
                                    const grossChange = ((item.total_gross - prevItem.total_gross) / prevItem.total_gross) * 100;
                                    const netChange = ((item.total_net - prevItem.total_net) / prevItem.total_net) * 100;
                                    const employeeCountChange = ((item.employee_count - prevItem.employee_count) / prevItem.employee_count) * 100;
                                    
                                    return (
                                        <div key={index} className="border rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 mb-2">{item.period.name} (vs {prevItem.period.name})</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className={`flex justify-between ${grossChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>Brüt Değişim:</span>
                                                    <span>{grossChange.toFixed(2)}%</span>
                                                </div>
                                                <div className={`flex justify-between ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>Net Değişim:</span>
                                                    <span>{netChange.toFixed(2)}%</span>
                                                </div>
                                                <div className={`flex justify-between ${employeeCountChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>Personel Değişim:</span>
                                                    <span>{employeeCountChange.toFixed(2)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}