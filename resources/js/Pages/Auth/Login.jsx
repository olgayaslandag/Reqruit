import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Giriş Yap" />

            {status && (
                <div className="mb-4 small text-success">
                    {status}
                </div>
            )}

            <div className="text-center mb-4">
                <h2>Giriş Yap</h2>
                <Link href={route('register')} className="d-none text-decoration-none">
                    Hesabın yok mu?
                </Link>
            </div>

            <form onSubmit={submit}>
                <div className="form-group mb-3">
                    <InputLabel htmlFor="email" value="E-posta" className="form-label" />
                    
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="form-control input-primary"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="form-group mb-3">
                    <InputLabel htmlFor="password" value="Şifre" className="form-label" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="form-control input-primary"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            className="form-check-input"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="form-check-label ms-2">
                            Beni hatırla
                        </label>
                    </div>
                    
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="link-primary text-decoration-none"
                        >
                            Şifremi unuttum
                        </Link>
                    )}
                </div>

                <div className="d-grid mb-4">
                    <PrimaryButton className="btn btn-primary w-100" disabled={processing}>
                        Giriş Yap
                    </PrimaryButton>
                </div>
            </form>

            <div className="d-none">
                <p className="text-center">Veya şununla giriş yapın</p>
                <div className="d-flex justify-content-center gap-3">
                    {/* Social login buttons will go here */}
                </div>
            </div>
        </GuestLayout>
    );
}
