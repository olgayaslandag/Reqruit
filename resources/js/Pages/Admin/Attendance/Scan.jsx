import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { showSuccess, showError } from '@/Utils/toast';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scan() {
    const { props } = usePage();
    const flash = props.flash;

    useEffect(() => {
        if (flash?.success) {
            showSuccess(flash.success);
        }
        if (flash?.error) {
            showError(flash.error);
        }
    }, [flash]);

    const [mode, setMode] = useState('clock_in');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [manualClockTime, setManualClockTime] = useState(new Date().toISOString().slice(0, 16));
    const [cameraOpen, setCameraOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [lastScannedEmployee, setLastScannedEmployee] = useState(null);
    const [initScanner, setInitScanner] = useState(false);

    const html5QrCodeRef = useRef(null);
    const scannerRegionId = 'qr-reader';

    const handleModeChange = (newMode) => {
        setMode(newMode);
    };

    const handleClock = () => {
        if (!selectedEmployee) {
            showError('Lütfen bir çalışan seçin.');
            return;
        }

        const formData = {
            employee_id: selectedEmployee,
            timestamp: manualClockTime,
            type: mode,
        };

        router.post(route('admin.attendance.manual-clock'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setManualClockTime(new Date().toISOString().slice(0, 16));
                setSelectedEmployee('');
                router.reload({ only: ['recentAttendances'] });
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ');
                showError(errorMessage || 'Kayıt sırasında bir hata oluştu.');
            }
        });
    };

    const handleQRScanSuccess = (decodedText) => {
        if (scanning) return;
        setScanning(true);

        const employee = (props.employees || []).find(emp => 
            emp.id.toString() === decodedText || 
            emp.identity_no === decodedText
        );

        if (employee) {
            if (lastScannedEmployee?.id === employee.id) {
                showSuccess(`${employee.first_name} ${employee.last_name} zaten tarandı.`);
                setTimeout(() => setScanning(false), 2000);
                return;
            }

            setLastScannedEmployee(employee);
            setSelectedEmployee(employee.id);
            
            const formData = {
                employee_id: employee.id,
                timestamp: new Date().toISOString().slice(0, 16),
                type: mode,
            };

            router.post(route('admin.attendance.manual-clock'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    showSuccess(`${employee.first_name} ${employee.last_name} - ${mode === 'clock_in' ? 'Giriş' : 'Çıkış'} kaydedildi.`);
                    router.reload({ only: ['recentAttendances'] });
                    setTimeout(() => setScanning(false), 1500);
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors).flat().join(', ');
                    showError(errorMessage || 'Kayıt sırasında bir hata oluştu.');
                    setTimeout(() => setScanning(false), 2000);
                }
            });
        } else {
            showError('QR kod tanımlanamadı. Çalışan bulunamadı.');
            setTimeout(() => setScanning(false), 2000);
        }
    };

    const handleQRScanError = (error) => {
        console.warn('QR scan error:', error);
    };

    const startScanner = async () => {
        try {
            const element = document.getElementById(scannerRegionId);
            if (!element) {
                showError('Tarayıcı alanı bulunamadı. Lütfen sayfayı yenileyin.');
                setCameraOpen(false);
                return;
            }

            html5QrCodeRef.current = new Html5Qrcode(scannerRegionId);

            const cameras = await Html5Qrcode.getCameras();
            if (!cameras || cameras.length === 0) {
                showError('Kamera bulunamadı.');
                setCameraOpen(false);
                return;
            }

            const backCamera = cameras.find(camera => 
                camera.label.toLowerCase().includes('back') || 
                camera.label.toLowerCase().includes('rear') ||
                camera.label.toLowerCase().includes('environment')
            ) || cameras[0];

            await html5QrCodeRef.current.start(
                backCamera.id,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                handleQRScanSuccess,
                handleQRScanError
            );
        } catch (err) {
            console.error('Kamera başlatma hatası:', err);
            showError('Kamera başlatılamadı: ' + (err.message || err || 'Bilinmeyen hata'));
            setCameraOpen(false);
        }
    };

    const stopScanner = async () => {
        try {
            if (html5QrCodeRef.current) {
                const scannerState = html5QrCodeRef.current.getState();
                if (scannerState === 2) {
                    await html5QrCodeRef.current.stop();
                }
                html5QrCodeRef.current = null;
            }
        } catch (err) {
            console.warn('Scanner stop error:', err);
        }
        setCameraOpen(false);
        setScanning(false);
    };

    const toggleCamera = () => {
        if (cameraOpen) {
            stopScanner();
        } else {
            setInitScanner(true);
            setCameraOpen(true);
        }
    };

    useEffect(() => {
        if (initScanner && cameraOpen) {
            setTimeout(() => {
                startScanner();
                setInitScanner(false);
            }, 150);
        }
    }, [initScanner, cameraOpen]);

    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(() => {});
            }
        };
    }, []);

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'QR Tarayıcı & Manuel Kayıt',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Zaman Yönetimi', url: route('admin.attendance.index') },
                    { label: 'QR Giriş/Çıkış', url: route('admin.attendance.scan') },
                ],
            }}
        >
            <Head title="Giriş/Çıkış Kaydet - Devam Kaydı" />
            <div className="row">
                {/* Manuel Kayıt Kartı */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-manual-gearbox me-2"></i> Manuel Kayıt
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Mod Seçimi */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <button
                                        onClick={() => handleModeChange('clock_in')}
                                        className={`btn w-100 ${
                                            mode === 'clock_in'
                                                ? 'btn-success'
                                                : 'btn-outline-success'
                                        }`}
                                    >
                                        <i className="ti ti-login me-2"></i> Giriş
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button
                                        onClick={() => handleModeChange('clock_out')}
                                        className={`btn w-100 ${
                                            mode === 'clock_out'
                                                ? 'btn-danger'
                                                : 'btn-outline-danger'
                                        }`}
                                    >
                                        <i className="ti ti-logout me-2"></i> Çıkış
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <label className="form-label fw-medium">Personel</label>
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

                                <div className="col-md-12">
                                    <label className="form-label fw-medium">Zaman</label>
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
                                    className={`btn w-100 ${
                                        selectedEmployee
                                            ? mode === 'clock_in'
                                                ? 'btn-success'
                                                : 'btn-danger'
                                            : 'btn-secondary disabled'
                                    }`}
                                >
                                    {mode === 'clock_in' ? (
                                        <><i className="ti ti-login me-2"></i> Giriş Yap</>
                                    ) : (
                                        <><i className="ti ti-logout me-2"></i> Çıkış Yap</>
                                    )}
                                    - {new Date(manualClockTime).toLocaleTimeString('tr-TR')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Kod Tarayıcı ve Son Kayıtlar */}
                <div className="col-md-6">
                    {/* QR Kod ile Kayıt */}
                    <div className="card mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-qrcode me-2"></i> QR Kod ile Kayıt
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Mod Seçimi */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <button
                                        onClick={() => handleModeChange('clock_in')}
                                        className={`btn w-100 ${
                                            mode === 'clock_in'
                                                ? 'btn-success'
                                                : 'btn-outline-success'
                                        }`}
                                    >
                                        <i className="ti ti-login me-2"></i> Giriş
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button
                                        onClick={() => handleModeChange('clock_out')}
                                        className={`btn w-100 ${
                                            mode === 'clock_out'
                                                ? 'btn-danger'
                                                : 'btn-outline-danger'
                                        }`}
                                    >
                                        <i className="ti ti-logout me-2"></i> Çıkış
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                {!cameraOpen ? (
                                    <div className="bg-light border border-2 border-dashed rounded p-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <i className="ti ti-camera-plus fs-1 text-muted mb-3" style={{fontSize: '3rem'}}></i>
                                            <h6 className="fw-medium text-dark mb-2">QR Tarayıcı</h6>
                                            <p className="text-muted mb-3">
                                                Çalışan kimlik kartındaki QR kodunu tarayın
                                            </p>
                                            <button onClick={toggleCamera} className="btn btn-primary btn-sm">
                                                <i className="ti ti-camera me-2"></i> Kamera Başlat
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div id={scannerRegionId} style={{ width: '100%', maxWidth: '350px', margin: '0 auto' }}></div>
                                        {lastScannedEmployee && (
                                            <div className="alert alert-success mt-3 mb-0">
                                                <i className="ti ti-user-check me-2"></i>
                                                <strong>{lastScannedEmployee.first_name} {lastScannedEmployee.last_name}</strong>
                                                <small className="ms-2">({lastScannedEmployee.identity_no})</small>
                                            </div>
                                        )}
                                        <button onClick={toggleCamera} className="btn btn-danger btn-sm mt-3">
                                            <i className="ti ti-camera-off me-2"></i> Kamerayı Durdur
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Son Kayıtlar */}
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold">
                                <i className="ti ti-history me-2"></i> Son Kayıtlar
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            {props.recentAttendances && props.recentAttendances.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="fw-medium">Personel</th>
                                                <th className="fw-medium">Zaman</th>
                                                <th className="fw-medium">Tip</th>
                                                <th className="fw-medium">Durum</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {props.recentAttendances.map((record, index) => (
                                                <tr key={index}>
                                                    <td className="fw-medium">
                                                        {record.employee.first_name} {record.employee.last_name}
                                                    </td>
                                                    <td>
                                                        {record.timestamp_formatted || (record.timestamp ? new Date(record.timestamp).toLocaleString('tr-TR') : '-')}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${
                                                            record.type === 'clock_in'
                                                                ? 'bg-success'
                                                                : 'bg-danger'
                                                        }`}>
                                                            {record.type === 'clock_in' ? 'Giriş' : 'Çıkış'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-success">
                                                            Kaydedildi
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-muted mb-0">
                                        Son kayıt bulunamadı.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}