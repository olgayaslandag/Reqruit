import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, confirmDelete } from '@/Utils/sweetAlert';

export default function LeaveTypes({ leaveTypes }) {
    const { props } = usePage();
    const flash = props.flash;

    const handleDelete = (id) => {
        confirmDelete('Bu izin türünü silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.leave.types.destroy', id), {
                onSuccess: () => showSuccess('İzin türü silindi.')
            });
        });
    };

    // İstatistikler - array kontrolü
    const leaveTypesArray = Array.isArray(leaveTypes) ? leaveTypes : (leaveTypes?.data || []);
    
    const stats = {
        total: leaveTypesArray.length || 0,
        paid: leaveTypesArray.filter(t => t.is_paid).length || 0,
        unpaid: leaveTypesArray.filter(t => !t.is_paid).length || 0,
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'İzin Türleri',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İzin Yönetimi', url: '#' },
                    { label: 'İzin Türleri', url: route('admin.leave.types.index') },
                ],
                newUrl: route('admin.leave.types.create'),
            }}
        >
            <Head title="İzin Türleri" />

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <i className="ti ti-list fs-2 text-primary mb-2"></i>
                            <h6 className="text-primary fw-medium">Toplam Tür</h6>
                            <h3 className="fw-bold text-primary">{stats.total}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <i className="ti ti-coin fs-2 text-success mb-2"></i>
                            <h6 className="text-success fw-medium">Ücretli</h6>
                            <h3 className="fw-bold text-success">{stats.paid}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-secondary">
                        <div className="card-body text-center">
                            <i className="ti ti-coin-off fs-2 text-secondary mb-2"></i>
                            <h6 className="text-secondary fw-medium">Ücretsiz</h6>
                            <h3 className="fw-bold text-secondary">{stats.unpaid}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Türler Tablosu */}
            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-tags me-2"></i> İzin Türleri Listesi
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Ad</th>
                                    <th className="fw-medium text-center">Kod</th>
                                    <th className="fw-medium text-center">Ücretli</th>
                                    <th className="fw-medium text-center">Belge</th>
                                    <th className="fw-medium text-center">Maks. Gün</th>
                                    <th className="fw-medium">Açıklama</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(leaveTypesArray || []).length > 0 ? (
                                    leaveTypesArray.map((leaveType) => (
                                        <tr key={leaveType.id}>
                                            <td>
                                                <div className="fw-medium">{leaveType.name}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-light text-dark border">{leaveType.code}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${leaveType.is_paid ? 'bg-success' : 'bg-secondary'}`}>
                                                    {leaveType.is_paid ? 'Evet' : 'Hayır'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${leaveType.requires_document ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
                                                    {leaveType.requires_document ? 'Evet' : 'Hayır'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {leaveType.max_duration_days || <span className="text-muted">Sınırsız</span>}
                                            </td>
                                            <td>
                                                <small className="text-muted">{leaveType.description || '-'}</small>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Link
                                                        href={route('admin.leave.types.edit', leaveType.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Düzenle"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(leaveType.id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Sil"
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            <i className="ti ti-list-off fs-1 d-block mb-2"></i>
                                            İzin türü bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
