import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDate } from '@/Utils/formatters';

/**
 * Bordro raporları ana sayfası
 * GET /admin/payroll-reports
 */
export default function Index({ periods }) {
    return (
        <AuthenticatedLayout
            header={
                <h5 className="fw-semibold">
                    Bordro Raporları
                </h5>
            }
        >
            <Head title="Bordro Raporları" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Rapor Türleri */}
                    <div className="d-grid d-grid-cols-1 gap-4 mb-8">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium">Genel Raporlar</h5>
                            <div className="space-y-3">
                                <Link
                                    href={route('admin.payroll-reports.compare')}
                                    className="d-block p-4 bg-blue-50 rounded border border-blue-200 hover:bg-primary bg-opacity-10 -colors"
                                >
                                    <div className="fw-medium text-info">Dönem Karşılaştırma Raporu</div>
                                    <div className="fs-sm text-info mt-1">Farklı dönemlerin maaş ve bordro verilerini karşılaştırın</div>
                                </Link>

                                <Link
                                    href={route('admin.payroll-reports.annual')}
                                    className="d-block p-4 bg-blue-50 rounded border border-blue-200 hover:bg-primary bg-opacity-10 -colors"
                                >
                                    <div className="fw-medium text-info">Yıllık Özet Rapor</div>
                                    <div className="fs-sm text-info mt-1">Yıl bazında maaş ve kesintileri görüntüleyin</div>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <h5 className="fw-medium">Dönem Bazlı Raporlar</h5>
                            <p className="fs-sm text-muted mb-4">Aşağıdaki dönemler için detaylı raporlar görüntüleyebilirsiniz:</p>

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {periods && periods.length > 0 ? (
                                    periods.map((period) => (
                                        <Link
                                            key={period.id}
                                            href={route('admin.payroll-reports.summary', period.id)}
                                            className="d-block p-3 table-light rounded border border-secondary hover:bg-light -colors"
                                        >
                                            <div className="fw-medium text-dark">{period.name}</div>
                                            <div className="fs-xs text-muted">
                                                {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-3 text-muted italic">Bordrosu yayınlanan dönem bulunmuyor</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hızlı Rapor Erişimi */}
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h5 className="fw-medium">Dönem Bazlı Rapor Türleri</h5>

                        <div className="d-grid d-grid-cols-1 gap-3">
                            <Link
                                href={route('admin.payroll-reports.summary', periods[0]?.id || '0')}
                                className="p-4 bg-green-50 rounded border border-green-200 hover:bg-success bg-opacity-10 -colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="fs-3 text-success">📊</div>
                                <div className="mt-2 fw-medium text-success">Özet Rapor</div>
                                <div className="fs-xs text-success mt-1">Tüm çalışanlar ve kalemler</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.taxSummary', periods[0]?.id || '0')}
                                className="p-4 bg-purple-50 rounded border border-purple-200 hover:bg-purple-100 -colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="fs-3 text-purple-800">📋</div>
                                <div className="mt-2 fw-medium text-purple-800">Vergi ve SGK Raporu</div>
                                <div className="fs-xs text-purple-600 mt-1">İşe塌ed ve işveren payları</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.departmentSummary', periods[0]?.id || '0')}
                                className="p-4 bg-yellow-50 rounded border border-yellow-200 hover:bg-warning bg-opacity-10 -colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="fs-3 text-warning">🏢</div>
                                <div className="mt-2 fw-medium text-warning">Departman Raporu</div>
                                <div className="fs-xs text-purple-600 mt-1">Departman bazlı analiz</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.taxSummary', periods[0]?.id || '0')}
                                className="p-4 bg-purple-50 rounded border border-purple-200 hover:bg-purple-100 -colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="fs-3 text-purple-800">📋</div>
                                <div className="mt-2 fw-medium text-purple-800">Vergi ve SGK Raporu</div>
                                <div className="fs-xs text-purple-600 mt-1">İşe塌ed ve işveren payları</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.departmentSummary', periods[0]?.id || '0')}
                                className="p-4 bg-yellow-50 rounded border border-yellow-200 hover:bg-warning bg-opacity-10 -colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="fs-3 text-warning">🏢</div>
                                <div className="mt-2 fw-medium text-warning">Departman Raporu</div>
                                <div className="fs-xs text-warning mt-1">Departman bazlı analiz</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.taxSummary', periods[0]?.id || '0')}
                                className="p-4 bg-purple-50 rounded border border-purple-200 hover:bg-purple-100 -colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="fs-3 text-purple-800">📋</div>
                                <div className="mt-2 fw-medium text-purple-800">Vergi ve SGK Raporu</div>
                                <div className="fs-xs text-purple-600 mt-1">İşe塌ed ve işveren payları</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.departmentSummary', periods[0]?.id || '0')}
                                className="p-4 bg-yellow-50 rounded border border-yellow-200 hover:bg-warning bg-opacity-10 -colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="fs-3 text-warning">🏢</div>
                                <div className="mt-2 fw-medium text-warning">Departman Raporu</div>
                                <div className="fs-xs text-warning mt-1">Departman bazlı analiz</div>
                            </Link>

                            <div className="p-4 table-light rounded border border-secondary text-center opacity-50">
                                <div className="fs-3 text-dark">💰</div>
                                <div className="mt-2 fw-medium text-dark">Maaş Hesapları</div>
                                <div className="fs-xs text-muted mt-1">Çalışan maaş hesapları</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
