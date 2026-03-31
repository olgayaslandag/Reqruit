import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setRecentlySuccessful(true);
                setTimeout(() => setRecentlySuccessful(false), 2000);
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h5 className="h5 text-dark mb-2">
                    Şifre Güncelle
                </h5>

                <p className="small text-muted">
                    Hesabınızın güvende kalması için uzun, rastgele bir şifre kullandığınızdan emin olun.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-4">
                <div className="mb-3">
                    <InputLabel
                        htmlFor="current_password"
                        value="Mevcut Şifre"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="form-control"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                    />
                </div>

                <div className="mb-3">
                    <InputLabel htmlFor="password" value="Yeni Şifre" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="form-control"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} />
                </div>

                <div className="mb-3">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Şifre Tekrar"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="form-control"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                    />
                </div>

                <div className="d-flex align-items-center gap-2">
                    <PrimaryButton disabled={processing}>Kaydet</PrimaryButton>

                    {recentlySuccessful && (
                        <p className="small text-muted mb-0">
                            Kaydedildi.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
