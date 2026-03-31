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
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        {year} Yılı Maaş ve Bordro Özeti
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
            <Head title={`${year} Yılı Maaş Özeti`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Genel Özet */}
                    <div className="d-grid d-grid-cols-1 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Toplam Brüt</h5>
                            <p className="h2 fw-semibold text-success">{formatCurrency(total_gross)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Toplam Net</h5>
                            <p className="h2 fw-semibold text-info">{formatCurrency(total_net)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Ortalama Aylık</h5>
                            <p className="h2 fw-semibold text-primary">{formatCurrency(average_monthly)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-medium">Toplam Çalışan</h5>
                            <p className="h2 fw-semibold text-muted">
                                {monthly_data.reduce((sum, month) => sum + month.employee_count, 0)}
                            </p>
                        </div>
                    </div>

                    {/* Aylık Detaylar */}
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden mb-8">
                        <div className="px-6 py-4 table-light border-b border-secondary">
                            <h5 className="fw-medium">
                                {year} Yılı Aylık Maaş Detayları
                            </h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Ay
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Çalışan Sayısı
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Brüt
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Toplam Kesinti
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Net Toplam
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Kişibaşı Ort. (Brüt)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthly_data.map((month, index) => (
                                        <tr key={index} className="hover:table-light">
                                            <td className="px-6 py-4 text-nowrap fs-sm text-dark fw-medium">
                                                {months[parseInt(month.month) - 1]}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                                {formatNumber(month.employee_count)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark fw-medium">
                                                {formatCurrency(month.gross)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-danger">
                                                {formatCurrency(month.deductions)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark fw-medium">
                                                {formatCurrency(month.net)}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap fs-sm text-right text-dark">
                                                {formatCurrency(month.gross / Math.max(month.employee_count, 1))}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Yıllık Toplam */}
                                    <tr className="table-light fw-bold">
                                        <td className="px-6 py-4 fs-sm text-dark">
                                            TOPLAM
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatNumber(monthly_data.reduce((sum, month) => sum + month.employee_count, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatCurrency(monthly_data.reduce((sum, month) => sum + month.gross, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-danger">
                                            {formatCurrency(monthly_data.reduce((sum, month) => sum + month.deductions, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatCurrency(monthly_data.reduce((sum, month) => sum + month.net, 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right fs-sm text-dark">
                                            {formatCurrency(total_gross / Math.max(12, 1))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Trend Grafik */}
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h5 className="fw-medium">
                            {year} Yılı Brüt Maaş Trendi
                        </h5>
                        
                        {/* Grafik yer tutucusu */}
                        <div className="space-y-4">
                            {monthly_data.map((month, index) => (
                                <div key={index} className="mb-5">
                                    <div className="d-flex justify-content-between fs-sm text-muted mb-2">
                                        <span className="fw-medium">{months[parseInt(month.month) - 1]}</span>
                                        <span>{formatCurrency(month.gross)}</span>
                                    </div>
                                    <div className="w-100 bg-gray-200 rounded-pill h-8">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-8 rounded-pill d-flex align-items-center justify-content-end pr-2 text-white fs-xs fw-medium"
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