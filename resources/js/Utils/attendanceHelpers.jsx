import { Link } from '@inertiajs/react';
import moment from 'moment';

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
        const clockInTime = moment(clock_in, 'YYYY-MM-DD HH:mm:ss');
        const shiftStartTime = moment().set({ hour: 9, minute: 0, second: 0 }); // varsayılan 9:00

        if (clockInTime.isAfter(shiftStartTime)) {
            colorClass = 'bg-warning text-dark';
            label = 'Geç Giriş';
        }
    }

    if (clock_out && status === 'present') {
        const clockOutTime = moment(clock_out, 'YYYY-MM-DD HH:mm:ss');
        const shiftEndTime = moment().set({ hour: 18, minute: 0, second: 0 }); // varsayılan 18:00

        if (clockOutTime.isBefore(shiftEndTime)) {
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
    return moment(timeString).format('HH:mm');
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).locale('tr').format('DD MMM YYYY');
};

export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    return moment(dateTimeString).locale('tr').format('DD MMM YYYY HH:mm');
};

export const calculateWorkingHours = (clockIn, clockOut, breakDuration = 0) => {
    if (!clockIn || !clockOut) return 0;
    
    const startTime = moment(clockIn);
    const endTime = moment(clockOut);
    
    if (!endTime.isValid() || !startTime.isValid()) return 0;
    
    let diffMinutes = endTime.diff(startTime, 'minutes');
    diffMinutes -= breakDuration;
    
    if (diffMinutes < 0) return 0;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getOvertimeHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 0;
    
    const startTime = moment(clockIn);
    const endTime = moment(clockOut);
    const standardWorkHours = 8; // varsayılan 8 saat
    
    if (!endTime.isValid() || !startTime.isValid()) return 0;
    
    const totalHours = endTime.diff(startTime, 'hours');
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