import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';

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
            pageHeader={{
                title: 'Yeni Kullanıcı',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Kullanıcılar', url: route('admin.users.index') },
                    { label: 'Yeni Kullanıcı', url: '#' },
                ],
            }}
        >
            <Head title="Yeni Kullanıcı" />

            <div className="card mb-3">
                <div className="card-header">
                    <h5 className="mb-0">Kullanıcı Bilgileri</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} id="userForm">
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
                            <label className="form-label">Şifre</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="form-control"
                                required
                                minLength="10"
                                pattern="(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zçğıöşüÇĞİÖŞÜ\d@$!%*?&]{10,}"
                                title="En az 10 karakter, büyük-küçük harf, rakam ve özel karakter (@$!%*?&) içermelidir."
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

                        <div className="d-flex justify-content-end gap-2">
                            <Link href={route('admin.users.index')} className="btn btn-secondary">
                                İptal
                            </Link>
                            <button type="submit" disabled={processing} className="btn btn-primary">
                                Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
