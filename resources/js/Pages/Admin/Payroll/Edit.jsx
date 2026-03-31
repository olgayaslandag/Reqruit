import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { InputLabel } from '@/Components/InputLabel';
import { TextInput } from '@/Components/TextInput';
import { InputError } from '@/Components/InputError';
import { Select } from '@/Components/Select';
import { PrimaryButton } from '@/Components/PrimaryButton';
import { Checkbox } from '@/Components/Checkbox';
import { formatDate } from '@/Utils/formatters';

export default function Edit({ period }) {
    const { flash } = usePage().props;
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: period.name || '',
        start_date: period.start_date || '',
        end_date: period.end_date || '',
        payment_frequency: period.payment_frequency || 'monthly',
        payment_date: period.payment_date || '',
        notes: period.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.payrolls.update', period.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Bordro Dönemi Güncelle
                    </h5>
                    <Link
                        href={route('admin.payrolls.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                    >
                        Geri Dön
                    </Link>
                </div>
            }
        >
            <Head title="Bordro Güncelle" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm-sm">
                        <div className="p-4 text-dark">
                            {flash.success && (
                                <div className="mb-4 p-4 bg-success bg-opacity-10 text-success rounded">
                                    {flash.success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mb-3">
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    {/* Dönem Adı */}
                                    <div>
                                        <InputLabel htmlFor="name" value="Dönem Adı" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 d-block w-100"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Başlangıç Tarihi */}
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Başlangıç Tarihi" />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            className="mt-1 d-block w-100"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>

                                    {/* Bitiş Tarihi */}
                                    <div>
                                        <InputLabel htmlFor="end_date" value="Bitiş Tarihi" />
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            className="mt-1 d-block w-100"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.end_date} className="mt-2" />
                                    </div>

                                    {/* Ödeme Sıklığı */}
                                    <div>
                                        <InputLabel htmlFor="payment_frequency" value="Ödeme Sıklığı" />
                                        <Select
                                            id="payment_frequency"
                                            className="mt-1 d-block w-100"
                                            value={data.payment_frequency}
                                            onChange={(e) => setData('payment_frequency', e.target.value)}
                                        >
                                            <option value="monthly">Aylık</option>
                                            <option value="biweekly">İki Haftalık</option>
                                            <option value="weekly">Haftalık</option>
                                        </Select>
                                        <InputError message={errors.payment_frequency} className="mt-2" />
                                    </div>

                                    {/* Ödeme Tarihi */}
                                    <div>
                                        <InputLabel htmlFor="payment_date" value="Ödeme Tarihi" />
                                        <TextInput
                                            id="payment_date"
                                            type="date"
                                            className="mt-1 d-block w-100"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                        />
                                        <InputError message={errors.payment_date} className="mt-2" />
                                    </div>
                                </div>

                                {/* Notlar */}
                                <div>
                                    <InputLabel htmlFor="notes" value="Notlar" />
                                    <textarea className="form-control mt-1 d-block w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" id="notes"
                                        rows="4"
                                        
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex align-items-center gap-3">
                                    <PrimaryButton disabled={processing}>
                                        Güncelle
                                    </PrimaryButton>

                                    <Link
                                        href={route('admin.payrolls.index')}
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