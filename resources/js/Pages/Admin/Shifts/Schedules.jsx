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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Vardiya Atamaları
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExport('excel')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </button>
                        <Link
                            href={route('admin.shifts.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                            Geri
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Vardiya Atamaları" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtreleme Paneli */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departman
                                </label>
                                <select
                                    value={filter.department_id}
                                    onChange={(e) => setFilter({ ...filter, department_id: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vardiya
                                </label>
                                <select
                                    value={filter.shift_id}
                                    onChange={(e) => setFilter({ ...filter, shift_id: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    <div className="bg-white rounded-lg shadow-md mb-6 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Toplu Vardiya Atama</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departman
                                </label>
                                <select
                                    value={bulkAssignment.selectedEmployees.length > 0 ? '': bulkAssignment.department_id}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, department_id: e.target.value})}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Personel Seçimi
                                </label>
                                <select
                                    multiple
                                    value={bulkAssignment.selectedEmployees}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                                        setBulkAssignment({...bulkAssignment, selectedEmployees: selected});
                                    }}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-32"
                                >
                                    {filteredEmployees?.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vardiya
                                </label>
                                <select
                                    value={bulkAssignment.shiftId}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, shiftId: e.target.value})}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tarih Aralığı
                                </label>
                                <input
                                    type="date"
                                    value={bulkAssignment.start_date}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, start_date: e.target.value})}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-1"
                                />
                                <select
                                    value={bulkAssignment.recurrence}
                                    onChange={(e) => setBulkAssignment({...bulkAssignment, recurrence: e.target.value})}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="single">Tek Seferlik</option>
                                    <option value="weekly">Haftalık Tekrarlı</option>
                                    <option value="monthly">Aylık Tekrarlı</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
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
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Toplu Atama Yap
                            </button>
                        </div>
                    </div>

                    {/* Atama Tablosu */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Vardiya Atama Tablosu</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Personel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Departman
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vardiya
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Saatler
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSchedules.length > 0 ? (
                                        filteredSchedules.map((schedule, index) => (
                                            <tr key={schedule.id || schedule.temp_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {schedule.employee?.first_name} {schedule.employee?.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {schedule.employee?.identity_no}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {schedule.employee?.department?.title || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {schedule.shift?.name}
                                                    </span>
                                                    <div className="text-xs text-gray-500">
                                                        {schedule.shift?.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(schedule.date).toLocaleDateString('tr-TR')}
                                                    <div className="text-xs text-gray-500">
                                                        {(new Date(schedule.date)).toLocaleDateString('tr-TR', { weekday: 'short' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {schedule.shift?.start_time} - {schedule.shift?.end_time}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Mola: {schedule.shift?.break_duration}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleRemoveAssignment(schedule.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Kaldır
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                                Vardiya ataması bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Haftalık Takvim Tablosu Seçeneği */}
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Haftalık Vardiya Planı</h3>
                        </div>
                        
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Personel</th>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Pzt</th>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Sal</th>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Çar</th>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Per</th>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Cum</th>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Cts</th>
                                            <th className="border border-gray-200 p-2 bg-gray-50">Paz</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees?.slice(0, 5).map(employee => (
                                            <tr key={employee.id}>
                                                <td className="border border-gray-200 p-2 font-medium">
                                                    <div className="text-sm">
                                                        {employee.first_name} {employee.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {employee.department?.title}
                                                    </div>
                                                </td>
                                                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                                                    const assignmentForDay = assignments.find(a => 
                                                        a.employee_id === employee.id && 
                                                        a.date === new Date().toISOString().split('T')[0] // Actually implement real day-based filtering
                                                    );
                                                    
                                                    return (
                                                        <td key={day} className="border border-gray-200 p-1 text-center align-top">
                                                            {assignmentForDay ? (
                                                                <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded">
                                                                    {assignmentForDay.shift?.name}<br/>
                                                                    <span className="text-xs">{assignmentForDay.shift?.start_time}-{assignmentForDay.shift?.end_time}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-300 text-xs">-</div>
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