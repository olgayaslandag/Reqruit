import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ component }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Maaş Kalemı Detayı
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.salary-components.edit', component.id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                        >
                            Düzenle
                        </Link>
                        <Link
                            href={route('admin.salary-components.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                            Geri Dön
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Maaş Kalemı - ${component.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Genel Bilgiler</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Ad</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{component.name}</dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Kod</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{component.code}</dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Tip</dt>
                                            <dd className="mt-1 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    component.type === 'earning' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {component.type === 'earning' ? 'Kazanç' : 'Kesinti'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Kategori</dt>
                                            <dd className="mt-1 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    component.category === 'fixed' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {component.category === 'fixed' ? 'Sabit' : 'Değişken'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Varsayılan Tutar</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {component.default_amount ? `${component.default_amount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ₺` : '-'}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Sıralama</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{component.sort_order}</dd>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ayarlar</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Durum</dt>
                                            <dd className="mt-1 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    component.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {component.is_active ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Vergiye Tabi</dt>
                                            <dd className="mt-1 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    component.is_taxable 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {component.is_taxable ? 'Evet' : 'Hayır'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">SGK Uygulanır</dt>
                                            <dd className="mt-1 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    component.is_sgk_applicable 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {component.is_sgk_applicable ? 'Evet' : 'Hayır'}
                                                </span>
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Açıklama</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
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