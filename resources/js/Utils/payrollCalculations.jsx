/**
 * Bordro hesaplama yardımcı fonksiyonları
 * Türk mevzuatına uygun SGK ve vergi hesaplamaları
 */

// 2026 yılı SGK parametreleri (güncellenmeli)
const SGK_PARAMS = {
    // SGK İşçi Payı Oranları
    employee: {
        // 5510 sayılı Kanun - İşçi payı
        ssk: 0.14,        // İşsizlik sigortası %14 (tam gün çalışan için)
        health: 0.075,   // Genel sağlık sigortası %7.5
        total: 0.215,     // Toplam işçi payı %21.5
    },
    // SGK İşveren Payı Oranları
    employer: {
        // 5510 sayılı Kanun - İşveren payı
        ssk: 0.155,      // İşsizlik sigortası %15.5
        health: 0.075,   // Genel sağlık sigortası %7.5
        total: 0.23,     // Toplam işveren payı %23
    },
    // İşsizlik Sigortası
    unemployment: {
        employee: 0.01,  // İşçi %1
        employer: 0.02,  // İşveren %2
    },
    // Asgari ücret (2026 - aylık brüt)
    minimumWage: 42426.50, // Güncellenmeli
    // SGK tavan ve taban
    sskCeiling: 318924.08, // SGK tavan (güncellenmeli)
    sskFloor: 42426.50,    // SGK taban (asgari ücret)
};

// Gelir vergisi oranları 2026 (güncellenmeli)
const TAX_RATES = [
    { min: 0, max: 70000, rate: 0.15 },
    { min: 70000, max: 150000, rate: 0.20 },
    { min: 150000, max: 370000, rate: 0.27 },
    { min: 370000, max: 1900000, rate: 0.35 },
    { min: 1900000, max: Infinity, rate: 0.45 },
];

// Asgari geçim indirimi oranları
const MINIMUM_LIVING_ALLOWANCE = {
    single: 1603.97,      // Bekar
    married: 1924.76,    // Evli eşi çalışmayan
    marriedSpouseWorking: 1603.97, // Evli eşi çalışan
    child1: 240.60,      // 1. çocuk
    child2: 360.89,      // 2. çocuk
    child3: 541.34,      // 3. çocuk
};

/**
 * Brüt maaştan SGK işçi payı hesapla
 * @param {number} grossSalary - Brüt maaş
 * @returns {object} SGK kesintileri
 */
export const calculateSSKEmployee = (grossSalary) => {
    const sgkBase = Math.max(
        Math.min(grossSalary, SGK_PARAMS.sskCeiling),
        SGK_PARAMS.sskFloor
    );
    
    const sskDeduction = sgkBase * SGK_PARAMS.employee.ssk;
    const healthDeduction = sgkBase * SGK_PARAMS.employee.health;
    const unemploymentDeduction = sgkBase * SGK_PARAMS.unemployment.employee;
    
    return {
        base: sgkBase,
        ssk: sskDeduction,
        health: healthDeduction,
        unemployment: unemploymentDeduction,
        total: sskDeduction + healthDeduction + unemploymentDeduction,
    };
};

/**
 * Brüt maaştan SGK işveren payı hesapla
 * @param {number} grossSalary - Brüt maaş
 * @returns {object} SGK işveren payı
 */
export const calculateSSKEmployer = (grossSalary) => {
    const sgkBase = Math.max(
        Math.min(grossSalary, SGK_PARAMS.sskCeiling),
        SGK_PARAMS.sskFloor
    );
    
    const sskContribution = sgkBase * SGK_PARAMS.employer.ssk;
    const healthContribution = sgkBase * SGK_PARAMS.employer.health;
    const unemploymentContribution = sgkBase * SGK_PARAMS.unemployment.employer;
    
    return {
        base: sgkBase,
        ssk: sskContribution,
        health: healthContribution,
        unemployment: unemploymentContribution,
        total: sskContribution + healthContribution + unemploymentContribution,
    };
};

