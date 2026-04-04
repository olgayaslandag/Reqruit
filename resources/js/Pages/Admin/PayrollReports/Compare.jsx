import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function Compare({ comparison }) {
    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Dönem Karşılaştırma',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro Raporları', url: route('admin.payroll-reports.index') },
                    { label: 'Karşılaştırma', url: '#' },
                ],
                backUrl: route('admin.payroll-reports.index'),
            }}
        >
            <Head title="Dönem Karşılaştırma" />

            <div className="container-fluid py-4">
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-arrows-left-right me-2"></i>Dönemler Arası Karşılaştırma</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Dönem</th>
                                        <th className="text-end">Çalışan</th>
                                        <th className="text-end">Toplam Brüt</th>
                                        <th className="text-end">Toplam Kesinti</th>
                                        <th className="text-end">Net Toplam</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(comparison || []).map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-medium">{item.period?.name}</td>
                                            <td className="text-end">{formatNumber(item.employee_count)}</td>
                                            <td className="text-end text-success fw-semibold">{formatCurrency(item.total_gross)}</td>
                                            <td className="text-end text-danger">{formatCurrency(item.total_deductions)}</td>
                                            <td className="text-end text-info fw-semibold">{formatCurrency(item.total_net)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Trend Grafik */}
                {(comparison || []).length > 1 && (
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0"><i className="ti ti-trending-up me-2"></i>Brüt Ücret Trendi</h5>
                        </div>
                        <div className="card-body">
                            {(comparison || []).map((item, idx) => {
                                const maxGross = Math.max(...(comparison || []).map(c => c.total_gross), 1);
                                const percent = (item.total_gross / maxGross) * 100;
                                return (
                                    <div key={idx} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fw-medium">{item.period?.name}</span>
                                            <span className="text-muted">{formatCurrency(item.total_gross)}</span>
                                        </div>
                                        <div className="progress" style={{ height: '20px' }}>
                                            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Değişim Oranları */}
                {(comparison || []).length > 1 && (
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0"><i className="ti ti-chart-line me-2"></i>Değişim Oranları</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {(comparison || []).slice(1).map((item, idx) => {
                                    const prevItem = comparison[idx];
                                    if (!prevItem) return null;
                                    const grossChange = prevItem.total_gross > 0 
                                        ? ((item.total_gross - prevItem.total_gross) / prevItem.total_gross) * 100 
                                        : 0;
                                    const netChange = prevItem.total_net > 0 
                                        ? ((item.total_net - prevItem.total_net) / prevItem.total_net) * 100 
                                        : 0;
                                    return (
                                        <div key={idx} className="col-md-4">
                                            <div className="card bg-light">
                                                <div className="card-body">
                                                    <h6 className="mb-3">{item.period?.name} vs {prevItem.period?.name}</h6>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Brüt:</span>
                                                        <span className={grossChange >= 0 ? 'text-success' : 'text-danger'}>
                                                            {grossChange >= 0 ? '+' : ''}{grossChange.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <span>Net:</span>
                                                        <span className={netChange >= 0 ? 'text-success' : 'text-danger'}>
                                                            {netChange >= 0 ? '+' : ''}{netChange.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}