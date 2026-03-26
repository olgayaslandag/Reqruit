import { useState, useRef } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDateTime } from '@/Utils/formatters.jsx';

export default function Export() {
    const { props } = usePage();
    const flash = props.flash;
    
    const [exportParams, setExportParams] = useState({
        report_type: 'daily',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        employee_id: '',
        export_format: 'excel',
        include_summary: true
    });

    const handleChange = (field, value) => {
        setExportParams(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            ...exportParams,
            download: 1 // belirtiyor ki dosya indirilmeli
        });
        
        // Inertia yerine direk window.location ile PDF/excel dosyasını aç
        const exportRoute = route('admin.attendance-reports.export.process');
        window.open(`${exportRoute}?${params}`, '_blank');
    };

    // Raporların kısa açıklamaları
    const reportDescriptions = {
        'daily': 'Bir gün içindeki tüm çalışanların devam kayıtlarını içerir.',
        'monthly': 'Seçilen ay boyunca tüm çalışanların detaylı devam kayıtlarını içerir.',
        'overtime': 'Fazla mesai yapan çalışanların detaylı istatistiklerini içerir.',
        'summary': 'Genel devam özetini gösteren rapordur.',
        'leave': 'İzinli çalışanların belirtilen aralıktaki durumunu içerir.',
        'schedule': 'Vardiyalara göre çalışan devam kayıtlarını içerir.'
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Devam Raporları Dışa Aktar
                    </h2>
                </div>
            }
        >
            <Head title="Rapor Dışa Aktar" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Dışa Aktarma Ayarları</h3>
                            <p className="mt-1 text-sm text-gray-600">Rapor türünü seçip filtreleyerek dışa aktarma işlemini başlatın.</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Rapor Türü Seçimi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rapor Türü
                                    </label>
                                    <select
                                        value={exportParams.report_type}
                                        onChange={(e) => handleChange('report_type', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="daily">Günlük Devam Raporu</option>
                                        <option value="monthly">Aylık Devam Raporu</option>
                                        <option value="overtime">Fazla Mesai Raporu</option>
                                        <option value="summary">Devam Özeti</option>
                                        <option value="leave">İzinli Personel Raporu</option>
                                        <option value="schedule">Vardiya Raporu</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {reportDescriptions[exportParams.report_type]}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dışa Aktarım Biçimi
                                    </label>
                                    <select
                                        value={exportParams.export_format}
                                        onChange={(e) => handleChange('export_format', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="excel">Microsoft Excel (.xlsx)</option>
                                        <option value="pdf">PDF Belgesi (.pdf)</option>
                                        <option value="csv">CSV Format (.csv)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tarih Aralığı Seçimi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Başlangıç Tarihi
                                    </label>
                                    <input
                                        type="date"
                                        value={exportParams.start_date}
                                        onChange={(e) => handleChange('start_date', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bitiş Tarihi
                                    </label>
                                    <input
                                        type="date"
                                        value={exportParams.end_date}
                                        onChange={(e) => handleChange('end_date', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Personel Filtresi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Personel (Opsiyonel)
                                </label>
                                <select
                                    value={exportParams.employee_id}
                                    onChange={(e) => handleChange('employee_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Tüm Personel</option>
                                    {props.employees?.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.first_name} {employee.last_name} ({employee.identity_no})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ekstra Seçenekler */}
                            <div className="border-t border-gray-200 pt-4">
                                <legend className="text-sm font-medium text-gray-700">Ekstra Seçenekler</legend>
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-start">
                                        <input
                                            id="include-summary"
                                            type="checkbox"
                                            checked={exportParams.include_summary}
                                            onChange={(e) => handleChange('include_summary', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="include-summary" className="ml-2 block text-sm text-gray-700">
                                            Genel özet dahil et
                                        </label>
                                    </div>
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="include-details"
                                            checked={exportParams.include_detailed_records}
                                            onChange={(e) => handleChange('include_detailed_records', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="include-details" className="ml-2 block text-sm text-gray-700">
                                            Ayrıntılı kayıtlar dahil et
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Dışa Aktar Butonu */}
                            <div className="pt-4">
                                <button
                                    onClick={handleExport}
                                    disabled={!exportParams.start_date || !exportParams.end_date}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Raporu Dışa Aktar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Geçmiş Aktarımlar */}
                    {props.exportHistory && props.exportHistory.length > 0 && (
                        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Son Dışa Aktarılan Dosyalar</h3>
                                <p className="mt-1 text-sm text-gray-600">Önceden oluşturulan raporlar listesi</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rapor Adı
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tarih Aralığı
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Biçim
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Oluşturma Tarihi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Eylemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {props.exportHistory.map((historyItem, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {historyItem.filename}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {historyItem.start_date} - {historyItem.end_date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {historyItem.format.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDateTime(historyItem.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => window.open(historyItem.download_url, '_blank')}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        İndir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Yardım Metni */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Dışa Aktarım Notları</h3>
                                <div className="mt-2 text-sm text-blue-700 space-y-1">
                                    <p>Raporları Excel veya PDF formatında dışa aktarabilirsiniz.</p>
                                    <p>Aralıkta çok fazla veri varsa dışa aktarım işlemi birkaç dakika sürebilir.</p>
                                    <p>Geçmiş verileri ve önceden oluşturulan raporları bu sayfada görebilirsiniz.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}