/**
 * Gelir vergisi hesapla (yıllık)
 * @param {number} annualGross - Yıllık brüt gelir
 * @param {number} deductions - Toplam kesintiler (SGK, bireysel emeklilik vb.)
 * @returns {object} Vergi hesaplama sonucu
 */
export const calculateIncomeTax = (annualGross, deductions = 0) => {
    const taxableIncome = annualGross - deductions;
    
    if (taxableIncome <= 0) {
        return {
            taxableIncome: 0,
            totalTax: 0,
            effectiveRate: 0,
            breakdown: [],
        };
    }
    
    let remainingIncome = taxableIncome;
    let totalTax = 0;
    const breakdown = [];
    
    for (const bracket of TAX_RATES) {
        if (remainingIncome <= 0) break;
        
        const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
        const taxInBracket = taxableInBracket * bracket.rate;
        
        if (taxableInBracket > 0) {
            breakdown.push({
                min: bracket.min,
                max: bracket.max === Infinity ? 'Sonsuz' : bracket.max,
                rate: bracket.rate * 100,
                taxable: taxableInBracket,
                tax: taxInBracket,
            });
        }
        
        totalTax += taxInBracket;
        remainingIncome -= taxableInBracket;
    }
    
    return {
        taxableIncome,
        totalTax,
        effectiveRate: (totalTax / taxableIncome) * 100,
        breakdown,
    };
};

/**
 * Aylık gelir vergisi hesapla
 * @param {number} monthlyGross - Aylık brüt maaş
 * @param {number} sskDeduction - SGK kesintisi
 * @param {string} maritalStatus - Medeni durum (single, married, married_spouse_working)
 * @param {number} childrenCount - Çocuk sayısı
 * @returns {object} Aylık vergi hesaplama sonucu
 */
export const calculateMonthlyTax = (monthlyGross, sskDeduction, maritalStatus = 'single', childrenCount = 0) => {
    // Yıllık hesaplama için 12 ile çarp
    const annualGross = monthlyGross * 12;
    const annualSSK = sskDeduction * 12;
    
    // Asgari geçim indirimi hesapla
    let agi = MINIMUM_LIVING_ALLOWANCE.single;
    if (maritalStatus === 'married') {
        agi = MINIMUM_LIVING_ALLOWANCE.married;
    } else if (maritalStatus === 'married_spouse_working') {
        agi = MINIMUM_LIVING_ALLOWANCE.marriedSpouseWorking;
    }
    
    // Çocuk artışı
    if (childrenCount >= 1) agi += MINIMUM_LIVING_ALLOWANCE.child1;
    if (childrenCount >= 2) agi += MINIMUM_LIVING_ALLOWANCE.child2;
    if (childrenCount >= 3) agi += MINIMUM_LIVING_ALLOWANCE.child3;
    
    // Vergi hesapla
    const taxResult = calculateIncomeTax(annualGross, annualSSK);
    
    // AGI düşüldükten sonra vergi
    const taxableWithAGI = Math.max(0, taxResult.taxableIncome - agi);
    
    // Aylık vergi (yıllık / 12)
    const monthlyTax = (taxResult.totalTax - (Math.min(agi, taxResult.totalTax))) / 12;
    
    return {
        monthlyTax: Math.max(0, monthlyTax),
        annualTax: taxResult.totalTax,
        taxableIncome: taxResult.taxableIncome,
        agi: agi / 12,
        effectiveRate: taxResult.effectiveRate,
    };
};

/**
 * Net maaş hesapla
 * @param {number} grossSalary - Brüt maaş
 * @param {object} options - Ek parametreler
 * @returns {object} Bordro özeti
 */
