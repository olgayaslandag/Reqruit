/**
 * Employee modülü için yardımcı fonksiyonlar
 * Backend Enum değerleri ile uyumlu:
 * - ContractTypeEnum: permanent, fixed_term, internship, probation
 * - EmploymentTypeEnum: full_time, part_time, remote, hybrid
 * - GenderEnum: male, female, not_specified
 * - MaritalStatusEnum: single, married, divorced, widowed
 * - EmployeeStatusEnum: active, terminated
 */

/**
 * Çalışan durumu için badge bileşeni
 */
export const getStatusBadge = (employee) => {
    const isActive = !employee.termination_date;
    if (isActive) {
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Aktif
            </span>
        );
    }
    return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Çıktı
        </span>
    );
};

/**
 * Çalışan durumu için büyük badge bileşeni (Show sayfası için)
 */
export const getStatusBadgeLarge = (employee) => {
    const isActive = !employee.termination_date;
    if (isActive) {
        return (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                Aktif
            </span>
        );
    }
    return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
            Çıktı ({employee.termination_date})
        </span>
    );
};

/**
 * Çalışma tipi etiketi
 */
export const getEmploymentTypeLabel = (type) => {
    const types = {
        full_time: 'Tam Zamanlı',
        part_time: 'Yarı Zamanlı',
        remote: 'Uzaktan',
        hybrid: 'Hibrit',
    };
    return types[type] || type;
};

/**
 * Sözleşme tipi etiketi
 */
export const getContractTypeLabel = (type) => {
    const types = {
        permanent: 'Belirsiz Süreli',
        fixed_term: 'Belirli Süreli',
        internship: 'Staj',
        probation: 'Deneme Süreli',
    };
    return types[type] || type;
};

/**
 * Cinsiyet etiketi
 */
export const getGenderLabel = (gender) => {
    const genders = {
        male: 'Erkek',
        female: 'Kadın',
        not_specified: 'Belirtilmemiş',
    };
    return genders[gender] || '-';
};

/**
 * Medeni durum etiketi
 */
export const getMaritalStatusLabel = (status) => {
    const statuses = {
        single: 'Bekâr',
        married: 'Evli',
        divorced: 'Boşanmış',
        widowed: 'Dul',
    };
    return statuses[status] || '-';
};

/**
 * Eğitim derecesi etiketi
 */
export const getDegreeLabel = (degree) => {
    const degrees = {
        high_school: 'Lise',
        associate: 'Ön Lisans',
        bachelor: 'Lisans',
        master: 'Yüksek Lisans',
        doctorate: 'Doktora',
    };
    return degrees[degree] || degree;
};

/**
 * Cinsiyet seçenekleri
 */
export const genderOptions = [
    { value: 'male', label: 'Erkek' },
    { value: 'female', label: 'Kadın' },
    { value: 'not_specified', label: 'Belirtilmemiş' },
];

/**
 * Medeni durum seçenekleri
 */
export const maritalStatusOptions = [
    { value: 'single', label: 'Bekâr' },
    { value: 'married', label: 'Evli' },
    { value: 'divorced', label: 'Boşanmış' },
    { value: 'widowed', label: 'Dul' },
];

/**
 * Çalışma tipi seçenekleri
 */
export const employmentTypeOptions = [
    { value: 'full_time', label: 'Tam Zamanlı' },
    { value: 'part_time', label: 'Yarı Zamanlı' },
    { value: 'remote', label: 'Uzaktan' },
    { value: 'hybrid', label: 'Hibrit' },
];

/**
 * Sözleşme tipi seçenekleri
 */
export const contractTypeOptions = [
    { value: 'permanent', label: 'Belirsiz Süreli' },
    { value: 'fixed_term', label: 'Belirli Süreli' },
    { value: 'internship', label: 'Staj' },
    { value: 'probation', label: 'Deneme Süreli' },
];

/**
 * Eğitim derecesi seçenekleri
 */
export const degreeOptions = [
    { value: 'high_school', label: 'Lise' },
    { value: 'associate', label: 'Ön Lisans' },
    { value: 'bachelor', label: 'Lisans' },
    { value: 'master', label: 'Yüksek Lisans' },
    { value: 'doctorate', label: 'Doktora' },
];

/**
 * Durum filtre seçenekleri
 */
export const statusFilterOptions = [
    { value: 'active', label: 'Aktif' },
    { value: 'terminated', label: 'Çıkan' },
];