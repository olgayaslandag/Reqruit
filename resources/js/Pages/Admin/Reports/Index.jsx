import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatCurrency, formatDate } from '@/Utils/formatters';

/**
 * Bordro Raporları
 * GET /admin/payroll-reports
 */
export default function Index({ summary, monthlyData, topEmployees, departmentCosts }) {
    const [selectedReport, setSelectedReport] = useState('summary');

    // Rapor tipleri
    const reportTypes = [
        {
            id: 'summary',
            name: 'Genel Özet',
            description: 'Tüm bordro dönemlerinin özeti',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        },
        {
            id: 'monthly',
            name: 'Aylık Rapor',
            description: 'Aylara göre mali analiz',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        },
        {
            id: 'departments',
            name: 'Departman Maliyetleri',
            description: 'Departman bazlı maliyet analizi',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        },
        {
            id: 'employees',
            name: 'Çalışan Raporu',
            description: 'Çalışan bazlı maliyet analizi',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        },
    ];

    // Rapor indir
    const downloadReport = (type, format = 'excel') => {
        router.get(route('admin.payrollReports.export'), {
            type,
            format,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Bordro Raporları
                    </h5>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => downloadReport(selectedReport, 'excel')}
                            className="btn btn-success btn-sm d-flex align-items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </button>
                        <button
                            onClick={() => downloadReport(selectedReport, 'pdf')}
                            className="btn btn-danger btn-sm d-flex align-items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Bordro Raporları" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="d-grid d-grid-cols-1 gap-4">
                        {/* Sol Panel - Rapor Seçimi */}
                        <div className="space-y-4">
                            <h5 className="fw-semibold">Raporlar</h5>
                            {reportTypes.map((report) => (
                                <button
                                    key={report.id}
                                    onClick={() => setSelectedReport(report.id)}
                                    className={`w-100 p-4 rounded border-2 text-left  ${
                                        selectedReport === report.id
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-secondary hover:border-secondary'
                                    }`}
                                >
                                    <div className="d-flex align-items-start gap-2">
                                        <svg className={`w-6 h-6 ${selectedReport === report.id ? 'text-primary' : 'text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={report.icon} />
                                        </svg>
                                        <div>
                                            <div className="fw-medium text-dark">{report.name}</div>
                                            <div className="fs-xs text-muted">{report.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Sağ Panel - Rapor İçeriği */}
                        <div className="">
                            {/* Genel Özet */}
                            {selectedReport === 'summary' && summary && (
                                <div className="mb-3">
                                    {/* İstatistikler */}
                                    <div className="d-grid d-grid-cols-1 gap-3">
                                        <div className="bg-white rounded-3 shadow-sm p-4">
                                            <div className="fs-sm text-muted">Toplam Dönem</div>
                                            <div className="fs-2 fw-bold text-dark">{summary.total_periods}</div>
                                        </div>
                                        <div className="bg-white rounded-3 shadow-sm p-4">
                                            <div className="fs-sm text-muted">Toplam Çalışan</div>
                                            <div className="fs-2 fw-bold text-dark">{summary.total_employees}</div>
                                        </div>
                                        <div className="bg-white rounded-3 shadow-sm p-4">
                                            <div className="fs-sm text-muted">Toplam Brüt</div>
                                            <div className="fs-2 fw-bold text-primary">{formatCurrency(summary.total_gross)}</div>
                                        </div>
                                        <div className="bg-white rounded-3 shadow-sm p-4">
                                            <div className="fs-sm text-muted">Toplam Net</div>
                                            <div className="fs-2 fw-bold text-success">{formatCurrency(summary.total_net)}</div>
                                        </div>
                                    </div>

                                    {/* Son Dönemler */}
                                    <div className="bg-white rounded-3 shadow-sm">
                                        <div className="p-4 border-b border-secondary">
                                            <h5 className="fw-semibold">Son Bordro Dönemleri</h5>
                                        </div>
                                        <table className="w-100 divide-y divide-gray-200">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Dönem</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Çalışan</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Brüt</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Kesinti</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Net</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {summary.recent_periods?.map((period) => (
                                                    <tr key={period.id} className="hover:table-light">
                                                        <td className="px-4 py-3 fs-sm fw-medium text-dark">{period.name}</td>
                                                        <td className="px-4 py-3 fs-sm text-dark">{period.employee_count}</td>
                                                        <td className="px-4 py-3 fs-sm text-dark">{formatCurrency(period.total_gross)}</td>
                                                        <td className="px-4 py-3 fs-sm text-danger">{formatCurrency(period.total_deductions)}</td>
                                                        <td className="px-4 py-3 fs-sm fw-medium text-dark">{formatCurrency(period.total_net)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Aylık Rapor */}
                            {selectedReport === 'monthly' && monthlyData && (
                                <div className="mb-3">
                                    <div className="bg-white rounded-3 shadow-sm">
                                        <div className="p-4 border-b border-secondary">
                                            <h5 className="fw-semibold">Aylık Maliyet Analizi</h5>
                                        </div>
                                        <table className="w-100 divide-y divide-gray-200">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Ay</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Çalışan</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Toplam Brüt</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">SGK Kesintisi</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Vergi</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Toplam Net</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {monthlyData.map((month, index) => (
                                                    <tr key={index} className="hover:table-light">
                                                        <td className="px-4 py-3 fs-sm fw-medium text-dark">{month.period}</td>
                                                        <td className="px-4 py-3 fs-sm text-dark">{month.employee_count}</td>
                                                        <td className="px-4 py-3 fs-sm text-dark">{formatCurrency(month.total_gross)}</td>
                                                        <td className="px-4 py-3 fs-sm text-danger">{formatCurrency(month.total_ssk)}</td>
                                                        <td className="px-4 py-3 fs-sm text-danger">{formatCurrency(month.total_tax)}</td>
                                                        <td className="px-4 py-3 fs-sm fw-medium text-dark">{formatCurrency(month.total_net)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="table-light fw-medium">
                                                <tr>
                                                    <td className="px-4 py-3">TOPLAM</td>
                                                    <td className="px-4 py-3">-</td>
                                                    <td className="px-4 py-3">{formatCurrency(monthlyData.reduce((sum, m) => sum + m.total_gross, 0))}</td>
                                                    <td className="px-4 py-3">{formatCurrency(monthlyData.reduce((sum, m) => sum + m.total_ssk, 0))}</td>
                                                    <td className="px-4 py-3">{formatCurrency(monthlyData.reduce((sum, m) => sum + m.total_tax, 0))}</td>
                                                    <td className="px-4 py-3">{formatCurrency(monthlyData.reduce((sum, m) => sum + m.total_net, 0))}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    {/* Grafik Alanı (ileride eklenebilir) */}
                                    <div className="bg-white rounded-3 shadow-sm p-4">
                                        <h5 className="fw-semibold">Maliyet Trendi</h5>
                                        <div className="h-64 d-flex align-items-center justify-content-center text-muted">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Departman Maliyetleri */}
                            {selectedReport === 'departments' && departmentCosts && (
                                <div className="bg-white rounded-3 shadow-sm">
                                    <div className="p-4 border-b border-secondary">
                                        <h5 className="fw-semibold">Departman Bazlı Maliyetler</h5>
                                    </div>
                                    <table className="w-100 divide-y divide-gray-200">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Departman</th>
                                                <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Çalışan</th>
                                                <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Ortalama Maaş</th>
                                                <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Toplam Maliyet</th>
                                                <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">%</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {departmentCosts.map((dept, index) => (
                                                <tr key={index} className="hover:table-light">
                                                    <td className="px-4 py-3 fs-sm fw-medium text-dark">{dept.name}</td>
                                                    <td className="px-4 py-3 fs-sm text-dark">{dept.employee_count}</td>
                                                    <td className="px-4 py-3 fs-sm text-dark">{formatCurrency(dept.avg_salary)}</td>
                                                    <td className="px-4 py-3 fs-sm fw-medium text-dark">{formatCurrency(dept.total_cost)}</td>
                                                    <td className="px-4 py-3 fs-sm text-muted">{dept.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Çalışan Raporu */}
                            {selectedReport === 'employees' && topEmployees && (
                                <div className="mb-3">
                                    <div className="bg-white rounded-3 shadow-sm">
                                        <div className="p-4 border-b border-secondary">
                                            <h5 className="fw-semibold">En Yüksek Maaşlı Çalışanlar</h5>
                                        </div>
                                        <table className="w-100 divide-y divide-gray-200">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Sıra</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Çalışan</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Departman</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Pozisyon</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Brüt Maaş</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Net Maaş</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {topEmployees.map((emp, index) => (
                                                    <tr key={index} className="hover:table-light">
                                                        <td className="px-4 py-3 fs-sm text-muted">{index + 1}</td>
                                                        <td className="px-4 py-3 fs-sm fw-medium text-dark">{emp.name}</td>
                                                        <td className="px-4 py-3 fs-sm text-dark">{emp.department}</td>
                                                        <td className="px-4 py-3 fs-sm text-dark">{emp.position}</td>
                                                        <td className="px-4 py-3 fs-sm text-dark">{formatCurrency(emp.gross_salary)}</td>
                                                        <td className="px-4 py-3 fs-sm fw-medium text-dark">{formatCurrency(emp.net_salary)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-white rounded-3 shadow-sm p-4">
                                        <h5 className="fw-semibold">İstatistikler</h5>
                                        <div className="d-grid d-grid-cols-2 gap-3">
                                            <div>
                                                <div className="fs-sm text-muted">Ortalama Maaş</div>
                                                <div className="fs-4 fw-bold text-dark">
                                                    {formatCurrency(topEmployees.reduce((sum, e) => sum + e.gross_salary, 0) / (topEmployees.length || 1))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fs-sm text-muted">Medyan Maaş</div>
                                                <div className="fs-4 fw-bold text-dark">
                                                    {formatCurrency(topEmployees[Math.floor(topEmployees.length / 2)]?.gross_salary || 0)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fs-sm text-muted">En Düşük</div>
                                                <div className="fs-4 fw-bold text-dark">
                                                    {formatCurrency(Math.min(...topEmployees.map(e => e.gross_salary)))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fs-sm text-muted">En Yüksek</div>
                                                <div className="fs-4 fw-bold text-dark">
                                                    {formatCurrency(Math.max(...topEmployees.map(e => e.gross_salary)))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
