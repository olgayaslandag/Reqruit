import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

export default function TaxSummary({ summary }) {
    const { period, sgk, income_tax, stamp_tax, total_deductions, total_net, total_employer_cost, total_gross } = summary;

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Vergi ve Sosyal Güvenlik Özeti - {period?.name}
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
            <Head title={`Vergi ve SGK Özeti - ${period?.name}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Özet Kartlar */}
                    <div className="d-grid d-grid-cols-1 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-3 shadow-sm border-l-4 border-blue-500">
                            <h5 className="fw-medium">Brüt Ücret</h5>
                            <p className="h2 fw-semibold text-dark">{formatCurrency(total_gross)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm border-l-4 border-red-500">
                            <h5 className="fw-medium">Toplam SGK İşçi Payı</h5>
                            <p className="h2 fw-semibold text-danger">{formatCurrency(sgk.employee_share)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm border-l-4 border-yellow-500">
                            <h5 className="fw-medium">Gelir Vergisi</h5>
                            <p className="h2 fw-semibold text-warning">{formatCurrency(income_tax)}</p>
                        </div>
                    </div>

                    {/* Toplam Tabloları */}
                    <div className="d-grid d-grid-cols-1 gap-8">
                        {/* SGK Tablosu */}
                        <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                            <div className="bg-blue-50 px-6 py-4">
                                <h5 className="fw-medium text-info">SGK Payları</h5>
                            </div>
                            <div className="overflow-auto">
                                <table className="w-100 divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                SGK İşçi Payı (İşçi)
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                {formatCurrency(sgk.employee_share)}
                                            </td>
                                        </tr>
                                        <tr className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                SGK İşyeri Payı (İşveren)
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                {formatCurrency(sgk.employer_share)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-light fw-bold table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                Toplam SGK Payları
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark">
                                                {formatCurrency(sgk.total)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Vergi ve Diğer Tablosu */}
                        <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                            <div className="bg-green-50 px-6 py-4">
                                <h5 className="fw-medium text-success">Vergi ve Diğeler</h5>
                            </div>
                            <div className="overflow-auto">
                                <table className="w-100 divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                Gelir Vergisi
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                {formatCurrency(income_tax)}
                                            </td>
                                        </tr>
                                        <tr className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                Damga Vergisi
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                {formatCurrency(stamp_tax)}
                                            </td>
                                        </tr>
                                        <tr className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                Toplam Kesintiler (İşçi)
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                {formatCurrency(total_deductions)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-light fw-bold table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                Net Ücret
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark">
                                                {formatCurrency(total_net)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* İşveren Maliyeti */}
                    <div className="mt-8 bg-white rounded-3 shadow-sm overflow-hidden">
                        <div className="bg-purple-50 px-6 py-4">
                            <h5 className="fw-medium">
                                İşveren Maliyeti Özeti
                            </h5>
                        </div>
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:table-light">
                                        <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                            Toplam Brüt Ücret
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                            {formatCurrency(total_gross)}
                                        </td>
                                    </tr>
                                    <tr className="hover:table-light">
                                        <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                            SGK İşyeri Payı (İşveren)
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                            {formatCurrency(sgk.employer_share)}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-light fw-bold table-light">
                                        <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                            Toplam İşveren Maliyeti
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark">
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