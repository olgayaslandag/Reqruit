import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';

export default function Create({ employees, leaveTypes, currentYear }) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        leave_type_id: '',
        entitled_days: '',
        used_days: 0,
        calculation_year_start: `${currentYear}-01-01`,
        accrual_date: new Date().toISOString().split('T')[0],
        can_carry_over: true,
        max_carry_over_days: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.leave.entitlements.store'), {
            onSuccess: () => {
                showSuccess('İzin hakkı oluşturuldu.');
            },
            onError: () => {
                showError('Oluşturma sırasında hata oluştu.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Yeni İzin Hakkı',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İzin Yönetimi', url: '#' },
                    { label: 'İzin Hakları', url: route('admin.leave.entitlements.index') },
                    { label: 'Yeni Hak', url: route('admin.leave.entitlements.create') },
                ],
                backUrl: route('admin.leave.entitlements.index'),
            }}
        >
            <Head title="Yeni İzin Hakkı" />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-clipboard-check me-2"></i> İzin Hakkı Bilgileri
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Çalışan */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-user me-1"></i> Çalışan <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.employee_id ? 'is-invalid' : ''}`}
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value ? parseInt(e.target.value) : '')}
                                            required
                                        >
                                            <option value="">Çalışan Seçin</option>
                                            {(employees || []).map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.employee_id && <div className="invalid-feedback">{errors.employee_id}</div>}
                                    </div>

                                    {/* İzin Türü */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-tag me-1"></i> İzin Türü <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.leave_type_id ? 'is-invalid' : ''}`}
                                            value={data.leave_type_id}
                                            onChange={(e) => setData('leave_type_id', e.target.value ? parseInt(e.target.value) : '')}
                                            required
                                        >
                                            <option value="">İzin Türü Seçin</option>
                                            {(leaveTypes || []).map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                        {errors.leave_type_id && <div className="invalid-feedback">{errors.leave_type_id}</div>}
                                    </div>

                                    {/* Hakedilen Gün */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar me-1"></i> Hakedilen Gün <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.entitled_days ? 'is-invalid' : ''}`}
                                            value={data.entitled_days}
                                            onChange={(e) => setData('entitled_days', e.target.value ? parseInt(e.target.value) : 0)}
                                            min="1"
                                            max="365"
                                            required
                                        />
                                        {errors.entitled_days && <div className="invalid-feedback">{errors.entitled_days}</div>}
                                    </div>

                                    {/* Kullanılan Gün */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-clock me-1"></i> Kullanılan Gün
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.used_days}
                                            onChange={(e) => setData('used_days', parseInt(e.target.value) || 0)}
                                            min="0"
                                            max={data.entitled_days}
                                        />
                                    </div>

                                    {/* Hesap Yılı Başlangıcı */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-event me-1"></i> Hesap Yılı Başlangıcı <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.calculation_year_start ? 'is-invalid' : ''}`}
                                            value={data.calculation_year_start}
                                            onChange={(e) => setData('calculation_year_start', e.target.value)}
                                            required
                                        />
                                        {errors.calculation_year_start && <div className="invalid-feedback">{errors.calculation_year_start}</div>}
                                    </div>

                                    {/* Hak Kazanma Tarihi */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-calendar-check me-1"></i> Hak Kazanma Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.accrual_date ? 'is-invalid' : ''}`}
                                            value={data.accrual_date}
                                            onChange={(e) => setData('accrual_date', e.target.value)}
                                            required
                                        />
                                        {errors.accrual_date && <div className="invalid-feedback">{errors.accrual_date}</div>}
                                    </div>

                                    {/* Devredilebilir */}
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="can_carry_over"
                                                checked={data.can_carry_over}
                                                onChange={(e) => setData('can_carry_over', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="can_carry_over">
                                                <i className="ti ti-refresh me-1"></i> Devredilebilir
                                            </label>
                                        </div>
                                    </div>

                                    {/* Maks. Devir Günü */}
                                    {data.can_carry_over && (
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">
                                                <i className="ti ti-layer-me me-1"></i> Maks. Devir Günü
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={data.max_carry_over_days}
                                                onChange={(e) => setData('max_carry_over_days', parseInt(e.target.value) || 0)}
                                                min="0"
                                                max="365"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Butonlar */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Link
                                        href={route('admin.leave.entitlements.index')}
                                        className="btn btn-light"
                                    >
                                        <i className="ti ti-arrow-left me-1"></i> İptal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn btn-primary"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Kaydediliyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Kaydet
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sağ Panel - Bilgi */}
                <div className="col-lg-4">
                    <div className="card border-info mb-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> Bilgi
                            </h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    <strong>Hakedilen Gün:</strong> Yıllık izin hakkı
                                </li>
                                <li className="mb-2">
                                    <i className="ti ti-check text-success me-2"></i>
                                    <strong>Kullanılan Gün:</strong> Önceki yıllardan devredenler
                                </li>
                                <li className="mb-0">
                                    <i className="ti ti-check text-success me-2"></i>
                                    <strong>Devredilebilir:</strong> Kullanılmayan günleri sonraki yıla taşıma
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="alert alert-warning" role="alert">
                        <h6 className="alert-heading fw-bold">
                            <i className="ti ti-alert-triangle me-1"></i> Dikkat
                        </h6>
                        <p className="mb-0 small">
                            Aynı çalışan ve izin türü için birden fazla izin hakkı tanımlamanız önerilmez.
                            Zaten tanımlanmış bir combination varsa hata alabilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
