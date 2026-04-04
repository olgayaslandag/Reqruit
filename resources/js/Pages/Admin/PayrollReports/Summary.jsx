import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

export default function Summary({ summary }) {
    const { period, total_employees, total_earnings, total_deductions, net_total, by_component } = summary;

    const earnings = (by_component || []).filter(item => item.component?.type === 'earning');
    const deductions = (by_component || []).filter(item => item.component?.type === 'deduction');

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: `Bordro Özeti - ${period?.name}`,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro Raporları', url: route('admin.payroll-reports.index') },
                    { label: 'Özet', url: '#' },
                ],
                backUrl: route('admin.payroll-reports.index'),
            }}
        >
            <Head title={`Bordro Özeti - ${period?.name}`} />

            <div className="container-fluid py-4">
                {/* Özet Kartlar */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Çalışan</h6>
                                <h3 className="mb-0 fw-bold text-primary">{total_employees || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-success">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Gelir</h6>
                                <h3 className="mb-0 fw-bold text-success">{formatCurrency(total_earnings)}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-danger">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Toplam Kesinti</h6>
                                <h3 className="mb-0 fw-bold text-danger">{formatCurrency(total_deductions)}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-info">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Net Toplam</h6>
                                <h3 className="mb-0 fw-bold text-info">{formatCurrency(net_total)}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Kazanç Kalemleri */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0"><i className="ti ti-plus me-2"></i>Kazanç Kalemleri</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Kalem</th>
                                                <th className="text-end">Toplam</th>
                                                <th className="text-end">Kişi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {earnings.length > 0 ? (
                                                earnings.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="fw-medium">{item.component?.name}</td>
                                                        <td className="text-end">{formatCurrency(item.total_amount)}</td>
                                                        <td className="text-end text-muted">{item.employee_count}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={3} className="text-muted text-center">Veri yok</td></tr>
                                            )}
                                            <tr className="table-light fw-bold">
                                                <td>TOPLAM</td>
                                                <td className="text-end">{formatCurrency(total_earnings)}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kesinti Kalemleri */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header bg-danger text-white">
                                <h5 className="mb-0"><i className="ti ti-minus me-2"></i>Kesinti Kalemleri</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Kalem</th>
                                                <th className="text-end">Toplam</th>
                                                <th className="text-end">Kişi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deductions.length > 0 ? (
                                                deductions.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="fw-medium">{item.component?.name}</td>
                                                        <td className="text-end text-danger">{formatCurrency(item.total_amount)}</td>
                                                        <td className="text-end text-muted">{item.employee_count}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={3} className="text-muted text-center">Veri yok</td></tr>
                                            )}
                                            <tr className="table-light fw-bold">
                                                <td>TOPLAM</td>
                                                <td className="text-end text-danger">{formatCurrency(total_deductions)}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}