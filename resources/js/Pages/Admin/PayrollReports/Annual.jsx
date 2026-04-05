import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function Annual({ summary }) {
    const { year, monthly_data, total_gross, total_net, average_monthly } = summary;
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const totalEmployees = (monthly_data || []).reduce((sum, m) => sum + (m.employee_count || 0), 0);

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: `${year} Yılı Maaş ve Bordro Özeti`,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro Raporları', url: route('admin.payroll-reports.index') },
                    { label: 'Yıllık Özet', url: '#' },
                ],
                backUrl: route('admin.payroll-reports.index'),
            }}
        >
            <Head title={`${year} Yılı Maaş Özeti`} />

            <div className="container-fluid py-4">
                {/* Özet Kartlar */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card border-success">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Brüt</h6>
                                <h4 className="mb-0 fw-bold text-success">{formatCurrency(total_gross)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-info">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Net</h6>
                                <h4 className="mb-0 fw-bold text-info">{formatCurrency(total_net)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-primary">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Ortalama Aylık</h6>
                                <h4 className="mb-0 fw-bold text-primary">{formatCurrency(average_monthly)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Çalışan</h6>
                                <h4 className="mb-0 fw-bold">{formatNumber(totalEmployees)}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aylık Detaylar */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-calendar me-2"></i>{year} Yılı Aylık Maaş Detayları</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Ay</th>
                                        <th className="text-end">Çalışan</th>
                                        <th className="text-end">Toplam Brüt</th>
                                        <th className="text-end">Kesinti</th>
                                        <th className="text-end">Net</th>
                                        <th className="text-end">Kişi Başı</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(monthly_data || []).map((month, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-medium">{months[parseInt(month.month) - 1] || month.month}</td>
                                            <td className="text-end">{formatNumber(month.employee_count)}</td>
                                            <td className="text-end">{formatCurrency(month.gross)}</td>
                                            <td className="text-end text-danger">{formatCurrency(month.deductions)}</td>
                                            <td className="text-end fw-semibold">{formatCurrency(month.net)}</td>
                                            <td className="text-end text-muted">
                                                {formatCurrency(month.gross / Math.max(month.employee_count, 1))}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="table-light fw-bold">
                                        <td>TOPLAM</td>
                                        <td className="text-end">{formatNumber(totalEmployees)}</td>
                                        <td className="text-end">{formatCurrency((monthly_data || []).reduce((s, m) => s + m.gross, 0))}</td>
                                        <td className="text-end text-danger">{formatCurrency((monthly_data || []).reduce((s, m) => s + m.deductions, 0))}</td>
                                        <td className="text-end">{formatCurrency((monthly_data || []).reduce((s, m) => s + m.net, 0))}</td>
                                        <td className="text-end">{formatCurrency(total_gross / 12)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Trend Grafik */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-chart-bar me-2"></i>{year} Yılı Brüt Maaş Trendi</h5>
                    </div>
                    <div className="card-body">
                        {(monthly_data || []).map((month, idx) => {
                            const maxGross = Math.max(...(monthly_data || []).map(m => m.gross), 1);
                            const percent = (month.gross / maxGross) * 100;
                            return (
                                <div key={idx} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="fw-medium">{months[parseInt(month.month) - 1] || month.month}</span>
                                        <span className="text-muted">{formatCurrency(month.gross)}</span>
                                    </div>
                                    <div className="progress payrall-progress-height-tall">
                                        <div className="progress-bar bg-success" style={{ width: `${percent}%` }}>
                                            {formatCurrency(month.gross)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}