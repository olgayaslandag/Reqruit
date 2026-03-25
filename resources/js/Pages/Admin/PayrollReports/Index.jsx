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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Bordro Raporları
                </h2>
            }
        >
            <Head title="Bordro Raporları" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Rapor Türleri */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Genel Raporlar</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('admin.payroll-reports.compare')}
                                    className="block p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                    <div className="font-medium text-blue-800">Dönem Karşılaştırma Raporu</div>
                                    <div className="text-sm text-blue-600 mt-1">Farklı dönemlerin maaş ve bordro verilerini karşılaştırın</div>
                                </Link>

                                <Link
                                    href={route('admin.payroll-reports.annual')}
                                    className="block p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                    <div className="font-medium text-blue-800">Yıllık Özet Rapor</div>
                                    <div className="text-sm text-blue-600 mt-1">Yıl bazında maaş ve kesintileri görüntüleyin</div>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Dönem Bazlı Raporlar</h3>
                            <p className="text-sm text-gray-600 mb-4">Aşağıdaki dönemler için detaylı raporlar görüntüleyebilirsiniz:</p>

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {periods && periods.length > 0 ? (
                                    periods.map((period) => (
                                        <Link
                                            key={period.id}
                                            href={route('admin.payroll-reports.summary', period.id)}
                                            className="block p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="font-medium text-gray-800">{period.name}</div>
                                            <div className="text-xs text-gray-600">
                                                {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-3 text-gray-500 italic">Bordrosu yayınlanan dönem bulunmuyor</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hızlı Rapor Erişimi */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dönem Bazlı Rapor Türleri</h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Link
                                href={route('admin.payroll-reports.summary', periods[0]?.id || '0')}
                                className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="text-lg text-green-800">📊</div>
                                <div className="mt-2 font-medium text-green-800">Özet Rapor</div>
                                <div className="text-xs text-green-600 mt-1">Tüm çalışanlar ve kalemler</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.taxSummary', periods[0]?.id || '0')}
                                className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="text-lg text-purple-800">📋</div>
                                <div className="mt-2 font-medium text-purple-800">Vergi ve SGK Raporu</div>
                                <div className="text-xs text-purple-600 mt-1">İşe塌ed ve işveren payları</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.departmentSummary', periods[0]?.id || '0')}
                                className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="text-lg text-yellow-800">🏢</div>
                                <div className="mt-2 font-medium text-yellow-800">Departman Raporu</div>
                                <div className="text-xs text-purple-600 mt-1">Departman bazlı analiz</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.taxSummary', periods[0]?.id || '0')}
                                className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="text-lg text-purple-800">📋</div>
                                <div className="mt-2 font-medium text-purple-800">Vergi ve SGK Raporu</div>
                                <div className="text-xs text-purple-600 mt-1">İşe塌ed ve işveren payları</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.departmentSummary', periods[0]?.id || '0')}
                                className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="text-lg text-yellow-800">🏢</div>
                                <div className="mt-2 font-medium text-yellow-800">Departman Raporu</div>
                                <div className="text-xs text-yellow-600 mt-1">Departman bazlı analiz</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.taxSummary', periods[0]?.id || '0')}
                                className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="text-lg text-purple-800">📋</div>
                                <div className="mt-2 font-medium text-purple-800">Vergi ve SGK Raporu</div>
                                <div className="text-xs text-purple-600 mt-1">İşe塌ed ve işveren payları</div>
                            </Link>

                            <Link
                                href={route('admin.payroll-reports.departmentSummary', periods[0]?.id || '0')}
                                className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors text-center"
                                disabled={!periods || periods.length === 0}
                            >
                                <div className="text-lg text-yellow-800">🏢</div>
                                <div className="mt-2 font-medium text-yellow-800">Departman Raporu</div>
                                <div className="text-xs text-yellow-600 mt-1">Departman bazlı analiz</div>
                            </Link>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center opacity-50">
                                <div className="text-lg text-gray-800">💰</div>
                                <div className="mt-2 font-medium text-gray-800">Maaş Hesapları</div>
                                <div className="text-xs text-gray-600 mt-1">Çalışan maaş hesapları</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
