import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { InputLabel } from '@/Components/InputLabel';
import { TextInput } from '@/Components/TextInput';
import { InputError } from '@/Components/InputError';
import { Select } from '@/Components/Select';
import { PrimaryButton } from '@/Components/PrimaryButton';
import { Checkbox } from '@/Components/Checkbox';

export default function Create() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        code: '',
        type: 'earning',
        category: 'position-fixed',
        description: '',
        is_active: true,
        is_taxable: true,
        is_sgk_applicable: true,
        default_amount: '',
        sort_order: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.salary-components.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Yeni Maaş Kalemı Oluştur
                    </h5>
                    <Link
                        href={route('admin.salary-components.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                    >
                        Geri Dön
                    </Link>
                </div>
            }
        >
            <Head title="Yeni Maaş Kalemı" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm-sm">
                        <div className="p-4 text-dark">
                            <form onSubmit={handleSubmit} className="mb-3">
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    {/* Kalem Adı */}
                                    <div className="">
                                        <InputLabel htmlFor="name" value="Kalem Adı" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 d-block w-100"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Kod */}
                                    <div>
                                        <InputLabel htmlFor="code" value="Kod" />
                                        <TextInput
                                            id="code"
                                            type="text"
                                            className="mt-1 d-block w-100"
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
                                            className="mt-1 d-block w-100"
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
                                            className="mt-1 d-block w-100"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                        >
                                            <option value="position-fixed">Sabit</option>
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
                                            className="mt-1 d-block w-100"
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
                                            className="mt-1 d-block w-100"
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
                                    <textarea className="form-control mt-1 d-block w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" id="description"
                                        rows="3"
                                        
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Seçenekler */}
                                <div className="d-grid d-grid-cols-1 gap-3">
                                    <div>
                                        <label className="d-flex align-items-start">
                                            <Checkbox
                                                name="is_active"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <span className="ml-2 fs-sm text-muted">Aktif</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="d-flex align-items-start">
                                            <Checkbox
                                                name="is_taxable"
                                                checked={data.is_taxable}
                                                onChange={(e) => setData('is_taxable', e.target.checked)}
                                            />
                                            <span className="ml-2 fs-sm text-muted">Vergilendirilir</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="d-flex align-items-start">
                                            <Checkbox
                                                name="is_sgk_applicable"
                                                checked={data.is_sgk_applicable}
                                                onChange={(e) => setData('is_sgk_applicable', e.target.checked)}
                                            />
                                            <span className="ml-2 fs-sm text-muted">SGK Uygulanır</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex align-items-center gap-3">
                                    <PrimaryButton disabled={processing}>
                                        Kaydet
                                    </PrimaryButton>

                                    <Link
                                        href={route('admin.salary-components.index')}
                                        className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        İptal
                                    </Link>
                                </div>

                                {recentlySuccessful && (
                                    <p className="fs-sm text-muted">Kaydedildi.</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}