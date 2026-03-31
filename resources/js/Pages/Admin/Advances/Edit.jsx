import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { InputLabel } from '@/Components/InputLabel';
import { TextInput } from '@/Components/TextInput';
import { InputError } from '@/Components/InputError';
import { Select } from '@/Components/Select';
import { PrimaryButton } from '@/Components/PrimaryButton';

export default function Edit({ advance }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        employee_id: advance.employee_id,
        amount: advance.amount || '',
        reason: advance.reason || '',
        requested_date: advance.requested_date || new Date().toISOString().split('T')[0],
        status: advance.status || 'pending',
        notes: advance.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.advances.update', advance.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold text-dark">
                        Avans Talebini Güncelle - #{advance.id}
                    </h5>
                    <div className="d-flex gap-2">
                        <Link
                            href={route('admin.advances.show', advance.id)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                        >
                            Geri Dön
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Avans Talebini Güncelle - #${advance.id}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm-sm">
                        <div className="p-4 text-dark">
                            <form onSubmit={handleSubmit} className="mb-3">
                                <div className="d-grid d-grid-cols-1 gap-4">
                                    {/* Çalişan Seçimi */}
                                    <div>
                                        <InputLabel htmlFor="employee_id" value="Çalişan" />
                                        <Select
                                            id="employee_id"
                                            className="mt-1 d-block w-100"
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Çalişan seçin</option>
                                            {window.employees?.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </Select>
                                        <InputError message={errors.employee_id} className="mt-2" />
                                    </div>

                                    {/* Miktar */}
                                    <div>
                                        <InputLabel htmlFor="amount" value="Tutar" />
                                        <TextInput
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 d-block w-100"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            required
                                            min="0"
                                        />
                                        <InputError message={errors.amount} className="mt-2" />
                                    </div>

                                    {/* Tarih */}
                                    <div>
                                        <InputLabel htmlFor="requested_date" value="Talep Tarihi" />
                                        <TextInput
                                            id="requested_date"
                                            type="date"
                                            className="mt-1 d-block w-100"
                                            value={data.requested_date}
                                            onChange={(e) => setData('requested_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.requested_date} className="mt-2" />
                                    </div>

                                    {/* Durum */}
                                    <div>
                                        <InputLabel htmlFor="status" value="Durum" />
                                        <Select
                                            id="status"
                                            className="mt-1 d-block w-100"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="pending">Bekliyor</option>
                                            <option value="approved">Onaylandı</option>
                                            <option value="rejected">Reddedildi</option>
                                            <option value="paid">Ödendi</option>
                                            <option value="cancelled">İptal Edildi</option>
                                        </Select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                {/* Nedeni */}
                                <div>
                                    <InputLabel htmlFor="reason" value="Nedeni" />
                                    <textarea className="form-control mt-1 d-block w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" id="reason"
                                        rows="3"
                                        
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                    />
                                    <InputError message={errors.reason} className="mt-2" />
                                </div>

                                {/* Notlar */}
                                <div>
                                    <InputLabel htmlFor="notes" value="Notlar" />
                                    <textarea className="form-control mt-1 d-block w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" id="notes"
                                        rows="3"
                                        
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
                                        href={route('admin.advances.show', advance.id)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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