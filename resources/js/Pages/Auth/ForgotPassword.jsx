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
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-green-100 p-4">
                            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                        Şifre Sıfırlama Bağlantısı Gönderildi!
                    </h2>
                    <p className="mb-6 text-sm text-gray-600">
                        {status || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'}
                    </p>
                    <p className="text-sm text-gray-500">
                        E-posta kutunuzu kontrol edin. Gelen kutunuzda göremiyorsanız spam klasörünü de kontrol edin.
                    </p>
                    <a
                        href="/forgot-password"
                        className="mt-6 inline-block text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        Farklı bir e-posta adresi denemek için tıklayın
                    </a>
                </div>
            ) : (
                <>
                    <div className="mb-6 text-sm text-gray-600">
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
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="E-posta adresiniz"
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <Link
                                href="/login"
                                className="text-sm text-indigo-600 hover:text-indigo-500"
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