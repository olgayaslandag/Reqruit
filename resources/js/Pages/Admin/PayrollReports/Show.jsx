import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

// Basit ve genel bir dashboard layout'ı temsil eden componente
export default function Show({ periods }) {
    // Periods listesi zaten backend'den gelmiş
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Bordro Raporları
                    </h2>
                    <Link
                        href={route('admin.payrolls.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Bordrolara Dön
                    </Link>
                </div>
            }
        >
            <Head title="Bordro Raporları" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Mevcut Yayınlanmış Bordro Dönemleri</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dönem Adı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Başlangıç - Bitiş Tarihi
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Çalışan Sayısı
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hareketler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {periods.map((period, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {period.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {period.status.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(period.start_date).toLocaleDateString('tr-TR')}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(period.end_date).toLocaleDateString('tr-TR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                0 {/* Actually this would come from server with calculation */}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {/* Raporlama seçenekleri */}
                                                    <Link
                                                        href={route('admin.payroll-reports.summary', period.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Özet Rapor
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        href={route('admin.payroll-reports.taxSummary', period.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Vergi Raporu
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        href={route('admin.payroll-reports.departmentSummary', period.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
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
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Genel İstatistik Raporu */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Genel İstatistik Raporu</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Belirli döneme özel genel istatistikleri gösterir
                            </p>
                        </div>

                        {/* Comparision Report */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Karşılaştırmalı Rapor</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Birden fazla dönem arasında maaş karşılaştırması
                            </p>
                            <Link
                                href={route('admin.payroll-reports.compare')}
                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                                Rapor Üret
                            </Link>
                        </div>

                        {/* Annual Report */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Yıllık Rapor</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Belirli yıla ait yıllık maaş ve bordro özeti
                            </p>
                            <Link
                                href={route('admin.payroll-reports.annual')}
                                className="text-indigo-600 hover:text-indigo-900 text-sm"
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