import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { InputLabel } from '@/Components/InputLabel';
import { TextInput } from '@/Components/TextInput';
import { InputError } from '@/Components/InputError';
import { Select } from '@/Components/Select';
import { PrimaryButton } from '@/Components/PrimaryButton';
import { Checkbox } from '@/Components/Checkbox';

export default function Edit({ component }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: component.name,
        code: component.code,
        type: component.type,
        category: component.category,
        description: component.description,
        is_active: component.is_active,
        is_taxable: component.is_taxable,
        is_sgk_applicable: component.is_sgk_applicable,
        default_amount: component.default_amount,
        sort_order: component.sort_order,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.salary-components.update', component.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Maaş Kalemini Güncelle - {component.name}
                    </h2>
                    <Link
                        href={route('admin.salary-components.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Geri Dön
                    </Link>
                </div>
            }
        >
            <Head title={`Maaş Kalemı Güncelle - ${component.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Kalem Adı */}
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="name" value="Kalem Adı" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Kod */}
                                    <div>
                                        <InputLabel htmlFor="code" value="Kod" />
                                        <TextInput
                                            id="code"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.code} className="mt-2" />
                                    </div>

                                    {/* Tip */}
                                    <div>
                                        <InputLabel htmlFor="type" value="Tip" />
                                        <Select
                                            id="type"
                                            className="mt-1 block w-full"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                        >
                                            <option value="earning">Kazanç</option>
                                            <option value="deduction">Kesinti</option>
                                        </Select>
                                        <InputError message={errors.type} className="mt-2" />
                                    </div>

                                    {/* Kategori */}
                                    <div>
                                        <InputLabel htmlFor="category" value="Kategori" />
                                        <Select
                                            id="category"
                                            className="mt-1 block w-full"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                        >
                                            <option value="fixed">Sabit</option>
                                            <option value="variable">Değişken</option>
                                        </Select>
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>

                                    {/* Varsayılan Tutar */}
                                    <div>
                                        <InputLabel htmlFor="default_amount" value="Varsayılan Tutar" />
                                        <TextInput
                                            id="default_amount"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.default_amount}
                                            onChange={(e) => setData('default_amount', e.target.value)}
                                            min="0"
                                        />
                                        <InputError message={errors.default_amount} className="mt-2" />
                                    </div>

                                    {/* Sıralama */}
                                    <div>
                                        <InputLabel htmlFor="sort_order" value="Sıralama" />
                                        <TextInput
                                            id="sort_order"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                            min="0"
                                        />
                                        <InputError message={errors.sort_order} className="mt-2" />
                                    </div>
                                </div>

                                {/* Açıklama */}
                                <div>
                                    <InputLabel htmlFor="description" value="Açıklama" />
                                    <textarea
                                        id="description"
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Seçenekler */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="flex items-start">
                                            <Checkbox
                                                name="is_active"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Aktif</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="flex items-start">
                                            <Checkbox
                                                name="is_taxable"
                                                checked={data.is_taxable}
                                                onChange={(e) => setData('is_taxable', e.target.checked)}
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Vergilendirilir</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="flex items-start">
                                            <Checkbox
                                                name="is_sgk_applicable"
                                                checked={data.is_sgk_applicable}
                                                onChange={(e) => setData('is_sgk_applicable', e.target.checked)}
                                            />
                                            <span className="ml-2 text-sm text-gray-600">SGK Uygulanır</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Güncelle
                                    </PrimaryButton>

                                    <Link
                                        href={route('admin.salary-components.index')}
                                        className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        İptal
                                    </Link>
                                </div>

                                {recentlySuccessful && (
                                    <p className="text-sm text-gray-600">Kaydedildi.</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}