import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function Annual({ summary }) {
    const { year, monthly_data, total_gross, total_net, average_monthly } = summary;
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {year} Yılı Maaş ve Bordro Özeti
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
            <Head title={`${year} Yılı Maaş Özeti`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Genel Özet */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Toplam Brüt</h3>
                            <p className="text-3xl font-semibold text-green-600">{formatCurrency(total_gross)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Toplam Net</h3>
                            <p className="text-3xl font-semibold text-blue-600">{formatCurrency(total_net)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Ortalama Aylık</h3>
                            <p className="text-3xl font-semibold text-indigo-600">{formatCurrency(average_monthly)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Toplam Çalışan</h3>
                            <p className="text-3xl font-semibold text-gray-600">
                                {monthly_data.reduce((sum, month) => sum + month.employee_count, 0)}
                            </p>
                        </div>
                    </div>

                    {/* Aylık Detaylar */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {year} Yılı Aylık Maaş Detayları
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ay
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Çalışan Sayısı
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
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kişibaşı Ort. (Brüt)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthly_data.map((month, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {months[parseInt(month.month) - 1]}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {formatNumber(month.employee_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                                {formatCurrency(month.gross)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                                {formatCurrency(month.deductions)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                                {formatCurrency(month.net)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                {formatCurrency(month.gross / Math.max(month.employee_count, 1))}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Yıllık Toplam */}
                                    <tr className="bg-gray-50 font-bold">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            TOPLAM
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                                            {formatNumber(monthly_data.reduce((sum, month) => sum + month.employee_count, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                                            {formatCurrency(monthly_data.reduce((sum, month) => sum + month.gross, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-red-600">
                                            {formatCurrency(monthly_data.reduce((sum, month) => sum + month.deductions, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                                            {formatCurrency(monthly_data.reduce((sum, month) => sum + month.net, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-700">
                                            {formatCurrency(total_gross / Math.max(12, 1))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Trend Grafik */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            {year} Yılı Brüt Maaş Trendi
                        </h3>
                        
                        {/* Grafik yer tutucusu */}
                        <div className="space-y-4">
                            {monthly_data.map((month, index) => (
                                <div key={index} className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span className="font-medium">{months[parseInt(month.month) - 1]}</span>
                                        <span>{formatCurrency(month.gross)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-8">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                                            style={{
                                                width: `${Math.min(
                                                    (month.gross / Math.max(...monthly_data.map(m => m.gross), 1)) * 100,
                                                    100
                                                )}%`
                                            }}
                                        >
                                            {formatCurrency(month.gross)}
                                        </div>
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