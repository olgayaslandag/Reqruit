/**
 * Form doğrulama ve kontrol yardımcı fonksiyonları
 */

// Avans limit parametreleri
const ADVANCE_PARAMS = {
    // Maksimum avans oranı (maaşın yüzdesi)
    maxPercentage: 0.4, // %40
    // Minimum avans tutarı
    minAmount: 1000, // TL
    // Maksimum avans tutarı
    maxAmount: 500000, // TL
    // İzin verilen avans türleri
    allowedTypes: ['salary', 'emergency', 'education', 'housing', 'other'],
    // Avans geri ödeme taksit sayısı
    maxInstallments: 12,
};

/**
 * Avans talebi için doğrulama
 * @param {object} data - Avans verileri
 * @param {object} employeeData - Çalışan verileri (maaş bilgisi)
 * @returns {object} Doğrulama sonucu { valid, errors }
 */
export const validateAdvanceRequest = (data, employeeData = {}) => {
    const errors = {};
    
    // Tutar kontrolü
    if (!data.amount || data.amount <= 0) {
        errors.amount = 'Avans tutarı girilmelidir.';
    } else if (data.amount < ADVANCE_PARAMS.minAmount) {
        errors.amount = `Minimum avans tutarı ${ADVANCE_PARAMS.minAmount.toLocaleString('tr-TR')} TL'dir.`;
    } else if (data.amount > ADVANCE_PARAMS.maxAmount) {
        errors.amount = `Maksimum avans tutarı ${ADVANCE_PARAMS.maxAmount.toLocaleString('tr-TR')} TL'dir.`;
    }
    
    // Maaş oranı kontrolü
    if (employeeData.gross_salary) {
        const maxAllowed = employeeData.gross_salary * ADVANCE_PARAMS.maxPercentage;
        if (data.amount > maxAllowed) {
            errors.amount = `Bu tutar maaşınızın %${ADVANCE_PARAMS.maxPercentage * 100}'ünü aşmaktadır. Maksimum: ${maxAllowed.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;
        }
    }
    
    // Avans türü kontrolü
    if (!data.type) {
        errors.type = 'Avans türü seçilmelidir.';
    } else if (!ADVANCE_PARAMS.allowedTypes.includes(data.type)) {
        errors.type = 'Geçersiz avans türü.';
    }
    
    // Açıklama kontrolü (opsiyonel ama bazı türler için zorunlu)
    if (data.type === 'emergency' && (!data.description || data.description.length < 10)) {
        errors.description = 'Acil durum avansı için açıklama gereklidir.';
    }
    
    // Geri ödeme taksit sayısı kontrolü
    if (data.installments && data.installments > ADVANCE_PARAMS.maxInstallments) {
        errors.installments = `Maksimum taksit sayısı ${ADVANCE_PARAMS.maxInstallments}'dir.`;
    }
    
    // Tarih kontrolü
    if (!data.request_date) {
        errors.request_date = 'Talep tarihi gereklidir.';
    } else {
        const requestDate = new Date(data.request_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (requestDate < today) {
            errors.request_date = 'Talep tarihi bugün veya sonraki bir tarih olmalıdır.';
        }
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Bordro dönemi için doğrulama
 * @param {object} data - Dönem verileri
 * @returns {object} Doğrulama sonucu
 */
export const validatePayrollPeriod = (data) => {
    const errors = {};
    
    // Dönem adı
    if (!data.name || data.name.trim().length < 3) {
        errors.name = 'Dönem adı en az 3 karakter olmalıdır.';
    }
    
    // Başlangıç ve bitiş tarihi
    if (!data.start_date) {
        errors.start_date = 'Başlangıç tarihi gereklidir.';
    }
    
    if (!data.end_date) {
        errors.end_date = 'Bitiş tarihi gereklidir.';
    }
    
    if (data.start_date && data.end_date) {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        
        if (end <= start) {
            errors.end_date = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.';
        }
        
        // Dönem en az 1 gün olmalı
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (diffDays > 31) {
            errors.end_date = 'Dönem en fazla 31 gün olabilir.';
        }
    }
    
    // Çalışma günü sayısı
    if (!data.work_days || data.work_days < 1 || data.work_days > 31) {
        errors.work_days = 'Çalışma günü sayısı 1-31 arasında olmalıdır.';
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Maaş kalemi için doğrulama
 * @param {object} data - Kalem verileri
 * @returns {object} Doğrulama sonucu
 */
export const validateSalaryComponent = (data) => {
    const errors = {};
    
    // Kalem adı
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Kalem adı en az 2 karakter olmalıdır.';
    }
    
    // Kalem tipi
    if (!data.type) {
        errors.type = 'Kalem tipi seçilmelidir.';
    } else if (!['allowance', 'deduction'].includes(data.type)) {
        errors.type = 'Geçersiz kalem tipi.';
    }
    
    // Tutar veya oran
    if (!data.is_percentage) {
        // Sabit tutar
        if (!data.amount || data.amount < 0) {
            errors.amount = 'Tutar 0 veya daha büyük olmalıdır.';
        }
    } else {
        // Yüzdeli
        if (!data.percentage || data.percentage <= 0 || data.percentage > 100) {
            errors.percentage = 'Oran 0-100 arasında olmalıdır.';
        }
    }
    
    // Vergi ve SGK dahil mi
    if (data.type === 'allowance') {
        if (data.taxable === undefined) {
            errors.taxable = 'Vergilendirme durumu belirtilmelidir.';
        }
        
        if (data.sgk_applicable === undefined) {
            errors.sgk_applicable = 'SGK uygulanma durumu belirtilmelidir.';
        }
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Avans onay durumu kontrolü
 * @param {object} advance - Avans verisi
 * @param {object} user - Kullanıcı verisi
 * @returns {object} Onay durumu
 */
export const checkAdvanceApprovalStatus = (advance, user) => {
    const result = {
        canApprove: false,
        canReject: false,
        canCancel: false,
        message: '',
    };
    
    // Zaten onaylanmış veya reddedilmişse
    if (advance.status === 'approved') {
        result.message = 'Bu avans zaten onaylanmış.';
        return result;
    }
    
    if (advance.status === 'rejected') {
        result.message = 'Bu avans reddedilmiş.';
        return result;
    }
    
    if (advance.status === 'cancelled') {
        result.message = 'Bu avans iptal edilmiş.';
        return result;
    }
    
    // Onay sırası kontrolü
    const currentStep = advance.approval_step || 1;
    
    // Yetki kontrolü
    if (user.role === 'admin' || user.role === 'hr') {
        if (currentStep === advance.total_steps) {
            result.canApprove = true;
            result.canReject = true;
        } else {
            result.canApprove = true;
        }
    } else if (user.id === advance.employee_id) {
        // Kendi talebi
        result.canCancel = advance.status === 'pending';
    }
    
    return result;
};

/**
 * Bordro onay durumu kontrolü
 * @param {object} payroll - Bordro verisi
 * @param {object} user - Kullanıcı verisi
 * @returns {object} Onay durumu
 */
export const checkPayrollApprovalStatus = (payroll, user) => {
    const result = {
        canApprove: false,
        canReject: false,
        canEdit: false,
        canDelete: false,
        message: '',
    };
    
    // Durum kontrolü
    if (payroll.status === 'approved') {
        result.message = 'Bu bordro zaten onaylanmış.';
        return result;
    }
    
    if (payroll.status === 'locked') {
        result.message = 'Bu bordro kilitlenmiş.';
        return result;
    }
    
    // Yetki kontrolü
    if (user.role === 'admin' || user.role === 'hr') {
        result.canEdit = true;
        
        if (payroll.status === 'draft') {
            result.canApprove = true;
        } else if (payroll.status === 'pending') {
            result.canApprove = true;
            result.canReject = true;
        }
        
        // Admin her zaman silebilir (draft durumunda)
        if (user.role === 'admin' && payroll.status === 'draft') {
            result.canDelete = true;
        }
    }
    
    return result;
};

/**
 * Tarih aralığı doğrulaması
 * @param {string} startDate - Başlangıç tarihi
 * @param {string} endDate - Bitiş tarihi
 * @param {number} maxDays - Maksimum gün sayısı
 * @returns {object} Doğrulama sonucu
 */
export const validateDateRange = (startDate, endDate, maxDays = 365) => {
    const errors = {};
    
    if (!startDate || !endDate) {
        return { valid: false, errors: { date: 'Tarih bilgileri eksik.' } };
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime())) {
        errors.startDate = 'Geçersiz başlangıç tarihi.';
    }
    
    if (isNaN(end.getTime())) {
        errors.endDate = 'Geçersiz bitiş tarihi.';
    }
    
    if (start > end) {
        errors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.';
    }
    
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays > maxDays) {
        errors.endDate = `Tarih aralığı ${maxDays} günü aşamaz.`;
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * IBAN doğrulaması
 * @param {string} iban - IBAN numarası
 * @returns {boolean} Geçerli mi
 */
export const validateIBAN = (iban) => {
    if (!iban) return false;
    
    // TR ile başlamalı
    if (!iban.startsWith('TR')) return false;
    
    // 26 karakter olmalı
    if (iban.length !== 26) return false;
    
    // Sadece rakam ve harf olmalı
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
    if (!ibanRegex.test(iban)) return false;
    
    // Mod 97 kontrolü
    const rearranged = iban.substring(4) + iban.substring(0, 4);
    const numeric = rearranged.split('').map(c => {
        const code = c.charCodeAt(0);
        return code >= 65 && code <= 90 ? (code - 55).toString() : c;
    }).join('');
    
    // Mod97 hesaplama
    let remainder = '';
    for (let i = 0; i < numeric.length; i += 7) {
        const chunk = remainder + numeric.substring(i, i + 7);
        remainder = (parseInt(chunk, 10) % 97).toString();
    }
    
    return parseInt(remainder, 10) === 1;
};

/**
 * Para tutarı doğrulaması
 * @param {number|string} amount - Tutar
 * @param {number} min - Minimum değer
 * @param {number} max - Maksimum değer
 * @returns {object} Doğrulama sonucu
 */
export const validateAmount = (amount, min = 0, max = null) => {
    const errors = {};
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) {
        errors.amount = 'Geçerli bir sayı giriniz.';
    } else if (num < min) {
        errors.amount = `Minimum değer ${min.toLocaleString('tr-TR')} TL'dir.`;
    } else if (max !== null && num > max) {
        errors.amount = `Maksimum değer ${max.toLocaleString('tr-TR')} TL'dir.`;
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
