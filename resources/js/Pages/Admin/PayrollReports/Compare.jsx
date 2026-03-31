import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function Compare({ comparison }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Dönemsel Karşılaştırmlar
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
            <Head title="Dönemsel Karşılaştırmalar" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="mb-5 d-flex justify-content-between align-items-center">
                        <h5 className="fw-medium">
                            Seçilen Dönemler Arasý Deðiþim
                        </h5>
                    </div>

                    <div className="bg-white rounded-3 shadow-sm overflow-auto">
                        <table className="w-100 divide-y divide-gray-200">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                        Dönem
                                    </th>
                                    <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                        Çaliþan Sayýsý
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {comparison.map((item, index) => (
                                    <tr key={index} className="hover:table-light">
                                        <td className="px-6 py-4 text-nowrap fs-sm text-dark fw-medium">
                                            {item.period.name}
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-right text-muted">
                                            {formatNumber(item.employee_count)}
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-right text-success fw-medium">
                                            {formatCurrency(item.total_gross)}
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-right text-danger">
                                            {formatCurrency(item.total_deductions)}
                                        </td>
                                        <td className="px-6 py-4 text-nowrap fs-sm text-right text-info fw-medium">
                                            {formatCurrency(item.total_net)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Trend Grafik (Optional) */}
                    {comparison.length > 1 && (
                        <div className="mt-8 bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium">
                                Brüt Ücret Trendi
                            </h5>
                            <div className="mb-3">
                                {comparison.map((item, index) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between fs-sm text-muted mb-1">
                                            <span>{item.period.name}</span>
                                            <span>{formatCurrency(item.total_gross)}</span>
                                        </div>
                                        <div className="w-100 bg-gray-200 rounded-pill h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-pill"
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
                        <div className="mt-8 bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium">
                                Ay Deðiþim Oranlarý (Artýþlar Pozitif, Azalmalar Negatif)
                            </h5>
                            <div className="d-grid d-grid-cols-1 gap-3">
                                {comparison.slice(1).map((item, index) => {
                                    const prevItem = comparison[index];
                                    if (!prevItem) return null;
                                    
                                    const grossChange = ((item.total_gross - prevItem.total_gross) / prevItem.total_gross) * 100;
                                    const netChange = ((item.total_net - prevItem.total_net) / prevItem.total_net) * 100;
                                    const employeeCountChange = ((item.employee_count - prevItem.employee_count) / prevItem.employee_count) * 100;
                                    
                                    return (
                                        <div key={index} className="border rounded p-4">
                                            <h5 className="fw-medium text-dark mb-2">{item.period.name} (vs {prevItem.period.name})</h5>
                                            <div className="space-y-2 fs-sm">
                                                <div className={`d-flex justify-content-between ${grossChange >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    <span>Brüt Değişim:</span>
                                                    <span>{grossChange.toFixed(2)}%</span>
                                                </div>
                                                <div className={`d-flex justify-content-between ${netChange >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    <span>Net Değişim:</span>
                                                    <span>{netChange.toFixed(2)}%</span>
                                                </div>
                                                <div className={`d-flex justify-content-between ${employeeCountChange >= 0 ? 'text-success' : 'text-danger'}`}>
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