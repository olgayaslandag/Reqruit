import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess } from '@/Utils/toast';

const STATUSES = [
    { value: 'active', label: 'Aktif' },
    { value: 'engaged', label: 'İlgileniyor' },
    { value: 'passive', label: 'Pasif' },
    { value: 'closed', label: 'Kapandı' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        current_employer: '',
        current_position: '',
        source: '',
        status: 'active',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/candidates', {
            preserveScroll: true,
            onSuccess: () => showSuccess('Kalifiye eleman başarıyla eklendi.'),
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Yeni Kalifiye Eleman',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Kalifiye Elemanlar', url: route('admin.candidates.index') },
                    { label: 'Yeni Ekle', url: route('admin.candidates.create') },
                ],
            }}
        >
            <Head title="Yeni Kalifiye Eleman" />

            <div className="card mb-3">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Ad Soyad <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">E-posta</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Telefon</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Şu Anki Şirket</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.current_employer ? 'is-invalid' : ''}`}
                                    value={data.current_employer}
                                    onChange={(e) => setData('current_employer', e.target.value)}
                                />
                                {errors.current_employer && <div className="invalid-feedback">{errors.current_employer}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Şu Anki Pozisyon</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.current_position ? 'is-invalid' : ''}`}
                                    value={data.current_position}
                                    onChange={(e) => setData('current_position', e.target.value)}
                                />
                                {errors.current_position && <div className="invalid-feedback">{errors.current_position}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Kaynak</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.source ? 'is-invalid' : ''}`}
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    placeholder="Örn. LinkedIn, referans..."
                                />
                                {errors.source && <div className="invalid-feedback">{errors.source}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Durum</label>
                                <select
                                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    {STATUSES.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                            </div>

                            <div className="col-md-12">
                                <label className="form-label">Notlar</label>
                                <textarea
                                    className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                />
                                {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <a
                                href={route('admin.candidates.index')}
                                className="btn btn-secondary"
                            >
                                İptal
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                {processing ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}