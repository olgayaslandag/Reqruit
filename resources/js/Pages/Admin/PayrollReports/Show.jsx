import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

// Basit ve genel bir dashboard layout'ı temsil eden componente
export default function Show({ periods }) {
    // Periods listesi zaten backend'den gelmiş
    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Bordro Raporları
                    </h5>
                    <Link
                        href={route('admin.payrolls.index')}
                        className="btn btn-secondary btn-sm"
                    >
                        Bordrolara Dön
                    </Link>
                </div>
            }
        >
            <Head title="Bordro Raporları" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 table-light border-bottom border-secondary">
                            <h5 className="fw-medium">Mevcut Yayınlanmış Bordro Dönemleri</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="table table-hover w-100">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Dönem Adı
                                        </th>
                                        <th className="px-5 py-3 text-left fs-xs fw-medium text-muted text-uppercase ">
                                            Başlangıç - Bitiş Tarihi
                                        </th>
                                        <th className="px-5 py-3 text-right fs-xs fw-medium text-muted text-uppercase ">
                                            Çalışan Sayısı
                                        </th>
                                        <th className="px-5 py-3 text-right fs-xs fw-medium text-muted text-uppercase ">
                                            Hareketler
                                        </th>
                                    </tr>
                                </thead>
                                 <tbody className="bg-white">
                                     {periods.map(period => (
                                         <tr key={period.id} className="">
                                            <td className="px-5 py-4 text-nowrap">
                                                <div className="fs-sm fw-medium text-dark">
                                                    {period.name}
                                                </div>
                                                <div className="fs-sm text-muted">
                                                    {period.status.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-nowrap">
                                                <div className="fs-sm text-dark">
                                                    {new Date(period.start_date).toLocaleDateString('tr-TR')}
                                                </div>
                                                <div className="fs-sm text-muted">
                                                    {new Date(period.end_date).toLocaleDateString('tr-TR')}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-nowrap text-right fs-sm text-muted">
                                                0 {/* Actually this would come from server with calculation */}
                                            </td>
                                            <td className="px-5 py-4 text-nowrap text-right fs-sm fw-medium">
                                                <div className="d-flex justify-content-end gap-2">
                                                    {/* Raporlama seçenekleri */}
                                                    <Link
                                                        href={route('admin.payroll-reports.summary', period.id)}
                                                        className="text-primary "
                                                    >
                                                        Özet Rapor
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        href={route('admin.payroll-reports.taxSummary', period.id)}
                                                        className="text-primary "
                                                    >
                                                        Vergi Raporu
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        href={route('admin.payroll-reports.departmentSummary', period.id)}
                                                        className="text-primary "
                                                    >
                                                        Departman Raporu
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Rapor Seçenekleri */}
                    <div className="mt-8 d-grid d-grid-cols-1 gap-4">
                        {/* Genel İstatistik Raporu */}
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium">Genel İstatistik Raporu</h5>
                            <p className="fs-sm text-muted mb-4">
                                Belirli döneme özel genel istatistikleri gösterir
                            </p>
                        </div>

                        {/* Comparision Report */}
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium">Karşılaştırmalı Rapor</h5>
                            <p className="fs-sm text-muted mb-4">
                                Birden fazla dönem arasında maaş karşılaştırması
                            </p>
                            <Link
                                href={route('admin.payroll-reports.compare')}
                                className="text-primary  fs-sm"
                            >
                                Rapor Üret
                            </Link>
                        </div>

                        {/* Annual Report */}
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium">Yıllık Rapor</h5>
                            <p className="fs-sm text-muted mb-4">
                                Belirli yıla ait yıllık maaş ve bordro özeti
                            </p>
                            <Link
                                href={route('admin.payroll-reports.annual')}
                                className="text-primary  fs-sm"
                            >
                                Rapor Üret
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}