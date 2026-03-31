import { useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/sweetAlert';
import { formatDateTime, formatDate } from '@/Utils/attendanceHelpers.jsx';

export default function Scan() {
    const { props } = usePage();
    const flash = props.flash;

    const [mode, setMode] = useState('clock_in'); // clock_in or clock_out
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [manualClockTime, setManualClockTime] = useState(new Date().toISOString().slice(0, 16));

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const handleModeChange = (newMode) => {
        setMode(newMode);
    };

    const handleClock = async () => {
        if (!selectedEmployee) {
            showError('Lütfen bir çalışan seçin.');
            return;
        }

        try {
            const formData = {
                employee_id: selectedEmployee,
                timestamp: manualClockTime,
                type: mode, // clock_in or clock_out
            };

            router.post(route('admin.attendance.manual-clock'), formData, {
                onSuccess: () => {
                    showSuccess(mode === 'clock_in' ? 'Giriş kaydı oluşturuldu.' : 'Çıkış kaydı oluşturuldu.');
                    setManualClockTime(new Date().toISOString().slice(0, 16));
                },
                onError: (errors) => {
                    if (errors.message) {
                        showError(errors.message);
                    } else {
                        showError('Kayıt sırasında bir hata oluştu.');
                    }
                }
            });
        } catch (error) {
            console.error('Clock error:', error);
            showError('Kayıt işlemi sırasında bir hata oluştu.');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold">
                        QR Tarayıcı & Manuel Kayıt
                    </h5>
                </div>
            }
        >
            <Head title="Devam Kaydı" />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                        <div className="p-4">
                            <div className="d-flex gap-3 mb-5 border-b pb-4">
                                <button
                                    onClick={() => handleModeChange('clock_in')}
                                    className={`px-6 py-3 rounded fw-medium ${
                                        mode === 'clock_in'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-dark hover:bg-gray-300'
                                    }`}
                                >
                                    Giriş
                                </button>
                                <button
                                    onClick={() => handleModeChange('clock_out')}
                                    className={`px-6 py-3 rounded fw-medium ${
                                        mode === 'clock_out'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-200 text-dark hover:bg-gray-300'
                                    }`}
                                >
                                    Çıkış
                                </button>
                            </div>

                            {/* Manual Entry Section */}
                            <div className="mb-5">
                                <h5 className="fw-medium">Manuel Kayıt</h5>
                                
                                <div className="d-grid d-grid-cols-1 gap-3">
                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Personel
                                        </label>
                                        <select className="form-control" value={selectedEmployee}
                                            onChange={(e) => setSelectedEmployee(e.target.value)}
                                        >
                                            <option value="">Personel Seçin</option>
                                            {(props.employees || []).map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name} - {emp.identity_no}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Zaman
                                        </label>
                                        <input className="form-control" type="datetime-local"
                                            value={manualClockTime}
                                            onChange={(e) => setManualClockTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={handleClock}
                                        disabled={!selectedEmployee}
                                        className={`btn fw-medium ${
                                            selectedEmployee
                                                ? mode === 'clock_in'
                                                    ? 'btn-success'
                                                    : 'btn-danger'
                                                : 'btn-secondary disabled'
                                        }`}
                                    >
                                        {mode === 'clock_in' ? 'Giriş Yap' : 'Çıkış Yap'} - {new Date(manualClockTime).toLocaleTimeString('tr-TR')}
                                    </button>
                                </div>
                            </div>

                            {/* QR Scanner Section */}
                            <div className="border-t pt-6">
                                <h5 className="fw-medium">QR Kod ile Kayıt</h5>
                                
                                <div className="bg-light border-2 border-dashed border-secondary rounded p-8 text-center">
                                    <div className="d-flex d-flex-column align-items-center">
                                        <svg className="w-16 h-16 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <h5 className="fw-medium text-dark mb-2">QR Tarayıcı Kamerayı Aç</h5>
                                        <p className="fs-sm text-muted mb-4">
                                            Çalışan kimlik kartındaki QR kodunu tarayın
                                        </p>
                                        <button className="btn btn-primary btn-sm">
                                            Kamera Aç
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Attendance Records */}
                            <div className="border-t pt-6 mt-8">
                                <h5 className="fw-medium">Son Kayıtlar</h5>
                                
                                {props.recentAttendances && props.recentAttendances.length > 0 ? (
                                    <div className="overflow-auto">
                                        <table className="w-100 divide-y divide-gray-200">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Personel</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Zaman</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Tip</th>
                                                    <th className="px-4 py-3 text-left fs-xs fw-medium text-muted text-uppercase">Durum</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {(props.recentAttendances || []).map((record, index) => (
                                                    <tr key={index} className="hover:table-light">
                                                        <td className="px-4 py-3 text-nowrap fs-sm fw-medium text-dark">
                                                            {record.employee.first_name} {record.employee.last_name}
                                                        </td>
                                                        <td className="px-4 py-3 text-nowrap fs-sm text-dark">
                                                            {formatDateTime(record.timestamp)}
                                                        </td>
                                                        <td className="px-4 py-3 text-nowrap fs-sm">
                                                            <span className={`d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium ${
                                                                record.type === 'clock_in' 
                                                                    ? 'bg-success bg-opacity-10 text-success' 
                                                                    : 'bg-danger bg-opacity-10 text-danger'
                                                            }`}>
                                                                {record.type === 'clock_in' ? 'Giriş' : 'Çıkış'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-nowrap fs-sm">
                                                            <span className="d-inline-d-flex align-items-center px-2.5 py-0.5 rounded-pill fs-xs fw-medium bg-success bg-opacity-10 text-success">
                                                                Kaydedildi
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="fs-sm text-muted text-center py-4">
                                        Son kayıt bulunamadı.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}