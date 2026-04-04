import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDate } from '@/Utils/formatters';

export default function Edit({ entitlement, employees, leaveTypes }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        employee_id: entitlement.employee_id,
        leave_type_id: entitlement.leave_type_id,
        entitled_days: entitlement.entitled_days,
        used_days: entitlement.used_days,
        calculation_year_start: entitlement.calculation_year_start,
        accrual_date: entitlement.accrual_date,
        can_carry_over: entitlement.can_carry_over,
        max_carry_over_days: entitlement.max_carry_over_days
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.leave.entitlements.update', entitlement.id), {
            onSuccess: () => {
                showSuccess('İzin hakkı güncellendi.');
            },
            onError: () => {
                showError('Güncelleme sırasında hata oluştu.');
            }
        });
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees?.find(emp => emp.id === employeeId);
        return employee ? `${employee.first_name} ${employee.last_name}` : 'Bulunamadı';
    };

    const getLeaveTypeName = (typeId) => {
        const type = leaveTypes?.find(t => t.id === typeId);
        return type ? type.name : 'Bulunamadı';
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'İzin Hakkı Düzenle',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İzin Yönetimi', url: '#' },
                    { label: 'İzin Hakları', url: route('admin.leave.entitlements.index') },
                    { label: getEmployeeName(entitlement.employee_id), url: route('admin.leave.entitlements.edit', entitlement.id) },
                ],
                backUrl: route('admin.leave.entitlements.index'),
            }}
        >
            <Head title={`İzin Hakkı Düzenle - ${getEmployeeName(entitlement.employee_id)}`} />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-clipboard-check me-2"></i> İzin Hakkı Bilgileri
                            </h5>
                            <div>
                                <span className="badge bg-info me-1">
                                    {getLeaveTypeName(entitlement.leave_type_id)}
                                </span>
                            </div>
                        </div>
                        <div className="card-body">
                            {recentlySuccessful && (
                                <div className="alert alert-success mb-4" role="alert">
                                    <i className="ti ti-check me-2"></i> Kaydedildi.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Çalışan (sadece görüntüleme) */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-user me-1"></i> Çalışan
                                        </label>
                                        <div className="form-control bg-light">
                                            {getEmployeeName(entitlement.employee_id)}
                                        </div>
                                    </div>

                                    {/* İzin Türü (sadece görüntüleme) */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            <i className="ti ti-tag me-1"></i> İzin Türü
                                        </label>
                                        <div className="form-control bg-light">
                                            {getLeaveTypeName(entitlement.leave_type_id)}
                                        </div>
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
                                                Güncelleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i> Güncelle
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
                    <div className="card border-primary mb-4">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-info-circle me-1"></i> İzin Hakkı Detayları
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="text-muted small">Çalışan</label>
                                <div className="fw-medium">{getEmployeeName(entitlement.employee_id)}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">İzin Türü</label>
                                <div className="fw-medium">{getLeaveTypeName(entitlement.leave_type_id)}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Oluşturulma Tarihi</label>
                                <div className="fw-medium">{formatDate(entitlement.created_at)}</div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Son Güncelleme</label>
                                <div className="fw-medium">{formatDate(entitlement.updated_at)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-info">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                                <i className="ti ti-chart-bar me-1"></i> İzin Özeti
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-2">
                                <div className="d-flex justify-content-between">
                                    <span>Hakedilen:</span>
                                    <span className="badge bg-primary">{entitlement.entitled_days} gün</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="d-flex justify-content-between">
                                    <span>Kullanılan:</span>
                                    <span className="badge bg-warning text-dark">{entitlement.used_days} gün</span>
                                </div>
                            </div>
                            <div className="mb-0">
                                <div className="d-flex justify-content-between">
                                    <span>Kalan:</span>
                                    <span className="badge bg-success">{entitlement.entitled_days - entitlement.used_days} gün</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
