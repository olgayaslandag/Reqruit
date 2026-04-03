import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Edit({ user, errors: propErrors }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        rank_id: user.rank_id || 3,
        status_id: user.status_id || 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Kullanıcı Düzenle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Kullanıcılar', url: route('admin.users.index') },
                    { label: 'Düzenle', url: '#' },
                ],
            }}
        >
            <Head title="Kullanıcı Düzenle" />


            <div className="card mb-3">
                <div className="card-header">
                    <h5 className="mb-0">Kullanıcı Bilgileri</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Ad Soyad</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="form-control"
                                required
                            />
                            {errors.name && (
                                <div className="text-danger small mt-1">{errors.name}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">E-posta</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="form-control"
                                required
                            />
                            {errors.email && (
                                <div className="text-danger small mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Yeni Şifre</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="form-control"
                                placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                minLength="8"
                            />
                            {errors.password && (
                                <div className="text-danger small mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Rol</label>
                            <select
                                className="form-select"
                                value={data.rank_id}
                                onChange={(e) => setData('rank_id', parseInt(e.target.value))}
                            >
                                <option value={1}>Yönetici</option>
                                <option value={2}>İK Yöneticisi</option>
                                <option value={3}>İşe Alım Uzmanı</option>
                                <option value={4}>Departman Sorumlusu</option>
                                <option value={5}>Gözlemci</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Durum</label>
                            <select
                                className="form-select"
                                value={data.status_id}
                                onChange={(e) => setData('status_id', parseInt(e.target.value))}
                            >
                                <option value={1}>Aktif</option>
                                <option value={2}>Pasif</option>
                                <option value={3}>Beklemede</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <a href="/admin/users" className="btn btn-secondary">
                    İptal
                </a>
                <button type="submit" disabled={processing} className="btn btn-primary">
                    Güncelle
                </button>
            </div>
        </AuthenticatedLayout>
    );
}
