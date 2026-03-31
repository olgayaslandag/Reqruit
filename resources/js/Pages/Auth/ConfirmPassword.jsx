import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Şifreyi Onayla" />

            <div className="mb-4 small text-muted">
                Burası uygulamanın güvenli bir alanıdır. Devam etmeden önce lütfen şifrenizi onaylayın.
            </div>

            <form onSubmit={submit}>
                <div className="mb-3">
                    <InputLabel htmlFor="password" value="Şifre" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="form-control"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} />
                </div>

                <div className="d-flex justify-content-end">
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Onayla
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