export const calculateNetSalary = (grossSalary, options = {}) => {
    const {
        maritalStatus = 'single',
        childrenCount = 0,
        mealAllowance = 0,
        transportAllowance = 0,
        housingAllowance = 0,
        otherAllowances = 0,
        otherDeductions = 0,
    } = options;
    
    // Toplam brüt gelir (ek ödemeler dahil)
    const totalGross = grossSalary + mealAllowance + transportAllowance + housingAllowance + otherAllowances;
    
    // SGK işçi payı
    const sskEmployee = calculateSSKEmployee(totalGross);
    
    // Gelir vergisi
    const incomeTax = calculateMonthlyTax(
        totalGross,
        sskEmployee.total,
        maritalStatus,
        childrenCount
    );
    
    // Kesintiler toplamı
    const totalDeductions = sskEmployee.total + incomeTax.monthlyTax + otherDeductions;
    
    // Net maaş
    const netSalary = totalGross - totalDeductions;
    
    return {
        gross: grossSalary,
        allowances: {
            meal: mealAllowance,
            transport: transportAllowance,
            housing: housingAllowance,
            other: otherAllowances,
            total: mealAllowance + transportAllowance + housingAllowance + otherAllowances,
        },
        deductions: {
            ssk: sskEmployee.total,
            tax: incomeTax.monthlyTax,
            other: otherDeductions,
            total: totalDeductions,
        },
        net: netSalary,
        employerCost: grossSalary + calculateSSKEmployer(totalGross).total,
        sgk: sskEmployee,
        tax: incomeTax,
    };
};

/**
 * Bordro dönemi için çalışan bordrosu hesapla
 * @param {object} employee - Çalışan bilgileri
 * @param {object} period - Dönem bilgileri
 * @returns {object} Hesaplanmış bordro
 */
export const calculatePayroll = (employee, period) => {
    const {
        base_salary = 0,
        meal_allowance = 0,
        transport_allowance = 0,
        housing_allowance = 0,
        other_allowances = 0,
        work_days = 30,
        overtime_hours = 0,
        overtime_rate = 1.5,
    } = employee;
    
    // Mesai hesaplaması
    const overtimePayment = (base_salary / 225) * overtime_hours * overtime_rate;
    
    // Günlük maaş hesabı
    const dailySalary = base_salary / 30;
    const actualSalary = dailySalary * work_days;
    
    // Net maaş hesapla
    const netCalculation = calculateNetSalary(actualSalary, {
        maritalStatus: employee.marital_status || 'single',
        childrenCount: employee.children_count || 0,
        mealAllowance: meal_allowance,
        transportAllowance: transport_allowance,
        housingAllowance: housing_allowance,
        otherAllowances: other_allowances + overtimePayment,
    });
    
    return {
        period: period.id,
        employee: employee.id,
        workDays: work_days,
        overtime: {
            hours: overtime_hours,
            rate: overtime_rate,
            payment: overtimePayment,
        },
        ...netCalculation,
    };
};

/**
 * AGI (Asgari Geçim İndirimi) hesapla
 * @param {string} maritalStatus - Medeni durum
 * @param {number} childrenCount - Çocuk sayısı
 * @returns {number} Aylık AGI
 */
export const calculateAGI = (maritalStatus, childrenCount) => {
    let agi = MINIMUM_LIVING_ALLOWANCE.single;
    
    if (maritalStatus === 'married') {
        agi = MINIMUM_LIVING_ALLOWANCE.married;
    } else if (maritalStatus === 'married_spouse_working') {
        agi = MINIMUM_LIVING_ALLOWANCE.marriedSpouseWorking;
    }
    
    if (childrenCount >= 1) agi += MINIMUM_LIVING_ALLOWANCE.child1;
    if (childrenCount >= 2) agi += MINIMUM_LIVING_ALLOWANCE.child2;
    if (childrenCount >= 3) agi += MINIMUM_LIVING_ALLOWANCE.child3;
    
    return agi;
};

/**
 * SGK parametrelerini getir
 * @returns {object} SGK parametreleri
 */
export const getSGKParams = () => SGK_PARAMS;

/**
 * Vergi oranlarını getir
 * @returns {array} Vergi oranları
 */
export const getTaxRates = () => TAX_RATES;
