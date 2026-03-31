import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="E-posta Doğrulama" />

            <div className="mb-4 small text-muted">
                Kayıt olduğunuz için teşekkürler! Başlamadan önce, size e-posta ile gönderdiğimiz
                bağlantıya tıklayarak e-posta adresinizi doğrulayabilir misiniz?
                E-postayı almadıysanız, size memnuniyetle başka bir tane göndeririz.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 small fw-semibold text-success">
                    E-posta adresinize yeni bir doğrulama bağlantısı gönderildi.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="d-flex justify-content-between align-items-center">
                    <PrimaryButton disabled={processing}>
                        Doğrulama E-postasını Yeniden Gönder
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="small text-muted-link"
                    >
                        Çıkış Yap
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
