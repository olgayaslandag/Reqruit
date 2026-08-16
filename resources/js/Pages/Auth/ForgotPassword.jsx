import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
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
        <GuestLayout className="auth-form-brand">
            <Head title="Şifremi Unuttum" />

            <div className="auth-header">
                <a href="#">
                    <img src="/assets/images/reqruit-logo.png" alt="img" width="118" height="41" />
                </a>
            </div>

            <div className="card my-5">
                <div className="card-body">
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
                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <h3 className="mb-0"><b>Şifremi Unuttum</b></h3>
                            </div>

                            <div className="mb-4 small text-muted">
                                Şifrenizi mi unuttunuz? Sorun değil. E-posta adresinizi girin,
                                size yeni bir şifre belirleyebileceğiniz bağlantı gönderelim.
                            </div>

                            <form onSubmit={submit}>
                                <div className="form-group mb-3">
                                    <label className="form-label" htmlFor="email">E-posta Adresi</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        placeholder="E-posta Adresi"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="d-grid mt-4">
                                    <PrimaryButton className="btn btn-primary" disabled={processing}>
                                        {processing ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                                    </PrimaryButton>
                                </div>

                                <div className="d-flex justify-content-center mt-4">
                                    <Link href="/login" className="link-primary text-decoration-none">
                                        Giriş yap
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <div className="auth-footer row">
                <div className="col my-1">
                    <p className="m-0">Telif Hakkı © <a href="#">Reqruit</a></p>
                </div>
                <div className="col-auto my-1">
                    <ul className="list-inline footer-link mb-0">
                        <li className="list-inline-item"><a href="#">Ana Sayfa</a></li>
                        <li className="list-inline-item"><a href="#">Gizlilik Politikası</a></li>
                        <li className="list-inline-item"><a href="#">Bize Ulaşın</a></li>
                    </ul>
                </div>
            </div>
        </GuestLayout>
    );
}