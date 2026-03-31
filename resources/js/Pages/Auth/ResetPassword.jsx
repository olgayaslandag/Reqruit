import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Şifre Sıfırlama" />

            <div className="mb-4 small text-muted">
                Yeni şifrenizi belirleyin. Güvenli bir şifre seçtiğinizden emin olun.
            </div>

            <form onSubmit={submit}>
                <div className="mb-3">
                    <InputLabel htmlFor="email" value="E-posta" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="form-control"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} />
                </div>

                <div className="mb-3">
                    <InputLabel htmlFor="password" value="Yeni Şifre" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="form-control"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Yeni şifreniz"
                    />

                    <InputError message={errors.password} />
                </div>

                <div className="mb-3">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Şifre Tekrar"
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="form-control"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="Şifrenizi tekrar girin"
                    />

                    <InputError
                        message={errors.password_confirmation}
                    />
                </div>

                <div className="d-flex justify-content-end">
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {processing ? 'Kaydediliyor...' : 'Şifremi Sıfırla'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
