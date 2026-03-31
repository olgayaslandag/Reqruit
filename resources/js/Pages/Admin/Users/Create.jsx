import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Create({ errors: propErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        rank_id: 3,
        status_id: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AuthenticatedLayout
            header={
                <h5 className="fw-semibold">
                    Yeni Kullanıcı
                </h5>
            }
        >
            <Head title="Yeni Kullanıcı" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm-sm p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="form-control w-100 rounded border-secondary shadow-sm focus:border-primary focus:"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 fs-sm text-danger">{errors.name}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    E-posta
                                </label>
                                <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus:border-indigo-500 focus:" type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 fs-sm text-danger">{errors.email}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Şifre
                                </label>
                                <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus:border-indigo-500 focus:" type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    minLength="8"
                                />
                                {errors.password && (
                                    <p className="mt-1 fs-sm text-danger">{errors.password}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Rol
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus:border-indigo-500 focus:" value={data.rank_id}
                                    onChange={(e) => setData('rank_id', parseInt(e.target.value))}
                                >
                                    <option value={1}>Yönetici</option>
                                    <option value={2}>İK Yöneticisi</option>
                                    <option value={3}>İşe Alım Uzmanı</option>
                                    <option value={4}>Departman Sorumlusu</option>
                                    <option value={5}>Gözlemci</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Durum
                                </label>
                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus:border-indigo-500 focus:" value={data.status_id}
                                    onChange={(e) => setData('status_id', parseInt(e.target.value))}
                                >
                                    <option value={1}>Aktif</option>
                                    <option value={2}>Pasif</option>
                                    <option value={3}>Beklemede</option>
                                </select>
                            </div>

                            <div className="d-flex justify-content-end">
                                <a
                                    href="/admin/users"
                                    className="px-4 py-2 bg-gray-300 text-dark rounded hover:bg-gray-400"
                                >
                                    İptal
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-primary btn-sm disabled:opacity-50"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}