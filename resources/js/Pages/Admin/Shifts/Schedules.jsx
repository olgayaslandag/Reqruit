import { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess, confirmAction } from '@/Utils/sweetAlert';
import { useFlashWithToast } from '@/Hooks/useFlash';

export default function Schedules({ schedules, shifts, employees, departments }) {
    const flash = useFlashWithToast();
    
    const [assignments, setAssignments] = useState(Array.isArray(schedules) ? schedules : []);
    const [filter, setFilter] = useState({ department_id: '', shift_id: '' });
    const [showBulkPanel, setShowBulkPanel] = useState(false);

    const [bulkAssignment, setBulkAssignment] = useState({
        selectedEmployees: [],
        shiftId: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        recurrence: 'single'
    });

    const filteredSchedules = assignments.filter(schedule => {
        if (filter.department_id && schedule.employee.department_id != filter.department_id) {
            return false;
        }
        if (filter.shift_id && schedule.shift.id != filter.shift_id) {
            return false;
        }
        return true;
    });

    const filteredEmployees = employees?.filter(emp => {
        if (!filter.department_id) return true;
        return emp.department_id == filter.department_id;
    });

    const handleRemoveAssignment = (id) => {
        confirmAction('Bu atamayı kaldırmak istediğinize emin misiniz?', () => {
            setAssignments(assignments.filter(a => a.id !== id));
            router.delete(route('admin.shift-schedules.remove', id), {
                onSuccess: () => showSuccess('Vardiya ataması kaldırıldı.'),
                onError: () => showError('Atama kaldırma işlemi sırasında bir hata oluştu.')
            });
        });
    };

    const handleBulkAssign = () => {
        if (!bulkAssignment.selectedEmployees.length || !bulkAssignment.shiftId) {
            showError('Lütfen personel ve vardiya seçin.');
            return;
        }

        router.post(route('admin.shift-schedules.bulk-assign'), {
            employees: bulkAssignment.selectedEmployees,
            shift_id: bulkAssignment.shiftId,
            start_date: bulkAssignment.start_date,
            recurrence: bulkAssignment.recurrence
        }, {
            onSuccess: () => {
                showSuccess('Vardiya atamaları başarıyla yapıldı.');
                setBulkAssignment({
                    selectedEmployees: [],
                    shiftId: '',
                    start_date: new Date().toISOString().split('T')[0],
                    recurrence: 'single'
                });
                setShowBulkPanel(false);
            },
            onError: () => showError('Vardiya atamaları sırasında bir hata oluştu.')
        });
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Vardiya Atamaları',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: '#' },
                    { label: 'Vardiyalar', url: route('admin.shifts.index') },
                    { label: 'Vardiya Atamaları', url: route('admin.shifts.schedules') },
                ],
                backUrl: route('admin.shifts.index'),
                filterCollapse: true,
            }}
        >
            <Head title="Vardiya Atamaları" />

            <div className="collapse mb-4" id="filterCollapse">
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-medium">Departman</label>
                                <select
                                    className="form-select"
                                    value={filter.department_id}
                                    onChange={(e) => setFilter({ ...filter, department_id: e.target.value })}
                                >
                                    <option value="">Tümü</option>
                                    {(departments || []).map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-medium">Vardiya</label>
                                <select
                                    className="form-select"
                                    value={filter.shift_id}
                                    onChange={(e) => setFilter({ ...filter, shift_id: e.target.value })}
                                >
                                    <option value="">Tümü</option>
                                    {(shifts || []).map(shift => (
                                        <option key={shift.id} value={shift.id}>{shift.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setShowBulkPanel(!showBulkPanel)}
                                >
                                    <i className="ti ti-plus me-1"></i> Toplu Atama
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showBulkPanel && (
                <div className="card mb-4 border-primary">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0 fw-bold">
                            <i className="ti ti-users me-2"></i> Toplu Vardiya Atama
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-medium">Personeller</label>
                            <select
                                className="form-select shift-calendar-cell"
                                multiple
                                value={bulkAssignment.selectedEmployees}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                                        setBulkAssignment({...bulkAssignment, selectedEmployees: selected});
                                    }}
                                >
                                    {(filteredEmployees || []).map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name} - {emp.department?.title}
                                        </option>
                                    ))}
                                </select>
                                <small className="text-muted">Birden fazla seçim için Ctrl tuşunu basılı tutun</small>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-medium">Vardiya</label>
                                <select
                                    className="form-select"
                                    value={bulkAssignment.shiftId}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, shiftId: e.target.value})}
                                >
                                    <option value="">Seçin...</option>
                                    {(shifts || []).map(shift => (
                                        <option key={shift.id} value={shift.id}>
                                            {shift.name} ({shift.start_time}-{shift.end_time})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-medium">Başlangıç</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={bulkAssignment.start_date}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, start_date: e.target.value})}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-medium">Tekrar</label>
                                <select
                                    className="form-select"
                                    value={bulkAssignment.recurrence}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, recurrence: e.target.value})}
                                >
                                    <option value="single">Tek Seferlik</option>
                                    <option value="weekly">Haftalık</option>
                                    <option value="monthly">Aylık</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3 d-flex justify-content-end gap-2">
                            <button className="btn btn-light" onClick={() => setShowBulkPanel(false)}>
                                İptal
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleBulkAssign}
                                disabled={!bulkAssignment.selectedEmployees.length || !bulkAssignment.shiftId}
                            >
                                <i className="ti ti-check me-1"></i> Ata
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold">
                        <i className="ti ti-calendar me-2"></i> Atama Listesi
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium">Personel</th>
                                    <th className="fw-medium">Departman</th>
                                    <th className="fw-medium">Vardiya</th>
                                    <th className="fw-medium">Tarih</th>
                                    <th className="fw-medium">Saatler</th>
                                    <th className="fw-medium text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchedules.length > 0 ? (
                                    filteredSchedules.map((schedule) => (
                                        <tr key={schedule.id}>
                                            <td>
                                                <div className="fw-medium">{schedule.employee?.first_name} {schedule.employee?.last_name}</div>
                                                <small className="text-muted">{schedule.employee?.identity_no}</small>
                                            </td>
                                            <td>{schedule.employee?.department?.title || '-'}</td>
                                            <td>
                                                <span className="badge bg-primary">{schedule.shift?.name}</span>
                                            </td>
                                            <td>
                                                {new Date(schedule.date).toLocaleDateString('tr-TR')}
                                                <small className="text-muted d-block">
                                                    {new Date(schedule.date).toLocaleDateString('tr-TR', { weekday: 'long' })}
                                                </small>
                                            </td>
                                            <td>
                                                <span className="fw-medium">{schedule.shift?.start_time}</span>
                                                {' - '}
                                                <span className="fw-medium">{schedule.shift?.end_time}</span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    onClick={() => handleRemoveAssignment(schedule.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    <i className="ti ti-trash"></i> Kaldır
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            <i className="ti ti-calendar-off fs-1 d-block mb-2"></i>
                                            Vardiya ataması bulunamadı.
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