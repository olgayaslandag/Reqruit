import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (recentlySuccessful) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    // Check advanced info availability
    const { showAdvancedInfo, advancedUserInfo } = usePage().props;

    return (
        <section className={className}>
            <header>
                <h5 className="h5 text-dark mb-2">
                    Profil Bilgileri
                </h5>

                <p className="small text-muted">
                    Hesap profilinizi ve e-posta adresinizi güncelleyin.
                </p>
            </header>

            <form onSubmit={submit} className="mt-4">
                <div className="mb-3">
                    <InputLabel htmlFor="name" value="Ad Soyad" />

                    <TextInput
                        id="name"
                        className="form-control"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError message={errors.name} />
                </div>

                <div className="mb-3">
                    <InputLabel htmlFor="email" value="E-posta" />

                    <TextInput
                        id="email"
                        type="email"
                        className="form-control"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError message={errors.email} />
                </div>

                {/* Show advanced info for admin/manager */}
                {showAdvancedInfo && advancedUserInfo && (
                    <div className="row g-3 mt-4">
                        <div className="col-md-6">
                            <InputLabel htmlFor="rank" value="Rol" />
                            <div className="form-control-plaintext">
                                {advancedUserInfo.rank_label} ({advancedUserInfo.rank_id})
                            </div>
                        </div>
                        <div className="col-md-6">
                            <InputLabel htmlFor="status" value="Durum" />
                            <div className="form-control-plaintext">
                                {advancedUserInfo.status_label} ({advancedUserInfo.status_id})
                            </div>
                        </div>
                    </div>
                )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mt-4">
                        <p className="small text-muted">
                            E-posta adresiniz doğrulanmamış.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-primary ms-1"
                            >
                                Doğrulama e-postasını yeniden göndermek için tıklayın.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 small fw-semibold text-success">
                                Yeni doğrulama bağlantısı e-posta adresinize gönderildi.
                            </div>
                        )}
                    </div>
                )}

                <div className="d-flex align-items-center gap-2 mt-4">
                    <PrimaryButton disabled={processing}>Kaydet</PrimaryButton>

                    {showSuccess && (
                        <p className="small text-muted mb-0">
                            Kaydedildi.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
