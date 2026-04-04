import { Link } from '@inertiajs/react';
import { format, parseISO, isValid, addHours } from 'date-fns';
import { tr } from 'date-fns/locale';

export const getAttendanceStatusBadge = (status, clock_in = null, clock_out = null) => {
    let colorClass = '';
    let label = '';

    switch (status) {
        case 'present':
            colorClass = 'bg-success text-white';
            label = 'Devrede';
            break;
        case 'absent':
            colorClass = 'bg-danger text-white';
            label = 'Devre Dışı';
            break;
        case 'late':
            colorClass = 'bg-warning text-dark';
            label = 'Geç Giriş';
            break;
        case 'early_departure':
            colorClass = 'bg-orange text-white';
            label = 'Erken Çıkış';
            break;
        case 'on_leave':
            colorClass = 'bg-info text-white';
            label = 'İzinli';
            break;
        default:
            colorClass = 'bg-secondary text-white';
            label = status?.charAt(0)?.toUpperCase() + status?.slice(1) || '';
    }

    // Geç kalma/erken çıkma kontrollerini manuel yapalım
    if (clock_in && status === 'present') {
        const clockInTime = parseISO(clock_in);
        const shiftStartTime = new Date();
        shiftStartTime.setHours(9, 0, 0, 0); // varsayılan 9:00

        if (isValid(clockInTime) && clockInTime > shiftStartTime) {
            colorClass = 'bg-warning text-dark';
            label = 'Geç Giriş';
        }
    }

    if (clock_out && status === 'present') {
        const clockOutTime = parseISO(clock_out);
        const shiftEndTime = new Date();
        shiftEndTime.setHours(18, 0, 0, 0); // varsayılan 18:00

        if (isValid(clockOutTime) && clockOutTime < shiftEndTime) {
            colorClass = 'bg-orange text-white';
            label = 'Erken Çıkış';
        }
    }

    return (
        <span className={`badge ${colorClass}`}>
            {label}
        </span>
    );
};

export const formatTime = (timeString) => {
    if (!timeString) return '-';
    try {
        const date = parseISO(timeString);
        if (!isValid(date)) return '-';
        return format(date, 'HH:mm');
    } catch {
        return '-';
    }
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        if (!isValid(date)) return '';
        return format(date, 'dd MMM yyyy', { locale: tr });
    } catch {
        return '';
    }
};

export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
        const date = parseISO(dateTimeString);
        if (!isValid(date)) return '';
        return format(date, 'dd MMM yyyy HH:mm', { locale: tr });
    } catch {
        return '';
    }
};

export const calculateWorkingHours = (clockIn, clockOut, breakDuration = 0) => {
    if (!clockIn || !clockOut) return 0;
    
    const startTime = parseISO(clockIn);
    const endTime = parseISO(clockOut);
    
    if (!isValid(endTime) || !isValid(startTime)) return 0;
    
    let diffMinutes = Math.floor((endTime - startTime) / 1000 / 60);
    diffMinutes -= breakDuration;
    
    if (diffMinutes < 0) return 0;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getOvertimeHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 0;
    
    const startTime = parseISO(clockIn);
    const endTime = parseISO(clockOut);
    const standardWorkHours = 8; // varsayılan 8 saat
    
    if (!isValid(endTime) || !isValid(startTime)) return 0;
    
    const diffMs = endTime - startTime;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const overtime = Math.max(0, totalHours - standardWorkHours);
    
    return overtime.toFixed(1);
};

export const attendanceTypeOptions = [
    { value: 'normal', label: 'Normal Devam' },
    { value: 'leave', label: 'İzinli' },
    { value: 'holiday', label: 'Resmi Tatil' },
    { value: 'overtime', label: 'Fazla Mesai' },
];

export const attendanceStatusOptions = [
    { value: 'present', label: 'Devrede' },
    { value: 'absent', label: 'Devre Dışı' },
    { value: 'late', label: 'Geç Giriş' },
    { value: 'early_departure', label: 'Erken Çıkış' },
];

export const shiftOptions = [
    { value: 'morning', label: 'Sabah Vardiyası (08:00-16:00)' },
    { value: 'afternoon', label: 'Öğlen Vardiyası (16:00-24:00)' },
    { value: 'evening', label: 'Akşam Vardiyası (24:00-08:00)' },
    { value: 'full', label: 'Tam Vardiya (09:00-18:00)' },
];