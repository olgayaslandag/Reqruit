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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        QR Tarayıcı & Manuel Kayıt
                    </h2>
                </div>
            }
        >
            <Head title="Devam Kaydı" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <div className="flex gap-4 mb-6 border-b pb-4">
                                <button
                                    onClick={() => handleModeChange('clock_in')}
                                    className={`px-6 py-3 rounded-lg font-medium ${
                                        mode === 'clock_in'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Giriş
                                </button>
                                <button
                                    onClick={() => handleModeChange('clock_out')}
                                    className={`px-6 py-3 rounded-lg font-medium ${
                                        mode === 'clock_out'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Çıkış
                                </button>
                            </div>

                            {/* Manual Entry Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Manuel Kayıt</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Personel
                                        </label>
                                        <select
                                            value={selectedEmployee}
                                            onChange={(e) => setSelectedEmployee(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Personel Seçin</option>
                                            {props.employees?.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name} - {emp.identity_no}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Zaman
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={manualClockTime}
                                            onChange={(e) => setManualClockTime(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={handleClock}
                                        disabled={!selectedEmployee}
                                        className={`px-6 py-3 rounded-md text-white font-medium ${
                                            selectedEmployee
                                                ? mode === 'clock_in'
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-red-600 hover:bg-red-700'
                                                : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {mode === 'clock_in' ? 'Giriş Yap' : 'Çıkış Yap'} - {new Date(manualClockTime).toLocaleTimeString('tr-TR')}
                                    </button>
                                </div>
                            </div>

                            {/* QR Scanner Section */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">QR Kod ile Kayıt</h3>
                                
                                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <h4 className="text-lg font-medium text-gray-900 mb-2">QR Tarayıcı Kamerayı Aç</h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Çalışan kimlik kartındaki QR kodunu tarayın
                                        </p>
                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                            Kamera Aç
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Attendance Records */}
                            <div className="border-t pt-6 mt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Son Kayıtlar</h3>
                                
                                {props.recentAttendances && props.recentAttendances.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personel</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zaman</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {props.recentAttendances.map((record, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {record.employee.first_name} {record.employee.last_name}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDateTime(record.timestamp)}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                record.type === 'clock_in' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {record.type === 'clock_in' ? 'Giriş' : 'Çıkış'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Kaydedildi
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
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