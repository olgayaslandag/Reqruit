import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatCurrency, formatNumber } from '@/Utils/formatters';

export default function DepartmentSummary({ summary, period }) {
    const data = summary || [];
    const totalEmployees = data.reduce((sum, item) => sum + (item.employee_count || 0), 0);
    const totalGross = data.reduce((sum, item) => sum + (item.total_gross || 0), 0);
    const totalDeductions = data.reduce((sum, item) => sum + (item.total_deductions || 0), 0);
    const totalNet = data.reduce((sum, item) => sum + (item.total_net || 0), 0);

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: `Departman Bazlı Bordro - ${period?.name}`,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro Raporları', url: route('admin.payroll-reports.index') },
                    { label: 'Departman', url: '#' },
                ],
                backUrl: route('admin.payroll-reports.index'),
            }}
        >
            <Head title={`Departmanlar - ${period?.name}`} />

            <div className="container-fluid py-4">
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-building me-2"></i>Departman Bazlı Maaş Özeti ({data.length} departman)</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Departman</th>
                                        <th className="text-end">Çalışan</th>
                                        <th className="text-end">Toplam Brüt</th>
                                        <th className="text-end">Kesinti</th>
                                        <th className="text-end">Net</th>
                                        <th className="text-end">Ort. Brüt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-medium">{item.department?.name || 'Tanımsız'}</td>
                                            <td className="text-end">{formatNumber(item.employee_count)}</td>
                                            <td className="text-end">{formatCurrency(item.total_gross)}</td>
                                            <td className="text-end text-danger">{formatCurrency(item.total_deductions)}</td>
                                            <td className="text-end fw-semibold">{formatCurrency(item.total_net)}</td>
                                            <td className="text-end text-muted">{formatCurrency(item.average_gross)}</td>
                                        </tr>
                                    ))}
                                    <tr className="table-light fw-bold">
                                        <td>TOPLAM</td>
                                        <td className="text-end">{formatNumber(totalEmployees)}</td>
                                        <td className="text-end">{formatCurrency(totalGross)}</td>
                                        <td className="text-end text-danger">{formatCurrency(totalDeductions)}</td>
                                        <td className="text-end">{formatCurrency(totalNet)}</td>
                                        <td className="text-end">{formatCurrency(totalGross / Math.max(totalEmployees, 1))}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Grafik */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="ti ti-chart-pie me-2"></i>Departmanlara Göre Maaş Dağılımı</h5>
                    </div>
                    <div className="card-body">
                        {data.slice(0, 5).map((item, idx) => {
                            const maxGross = Math.max(...data.map(d => d.total_gross), 1);
                            const percent = (item.total_gross / maxGross) * 100;
                            return (
                                <div key={idx} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="fw-medium">{item.department?.name || 'Tanımsız'}</span>
                                        <span className="text-muted">{formatCurrency(item.total_gross)}</span>
                                    </div>
                                    <div className="progress" style={{ height: '20px' }}>
                                        <div className="progress-bar bg-info" style={{ width: `${percent}%` }}></div>
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