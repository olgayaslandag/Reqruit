/**
 * Para ve tarih formatlama yardımcı fonksiyonları
 */

/**
 * Türk Lirası formatında para gösterimi
 * @param {number|string} amount - Para miktarı
 * @returns {string} Formatlanmış para stringi
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') {
        return '-';
    }
    
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) {
        return '-';
    }
    
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

/**
 * Türk Lirası formatında para gösterimi (sadece sayı)
 * @param {number|string} amount - Para miktarı
 * @returns {string} Formatlanmış sayı
 */
export const formatMoney = (amount) => {
    if (amount === null || amount === undefined || amount === '') {
        return '0,00';
    }
    
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) {
        return '0,00';
    }
    
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

/**
 * Türkçe tarih formatı (GG.AA.YYYY)
 * @param {string|Date} date - Tarih
 * @returns {string} Formatlanmış tarih
 */
export const formatDate = (date) => {
    if (!date) {
        return '-';
    }
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '-';
    }
    
    return d.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

/**
 * Türkçe tarih ve saat formatı
 * @param {string|Date} date - Tarih
 * @returns {string} Formatlanmış tarih ve saat
 */
export const formatDateTime = (date) => {
    if (!date) {
        return '-';
    }
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '-';
    }
    
    return d.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Ay ve yıl formatı (Örn: Ocak 2026)
 * @param {string|Date} date - Tarih
 * @returns {string} Formatlanmış ay-yıl
 */
export const formatMonthYear = (date) => {
    if (!date) {
        return '-';
    }
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '-';
    }
    
    return d.toLocaleDateString('tr-TR', {
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Dönem formatı (Örn: 2026-01)
 * @param {string|Date} date - Tarih
 * @returns {string} Formatlanmış dönem
 */
export const formatPeriod = (date) => {
    if (!date) {
        return '-';
    }
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '-';
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    
    return `${year}-${month}`;
};

/**
 * Tam tarih formatı (YYYY-MM-DD)
 * @param {string|Date} date - Tarih
 * @returns {string} Formatlanmış tarih
 */
export const formatDateInput = (date) => {
    if (!date) {
        return '';
    }
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '';
    }
    
    return d.toISOString().split('T')[0];
};

/**
 * Yüzde formatı
 * @param {number|string} value - Değer
 * @param {number} decimals - Ondalık basamak sayısı
 * @returns {string} Formatlanmış yüzde
 */
export const formatPercentage = (value, decimals = 2) => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
        return '-';
    }
    
    return `${num.toFixed(decimals)}%`;
};

/**
 * Çalışma günü formatı
 * @param {number} days - Gün sayısı
 * @returns {string} Formatlanmış gün
 */
export const formatWorkDays = (days) => {
    if (days === null || days === undefined) {
        return '-';
    }
    
    return `${days} gün`;
};

/**
 * Sosyal güvenlik numarası formatı
 * @param {string} ssn - TC Kimlik No veya SSK No
 * @returns {string} Formatlanmış numara
 */
export const formatSSN = (ssn) => {
    if (!ssn) {
        return '-';
    }
    
    // TC Kimlik No (11 hane)
    if (ssn.length === 11) {
        return `${ssn.substring(0, 3)} ${ssn.substring(3, 6)} ${ssn.substring(6, 9)} ${ssn.substring(9)}`;
    }
    
    // SSK No (10 hane)
    if (ssn.length === 10) {
        return `${ssn.substring(0, 3)} ${ssn.substring(3, 7)} ${ssn.substring(7)}`;
    }
    
    return ssn;
};

/**
 * Sayıları formatlar
 * @param {number|string} number - Sayı
 * @param {number} decimals - Ondalık basamak sayısı
 * @returns {string} Formatlanmış sayı
 */
export const formatNumber = (number, decimals = 2) => {
    if (number === null || number === undefined || number === '') {
        return '-';
    }
    
    const num = typeof number === 'string' ? parseFloat(number) : number;
    
    if (isNaN(num)) {
        return '-';
    }
    
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
};