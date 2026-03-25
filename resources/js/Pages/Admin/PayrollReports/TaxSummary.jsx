import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

export default function TaxSummary({ summary }) {
    const { period, sgk, income_tax, stamp_tax, total_deductions, total_net, total_employer_cost, total_gross } = summary;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Vergi ve Sosyal Güvenlik Özeti - {period?.name}
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
            <Head title={`Vergi ve SGK Özeti - ${period?.name}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Özet Kartlar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <h3 className="text-lg font-medium text-gray-500">Brüt Ücret</h3>
                            <p className="text-3xl font-semibold text-gray-900">{formatCurrency(total_gross)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                            <h3 className="text-lg font-medium text-gray-500">Toplam SGK İşçi Payı</h3>
                            <p className="text-3xl font-semibold text-red-600">{formatCurrency(sgk.employee_share)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                            <h3 className="text-lg font-medium text-gray-500">Gelir Vergisi</h3>
                            <p className="text-3xl font-semibold text-yellow-600">{formatCurrency(income_tax)}</p>
                        </div>
                    </div>

                    {/* Toplam Tabloları */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* SGK Tablosu */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="bg-blue-50 px-6 py-4">
                                <h2 className="text-lg font-medium text-blue-800">SGK Payları</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                SGK İşçi Payı (İşçi)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {formatCurrency(sgk.employee_share)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                SGK İşyeri Payı (İşveren)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {formatCurrency(sgk.employer_share)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-100 font-bold bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                Toplam SGK Payları
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                                {formatCurrency(sgk.total)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Vergi ve Diğer Tablosu */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="bg-green-50 px-6 py-4">
                                <h2 className="text-lg font-medium text-green-800">Vergi ve Diğeler</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                Gelir Vergisi
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {formatCurrency(income_tax)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                Damga Vergisi
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {formatCurrency(stamp_tax)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                Toplam Kesintiler (İşçi)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {formatCurrency(total_deductions)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-100 font-bold bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                Net Ücret
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                                {formatCurrency(total_net)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* İşveren Maliyeti */}
                    <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-purple-50 px-6 py-4">
                            <h2 className="text-lg font-medium text-purple-800">
                                İşveren Maliyeti Özeti
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Toplam Brüt Ücret
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                            {formatCurrency(total_gross)}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            SGK İşyeri Payı (İşveren)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                            {formatCurrency(sgk.employer_share)}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-100 font-bold bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Toplam İşveren Maliyeti
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                            {formatCurrency(total_employer_cost)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}