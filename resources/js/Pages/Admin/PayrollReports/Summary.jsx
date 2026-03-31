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
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Bordro Özeti - {period?.name}
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
            <Head title={`Bordro Özeti - ${period?.name}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Genel Bilgiler */}
                    <div className="d-grid d-grid-cols-1 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Toplam Çalışan</h5>
                            <p className="h2 fw-semibold text-primary">{total_employees}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Toplam Gelir</h5>
                            <p className="h2 fw-semibold text-success">{formatCurrency(total_earnings)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Toplam Kesinti</h5>
                            <p className="h2 fw-semibold text-danger">{formatCurrency(total_deductions)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Net Toplam</h5>
                            <p className="h2 fw-semibold text-info">{formatCurrency(net_total)}</p>
                        </div>
                    </div>

                    <div className="d-grid d-grid-cols-1 gap-8">
                        {/* Kazanç Kalemleri */}
                        <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                            <div className="bg-green-50 px-6 py-4">
                                <h5 className="fw-medium text-success">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Kazanç Kalemleri
                                </h5>
                            </div>
                            
                            <div className="overflow-auto">
                                <table className="w-100 divide-y divide-gray-200">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Kalem</th>
                                            <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase">Toplam</th>
                                            <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase">Kişi Sayısı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {earnings.map((item, index) => (
                                            <tr key={index} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {item.component.name}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark fw-medium">
                                                    {formatCurrency(item.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                    {item.employee_count}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="table-light fw-semibold">
                                            <td className="px-6 py-4 fs-sm text-dark">TOPLAM</td>
                                            <td className="px-6 py-4 text-right text-dark">
                                                {formatCurrency(total_earnings)}
                                            </td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Kesinti Kalemleri */}
                        <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                            <div className="bg-red-50 px-6 py-4">
                                <h5 className="fw-medium text-danger">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                    </svg>
                                    Kesinti Kalemleri
                                </h5>
                            </div>
                            
                            <div className="overflow-auto">
                                <table className="w-100 divide-y divide-gray-200">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Kalem</th>
                                            <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase">Toplam</th>
                                            <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase">Kişi Sayısı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {deductions.map((item, index) => (
                                            <tr key={index} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {item.component.name}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-right text-danger fw-medium">
                                                    {formatCurrency(item.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                    {item.employee_count}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="table-light fw-semibold">
                                            <td className="px-6 py-4 fs-sm text-dark">TOPLAM</td>
                                            <td className="px-6 py-4 text-right text-danger fw-medium">
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