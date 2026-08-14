import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
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
        <>
            <Head title="Giriş Yap" />

            <div className="auth-header">
                <a href="/">
                    <img src="/assets/images/reqruit-logo.png" alt="Reqruit" style={{ height: '40px' }} />
                </a>
            </div>

            <div className="card my-5">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <h3 className="mb-0"><b>Giriş Yap</b></h3>
                        <Link href={route('register')} className="link-primary text-decoration-none">
                            Hesabın yok mu?
                        </Link>
                    </div>

                    {status && (
                        <div className="mb-4 small text-success">{status}</div>
                    )}

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

                        <div className="form-group mb-3">
                            <label className="form-label" htmlFor="password">Şifre</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Şifre"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="d-flex mt-1 justify-content-between align-items-center">
                            <div className="form-check">
                                <input
                                    className="form-check-input input-primary"
                                    type="checkbox"
                                    id="customCheckc1"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label className="form-check-label text-muted" htmlFor="customCheckc1">
                                    Beni hatırla
                                </label>
                            </div>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-primary text-decoration-none">
                                    Şifremi unuttum
                                </Link>
                            )}
                        </div>

                        <div className="d-grid mt-4">
                            <PrimaryButton className="btn btn-primary" disabled={processing}>
                                Giriş Yap
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="saprator mt-3">
                        <span>Şununla giriş yap</span>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <div className="d-grid">
                                <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                    <img src="/assets/images/authentication/google.svg" alt="img" /> <span className="d-none d-sm-inline-block"> Google</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="d-grid">
                                <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                    <img src="/assets/images/authentication/twitter.svg" alt="img" /> <span className="d-none d-sm-inline-block"> Twitter</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="d-grid">
                                <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                    <img src="/assets/images/authentication/facebook.svg" alt="img" /> <span className="d-none d-sm-inline-block"> Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-footer row">
                <div className="col my-1">
                    <p className="m-0">Telif Hakkı © <a href="/">Reqruit</a></p>
                </div>
                <div className="col-auto my-1">
                    <ul className="list-inline footer-link mb-0">
                        <li className="list-inline-item"><a href="/">Ana Sayfa</a></li>
                        <li className="list-inline-item"><a href="#">Gizlilik Politikası</a></li>
                        <li className="list-inline-item"><a href="#">Bize Ulaşın</a></li>
                    </ul>
                </div>
            </div>
        </>
    );
}