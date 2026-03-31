import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Şifremi Unuttum" />

            {status ? (
                <div className="text-center">
                    <div className="mb-4 d-flex justify-content-center">
                        <div className="rounded-circle bg-success bg-opacity-10 p-4">
                            <i className="fas fa-check-circle fa-3x text-success"></i>
                        </div>
                    </div>
                    <h5 className="mb-3 h5 text-dark">
                        Şifre Sıfırlama Bağlantısı Gönderildi!
                    </h5>
                    <p className="mb-4 small text-muted">
                        {status || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'}
                    </p>
                    <p className="small text-muted">
                        E-posta kutunuzu kontrol edin. Gelen kutunuzda göremiyorsanız spam klasörünü de kontrol edin.
                    </p>
                    <a
                        href="/forgot-password"
                        className="mt-3 d-inline-d-block small text-primary"
                    >
                        Farklı bir e-posta adresi denemek için tıklayın
                    </a>
                </div>
            ) : (
                <>
                    <div className="mb-4 small text-muted">
                        Şifrenizi mi unuttunuz? Sorun değil. E-posta adresinizi girin,
                        size yeni bir şifre belirleyebileceğiniz bağlantı gönderelim.
                    </div>

                    <form onSubmit={submit}>
                        <div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-control"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="E-posta adresiniz"
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div className="mt-4 d-flex justify-content-between align-items-center">
                            <Link
                                href="/login"
                                className="small text-primary"
                            >
                                Giriş yap
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                            </PrimaryButton>
                        </div>
                    </form>
                </>
            )}
        </GuestLayout>
    );
}
