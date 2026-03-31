import { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showError, showSuccess } from '@/Utils/sweetAlert';

export default function Schedules({ schedules, shifts, employees, departments }) {
    const { props } = usePage();
    const flash = props.flash;
    
    const [assignments, setAssignments] = useState(schedules || []);
    const [filter, setFilter] = useState({ department_id: '', shift_id: '' });

    const [bulkAssignment, setBulkAssignment] = useState({
        selectedEmployees: [],
        shiftId: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        recurrence: 'single' // single, weekly, monthly
    });

    // Filtreleme işlemi
    const filteredSchedules = assignments.filter(schedule => {
        if (filter.department_id && schedule.employee.department_id !== filter.department_id) {
            return false;
        }
        if (filter.shift_id && schedule.shift.id !== filter.shift_id) {
            return false;
        }
        return true;
    });

    // Departmana göre çalışanları filtrele
    const filteredEmployees = employees?.filter(emp => {
        if (!filter.department_id) return true;
        return emp.department_id === filter.department_id;
    });

    // Vardyaları güncelleme
    const handleAssignment = (employeeId, shiftId, date) => {
        const assignmentExists = assignments.some(a => 
            a.employee_id === employeeId && a.shift_id === shiftId && a.date === date
        );

        if (assignmentExists) {
            setShowError("Bu çalışan için bu tarih için zaten bir vardiya ataması var.");
            return;
        }

        const newAssignment = {
            employee_id: employeeId,
            shift_id: shiftId,
            date: date,
            id: Math.random().toString(36).substr(2, 9) // temporary ID
        };

        setAssignments([...assignments, newAssignment]);

        router.post(route('admin.shift-schedules.assign'), {
            ...newAssignment
        }, {
            onSuccess: () => {
                showSuccess('Vardiya ataması başarıyla yapıldı.');
            },
            onError: (errorData) => {
                showError('Vardiya ataması sırasında bir hata oluştu.');
            }
        });
    };

    // Atamayı kaldırma
    const handleRemoveAssignment = (id) => {
        setAssignments(assignments.filter(a => a.id !== id));

        router.delete(route('admin.shift-schedules.remove', id), {
            onSuccess: () => {
                showSuccess('Vardiya ataması kaldırıldı.');
            },
            onError: (errorData) => {
                showError('Atama kaldırma işlemi sırasında bir hata oluştu.');
            }
        });
    };

    // Excel/PDF dışa aktarma fonksiyonu
    const handleExport = (format) => {
        const params = new URLSearchParams({
            department_id: filter.department_id,
            shift_id: filter.shift_id,
            format: format
        });
        window.open(`${route('admin.shift-schedules.export')}?${params}`, '_blank');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        Vardiya Atamaları
                    </h5>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => handleExport('excel')}
                            className="btn btn-success btn-sm d-flex align-items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </button>
                        <Link
                            href={route('admin.shifts.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 fs-sm"
                        >
                            Geri
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Vardiya Atamaları" />

            <div className="py-6">
                <div className="mw-100 mx-auto px-4">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-3 shadow-sm-md mb-5 p-4">
                        <div className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Departman
                                </label>
                                <select
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    value={filter.department_id}
                                    onChange={(e) => setFilter({ ...filter, department_id: e.target.value })}
                                >
                                    <option value="">Tümü</option>
                                    {departments?.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Vardiya
                                </label>
                                <select
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    value={filter.shift_id}
                                    onChange={(e) => setFilter({ ...filter, shift_id: e.target.value })}
                                >
                                    <option value="">Tümü</option>
                                    {shifts?.map(shift => (
                                        <option key={shift.id} value={shift.id}>
                                            {shift.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Grup Atama Paneli */}
                    <div className="bg-white rounded-3 shadow-sm-md mb-5 p-4">
                        <h5 className="fw-medium">Toplu Vardiya Atama</h5>

                        <div className="d-grid d-grid-cols-1 gap-3">
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Departman
                                </label>
                                <select
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    value={bulkAssignment.selectedEmployees.length > 0 ? '' : bulkAssignment.department_id}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, department_id: e.target.value})}
                                >
                                    <option value="">Departman Seç...</option>
                                    {departments?.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Personel Seçimi
                                </label>
                                <select
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500 h-32"
                                    multiple
                                    value={bulkAssignment.selectedEmployees}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                                        setBulkAssignment({...bulkAssignment, selectedEmployees: selected});
                                    }}
                                >
                                    {filteredEmployees?.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Vardiya
                                </label>
                                <select
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    value={bulkAssignment.shiftId}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, shiftId: e.target.value})}
                                >
                                    <option value="">Vardiya Seç...</option>
                                    {shifts?.map(shift => (
                                        <option key={shift.id} value={shift.id}>
                                            {shift.name} ({shift.start_time}-{shift.end_time})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                    Tarih Aralığı
                                </label>
                                <input
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    type="date"
                                    value={bulkAssignment.start_date}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, start_date: e.target.value})}
                                />
                                <select
                                    className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500"
                                    value={bulkAssignment.recurrence}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, recurrence: e.target.value})}
                                >
                                    <option value="single">Tek Seferlik</option>
                                    <option value="weekly">Haftalık Tekrarlı</option>
                                    <option value="monthly">Aylık Tekrarlı</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-4 d-flex justify-content-end">
                            <button
                                onClick={() => {
                                    // Bulk assignment logic
                                    if(bulkAssignment.selectedEmployees.length && bulkAssignment.shiftId) {
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
                                            }
                                        });
                                    }
                                }}
                                disabled={!bulkAssignment.selectedEmployees.length || !bulkAssignment.shiftId}
                                className="btn btn-primary disabled:opacity-50"
                            >
                                Toplu Atama Yap
                            </button>
                        </div>
                    </div>

                    {/* Atama Tablosu */}
                    <div className="bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Vardiya Atama Tablosu</h5>
                        </div>
                        
                        <div className="overflow-auto">
                            <table className="w-100 divide-y divide-gray-200">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Vardiya
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            Saatler
                                        </th>
                                        <th className="px-6 py-3 text-right fs-xs fw-medium text-muted text-uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSchedules.length > 0 ? (
                                        filteredSchedules.map((schedule, index) => (
                                            <tr key={schedule.id || schedule.temp_id} className="hover:table-light">
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="d-flex align-items-center">
                                                        <div className="d-flex-shrink-0 h-10 w-10">
                                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="fs-sm fw-medium text-dark">
                                                                {schedule.employee?.first_name} {schedule.employee?.last_name}
                                                            </div>
                                                            <div className="fs-sm text-muted">
                                                                {schedule.employee?.identity_no}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {schedule.employee?.department?.title || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <span className="px-2 d-inline-d-flex fs-xs leading-5 fw-semibold rounded-pill bg-primary bg-opacity-10 text-info">
                                                        {schedule.shift?.name}
                                                    </span>
                                                    <div className="fs-xs text-muted">
                                                        {schedule.shift?.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap fs-sm text-dark">
                                                    {new Date(schedule.date).toLocaleDateString('tr-TR')}
                                                    <div className="fs-xs text-muted">
                                                        {(new Date(schedule.date)).toLocaleDateString('tr-TR', { weekday: 'short' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap">
                                                    <div className="fs-sm fw-medium text-dark">
                                                        {schedule.shift?.start_time} - {schedule.shift?.end_time}
                                                    </div>
                                                    <div className="fs-sm text-muted">
                                                        Mola: {schedule.shift?.break_duration}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-nowrap text-right fs-sm fw-medium">
                                                    <button
                                                        onClick={() => handleRemoveAssignment(schedule.id)}
                                                        className="text-danger hover:text-red-900"
                                                    >
                                                        Kaldır
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center fs-sm text-muted">
                                                Vardiya ataması bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Haftalık Takvim Tablosu Seçeneği */}
                    <div className="mt-8 bg-white rounded-3 shadow-sm-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-secondary">
                            <h5 className="fw-medium">Haftalık Vardiya Planı</h5>
                        </div>
                        
                        <div className="p-4">
                            <div className="overflow-auto">
                                <table className="w-100 border-collapse border border-secondary">
                                    <thead>
                                        <tr>
                                            <th className="border border-secondary p-2 table-light">Personel</th>
                                            <th className="border border-secondary p-2 table-light">Pzt</th>
                                            <th className="border border-secondary p-2 table-light">Sal</th>
                                            <th className="border border-secondary p-2 table-light">Çar</th>
                                            <th className="border border-secondary p-2 table-light">Per</th>
                                            <th className="border border-secondary p-2 table-light">Cum</th>
                                            <th className="border border-secondary p-2 table-light">Cts</th>
                                            <th className="border border-secondary p-2 table-light">Paz</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees?.slice(0, 5).map(employee => (
                                            <tr key={employee.id}>
                                                <td className="border border-secondary p-2 fw-medium">
                                                    <div className="fs-sm">
                                                        {employee.first_name} {employee.last_name}
                                                    </div>
                                                    <div className="fs-xs text-muted">
                                                        {employee.department?.title}
                                                    </div>
                                                </td>
                                                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                                                    const assignmentForDay = assignments.find(a => 
                                                        a.employee_id === employee.id && 
                                                        a.date === new Date().toISOString().split('T')[0] // Actually implement real day-based filtering
                                                    );
                                                    
                                                    return (
                                                        <td key={day} className="border border-secondary p-1 text-center align-top">
                                                            {assignmentForDay ? (
                                                                <div className="fs-xs bg-primary bg-opacity-10 text-info p-1 rounded">
                                                                    {assignmentForDay.shift?.name}<br/>
                                                                    <span className="fs-xs">{assignmentForDay.shift?.start_time}-{assignmentForDay.shift?.end_time}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-300 fs-xs">-</div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}