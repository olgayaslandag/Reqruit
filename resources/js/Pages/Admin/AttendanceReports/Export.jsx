import { useState, useRef } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDateTime } from '@/Utils/formatters.jsx';

export default function Export() {
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
            pageHeader={{
                title: 'Devam Raporları Dışa Aktar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Raporlar', url: route('admin.reports.index') },
                    { label: 'Devam Raporları', url: route('admin.attendance-reports.index') },
                    { label: 'Dışa Aktar', url: route('admin.attendance-reports.export') },
                ],
            }}
        >
            <Head title="Rapor Dışa Aktar" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Dışa Aktarma Ayarları</h5>
                            <p className="mt-1 fs-sm text-muted">Rapor türünü seçip filtreleyerek dışa aktarma işlemini başlatın.</p>
                        </div>

                        <div className="p-4 mb-3">
                            {/* Rapor Türü Seçimi */}
                            <div className="d-grid d-grid-cols-1 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-2">
                                        Rapor Türü
                                    </label>
                                    <select className="form-control" value={exportParams.report_type}
                                        onChange={(e) => handleChange('report_type', e.target.value)}
                                    >
                                        <option value="daily">Günlük Devam Raporu</option>
                                        <option value="monthly">Aylık Devam Raporu</option>
                                        <option value="overtime">Fazla Mesai Raporu</option>
                                        <option value="summary">Devam Özeti</option>
                                        <option value="leave">İzinli Personel Raporu</option>
                                        <option value="schedule">Vardiya Raporu</option>
                                    </select>
                                    <p className="mt-1 fs-xs text-muted">
                                        {reportDescriptions[exportParams.report_type]}
                                    </p>
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-2">
                                        Dışa Aktarım Biçimi
                                    </label>
                                    <select className="form-control" value={exportParams.export_format}
                                        onChange={(e) => handleChange('export_format', e.target.value)}
                                    >
                                        <option value="excel">Microsoft Excel (.xlsx)</option>
                                        <option value="pdf">PDF Belgesi (.pdf)</option>
                                        <option value="csv">CSV Format (.csv)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tarih Aralığı Seçimi */}
                            <div className="d-grid d-grid-cols-1 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-2">
                                        Başlangıç Tarihi
                                    </label>
                                    <input className="form-control" type="date"
                                        value={exportParams.start_date}
                                        onChange={(e) => handleChange('start_date', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-2">
                                        Bitiş Tarihi
                                    </label>
                                    <input className="form-control" type="date"
                                        value={exportParams.end_date}
                                        onChange={(e) => handleChange('end_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Personel Filtresi */}
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-2">
                                    Personel (Opsiyonel)
                                </label>
                                    <select className="form-control" value={exportParams.employee_id}
                                        onChange={(e) => handleChange('employee_id', e.target.value)}
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
                            <div className="border-t border-secondary pt-4">
                                <legend className="fs-sm fw-medium text-dark">Ekstra Seçenekler</legend>
                                <div className="mt-2 space-y-2">
                                    <div className="d-flex align-items-start">
                                        <input
                                            id="include-summary"
                                            type="checkbox"
                                            checked={exportParams.include_summary}
                                            onChange={(e) => handleChange('include_summary', e.target.checked)}
                                            className="h-4 w-4 text-primary focus: border-secondary rounded"
                                        />
                                        <label htmlFor="include-summary" className="ml-2 d-block fs-sm text-dark">
                                            Genel özet dahil et
                                        </label>
                                    </div>
                                    <div className="d-flex align-items-start">
                                        <input
                                            type="checkbox"
                                            id="include-details"
                                            checked={exportParams.include_detailed_records}
                                            onChange={(e) => handleChange('include_detailed_records', e.target.checked)}
                                            className="h-4 w-4 text-primary focus: border-secondary rounded"
                                        />
                                        <label htmlFor="include-details" className="ml-2 d-block fs-sm text-dark">
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
                                    className="btn btn-primary disabled:opacity-50"
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
                        <div className="mt-6 bg-white rounded-3 shadow-sm-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-secondary">
                                <h5 className="fw-medium">Son Dışa Aktarılan Dosyalar</h5>
                                <p className="mt-1 fs-sm text-muted">Önceden oluşturulan raporlar listesi</p>
                            </div>

                            <div className="overflow-auto">
                                <table className="w-100 divide-y divide-gray-200">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                                Rapor Adı
                                            </th>
                                            <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                                Tarih Aralığı
                                            </th>
                                            <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                                Biçim
                                            </th>
                                            <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                                Oluşturma Tarihi
                                            </th>
                                            <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                                Eylemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                         {props.exportHistory.map(historyItem => (
                                             <tr key={historyItem.id} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap fs-sm fw-medium text-dark">
                                                    {historyItem.filename}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-muted">
                                                    {historyItem.start_date} - {historyItem.end_date}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className="px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill bg-primary bg-opacity-10 text-info">
                                                        {historyItem.format.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-muted">
                                                    {formatDateTime(historyItem.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm">
                                                    <button
                                                        onClick={() => window.open(historyItem.download_url, '_blank')}
                                                        className="text-primary hover:text-indigo-900"
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
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
                        <div className="d-flex">
                            <div className="d-flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h5 className="fw-medium">Dışa Aktarım Notları</h5>
                                <div className="mt-2 fs-sm text-info space-y-1">
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