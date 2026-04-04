import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

export default function TaxSummary({ summary }) {
    const { period, sgk, income_tax, stamp_tax, total_deductions, total_net, total_employer_cost, total_gross } = summary;

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: `Vergi ve SGK Özeti - ${period?.name}`,
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Bordro Raporları', url: route('admin.payroll-reports.index') },
                    { label: 'Vergi ve SGK Özeti', url: '#' },
                ],
                backUrl: route('admin.payroll-reports.index'),
            }}
        >
            <Head title={`Vergi ve SGK Özeti - ${period?.name}`} />

            <div className="container-fluid py-4">
                {/* Özet Kartlar */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card border-start border-primary border-4">
                            <div className="card-body">
                                <h6 className="text-muted mb-1">Brüt Ücret</h6>
                                <h4 className="mb-0 fw-bold">{formatCurrency(total_gross)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-start border-danger border-4">
                            <div className="card-body">
                                <h6 className="text-muted mb-1">SGK İşçi Payı</h6>
                                <h4 className="mb-0 fw-bold text-danger">{formatCurrency(sgk.employee_share)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-start border-warning border-4">
                            <div className="card-body">
                                <h6 className="text-muted mb-1">Gelir Vergisi</h6>
                                <h4 className="mb-0 fw-bold text-warning">{formatCurrency(income_tax)}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* SGK Tablosu */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0"><i className="ti ti-shield me-2"></i>SGK Payları</h5>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-hover mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="fw-medium">SGK İşçi Payı</td>
                                            <td className="text-end">{formatCurrency(sgk.employee_share)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">SGK İşyeri Payı (İşveren)</td>
                                            <td className="text-end">{formatCurrency(sgk.employer_share)}</td>
                                        </tr>
                                        <tr className="table-light fw-bold">
                                            <td>Toplam SGK Payları</td>
                                            <td className="text-end">{formatCurrency(sgk.total)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Vergi ve Diğer Tablosu */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0"><i className="ti ti-receipt me-2"></i>Vergi ve Kesintiler</h5>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-hover mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="fw-medium">Gelir Vergisi</td>
                                            <td className="text-end">{formatCurrency(income_tax)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Damga Vergisi</td>
                                            <td className="text-end">{formatCurrency(stamp_tax)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Toplam Kesintiler (İşçi)</td>
                                            <td className="text-end text-danger">{formatCurrency(total_deductions)}</td>
                                        </tr>
                                        <tr className="table-light fw-bold">
                                            <td>Net Ücret</td>
                                            <td className="text-end">{formatCurrency(total_net)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* İşveren Maliyeti */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header bg-purple">
                                <h5 className="mb-0 text-white"><i className="ti ti-briefcase me-2"></i>İşveren Maliyeti Özeti</h5>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-hover mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="fw-medium">Toplam Brüt Ücret</td>
                                            <td className="text-end">{formatCurrency(total_gross)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">SGK İşyeri Payı (İşveren)</td>
                                            <td className="text-end">{formatCurrency(sgk.employer_share)}</td>
                                        </tr>
                                        <tr className="table-light fw-bold">
                                            <td>Toplam İşveren Maliyeti</td>
                                            <td className="text-end fw-bold">{formatCurrency(total_employer_cost)}</td>
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