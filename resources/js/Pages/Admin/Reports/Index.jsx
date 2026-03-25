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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Bordro Raporları
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => downloadReport(selectedReport, 'excel')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </button>
                        <button
                            onClick={() => downloadReport(selectedReport, 'pdf')}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 text-sm"
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sol Panel - Rapor Seçimi */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Raporlar</h3>
                            {reportTypes.map((report) => (
                                <button
                                    key={report.id}
                                    onClick={() => setSelectedReport(report.id)}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition ${
                                        selectedReport === report.id
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <svg className={`w-6 h-6 ${selectedReport === report.id ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={report.icon} />
                                        </svg>
                                        <div>
                                            <div className="font-medium text-gray-900">{report.name}</div>
                                            <div className="text-xs text-gray-500">{report.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Sağ Panel - Rapor İçeriği */}
                        <div className="lg:col-span-3">
                            {/* Genel Özet */}
                            {selectedReport === 'summary' && summary && (
                                <div className="space-y-6">
                                    {/* İstatistikler */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <div className="text-sm text-gray-500">Toplam Dönem</div>
                                            <div className="text-2xl font-bold text-gray-900">{summary.total_periods}</div>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <div className="text-sm text-gray-500">Toplam Çalışan</div>
                                            <div className="text-2xl font-bold text-gray-900">{summary.total_employees}</div>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <div className="text-sm text-gray-500">Toplam Brüt</div>
                                            <div className="text-2xl font-bold text-indigo-600">{formatCurrency(summary.total_gross)}</div>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <div className="text-sm text-gray-500">Toplam Net</div>
                                            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_net)}</div>
                                        </div>
                                    </div>

                                    {/* Son Dönemler */}
                                    <div className="bg-white rounded-lg shadow">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800">Son Bordro Dönemleri</h3>
                                        </div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dönem</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Çalışan</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brüt</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kesinti</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {summary.recent_periods?.map((period) => (
                                                    <tr key={period.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{period.name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{period.employee_count}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(period.total_gross)}</td>
                                                        <td className="px-4 py-3 text-sm text-red-600">{formatCurrency(period.total_deductions)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(period.total_net)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Aylık Rapor */}
                            {selectedReport === 'monthly' && monthlyData && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg shadow">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800">Aylık Maliyet Analizi</h3>
                                        </div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ay</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Çalışan</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Brüt</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SGK Kesintisi</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vergi</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Net</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {monthlyData.map((month, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.period}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{month.employee_count}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(month.total_gross)}</td>
                                                        <td className="px-4 py-3 text-sm text-red-600">{formatCurrency(month.total_ssk)}</td>
                                                        <td className="px-4 py-3 text-sm text-red-600">{formatCurrency(month.total_tax)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(month.total_net)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50 font-medium">
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
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Maliyet Trendi</h3>
                                        <div className="h-64 flex items-center justify-center text-gray-400">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Departman Maliyetleri */}
                            {selectedReport === 'departments' && departmentCosts && (
                                <div className="bg-white rounded-lg shadow">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800">Departman Bazlı Maliyetler</h3>
                                    </div>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departman</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Çalışan</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ortalama Maaş</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Maliyet</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {departmentCosts.map((dept, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{dept.employee_count}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(dept.avg_salary)}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(dept.total_cost)}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{dept.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Çalışan Raporu */}
                            {selectedReport === 'employees' && topEmployees && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg shadow">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800">En Yüksek Maaşlı Çalışanlar</h3>
                                        </div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Çalışan</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departman</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pozisyon</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brüt Maaş</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Maaş</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {topEmployees.map((emp, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{emp.department}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{emp.position}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(emp.gross_salary)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(emp.net_salary)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">İstatistikler</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-500">Ortalama Maaş</div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {formatCurrency(topEmployees.reduce((sum, e) => sum + e.gross_salary, 0) / (topEmployees.length || 1))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Medyan Maaş</div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {formatCurrency(topEmployees[Math.floor(topEmployees.length / 2)]?.gross_salary || 0)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">En Düşük</div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {formatCurrency(Math.min(...topEmployees.map(e => e.gross_salary)))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">En Yüksek</div>
                                                <div className="text-xl font-bold text-gray-900">
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
