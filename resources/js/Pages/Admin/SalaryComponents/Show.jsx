import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ component }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Maaş Kalemı Detayı
                    </h5>
                    <div className="d-flex gap-2">
                        <Link
                            href={route('admin.salary-components.edit', component.id)}
                            className="btn btn-primary btn-sm"
                        >
                            Düzenle
                        </Link>
                        <Link
                            href={route('admin.salary-components.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                        >
                            Geri Dön
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Maaş Kalemı - ${component.name}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm-sm">
                        <div className="p-4 text-dark">
                            <div className="d-grid d-grid-cols-1 gap-4">
                                <div>
                                    <h5 className="fw-medium">Genel Bilgiler</h5>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Ad</dt>
                                            <dd className="mt-1 fs-sm text-dark">{component.name}</dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Kod</dt>
                                            <dd className="mt-1 fs-sm text-dark">{component.code}</dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Tip</dt>
                                            <dd className="mt-1 fs-sm">
                                                <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                    component.type === 'earning' 
                                                        ? 'bg-success bg-opacity-10 text-success' 
                                                        : 'bg-danger bg-opacity-10 text-danger'
                                                }`}>
                                                    {component.type === 'earning' ? 'Kazanç' : 'Kesinti'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Kategori</dt>
                                            <dd className="mt-1 fs-sm">
                                                <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                    component.category === 'position-fixed' 
                                                        ? 'bg-primary bg-opacity-10 text-info' 
                                                        : 'bg-warning bg-opacity-10 text-warning'
                                                }`}>
                                                    {component.category === 'position-fixed' ? 'Sabit' : 'Değişken'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Varsayılan Tutar</dt>
                                            <dd className="mt-1 fs-sm text-dark">
                                                {component.default_amount ? `${component.default_amount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ₺` : '-'}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Sıralama</dt>
                                            <dd className="mt-1 fs-sm text-dark">{component.sort_order}</dd>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="fw-medium">Ayarlar</h5>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Durum</dt>
                                            <dd className="mt-1 fs-sm">
                                                <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                    component.is_active 
                                                        ? 'bg-success bg-opacity-10 text-success' 
                                                        : 'bg-light text-dark'
                                                }`}>
                                                    {component.is_active ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Vergiye Tabi</dt>
                                            <dd className="mt-1 fs-sm">
                                                <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                    component.is_taxable 
                                                        ? 'bg-success bg-opacity-10 text-success' 
                                                        : 'bg-light text-dark'
                                                }`}>
                                                    {component.is_taxable ? 'Evet' : 'Hayır'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">SGK Uygulanır</dt>
                                            <dd className="mt-1 fs-sm">
                                                <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                    component.is_sgk_applicable 
                                                        ? 'bg-success bg-opacity-10 text-success' 
                                                        : 'bg-light text-dark'
                                                }`}>
                                                    {component.is_sgk_applicable ? 'Evet' : 'Hayır'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="fs-sm fw-medium text-muted">Açıklama</dt>
                                            <dd className="mt-1 fs-sm text-dark">
                                                {component.description || '-'}
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}