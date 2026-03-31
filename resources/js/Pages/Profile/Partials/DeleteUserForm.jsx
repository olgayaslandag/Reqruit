import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`mb-4 ${className}`}>
            <header>
                <h5 className="h5 text-dark mb-2">
                    Hesabı Sil
                </h5>

                <p className="small text-muted">
                    Hesabınız silindiğinde, tüm kaynaklar ve veriler kalıcı olarak silinir.
                    Silmeden önce saklamak istediğiniz verileri indirin.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="mt-3">
                Hesabı Sil
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal} title="Hesabı Sil">
                <form onSubmit={deleteUser} className="p-3">
                    <p className="text-muted">
                        Hesabınızı silmek istediğinizden emin misiniz?
                        Hesabınız silindiğinde tüm kaynaklar ve veriler kalıcı olarak silinir.
                        Kalıcı olarak silmek istediğinizi onaylamak için şifrenizi girin.
                    </p>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password"
                            value="Şifre"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="form-control"
                            isFocused
                            placeholder="Şifre"
                        />

                        <InputError
                            message={errors.password}
                        />
                    </div>

                    <div className="mt-4 d-flex justify-content-end">
                        <SecondaryButton onClick={closeModal}>
                            İptal
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Hesabı Sil
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
