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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Bordro Dönemi Güncelle
                    </h2>
                    <Link
                        href={route('admin.payrolls.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                        Geri Dön
                    </Link>
                </div>
            }
        >
            <Head title="Bordro Güncelle" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {flash.success && (
                                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                                    {flash.success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Dönem Adı */}
                                    <div>
                                        <InputLabel htmlFor="name" value="Dönem Adı" />
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

                                    {/* Başlangıç Tarihi */}
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Başlangıç Tarihi" />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                        />
                                        <InputError message={errors.payment_date} className="mt-2" />
                                    </div>
                                </div>

                                {/* Notlar */}
                                <div>
                                    <InputLabel htmlFor="notes" value="Notlar" />
                                    <textarea
                                        id="notes"
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                {/* Butonlar */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Güncelle
                                    </PrimaryButton>

                                    <Link
                                        href={route('admin.payrolls.index')}
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