import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { useState } from 'react';
import {
    genderOptions,
    maritalStatusOptions,
    employmentTypeOptions,
    contractTypeOptions,
    degreeOptions,
} from '@/Utils/employeeHelpers.jsx';

/**
 * Çalışan düzenleme formu
 */
export default function Edit({ employee, departments = [], managers = [], errors: propErrors }) {
    const { data, setData, put, processing, errors } = useForm({
        // Kimlik bilgileri
        identity_no: employee.identity_no || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        birth_date: employee.birth_date || '',
        gender: employee.gender || '',

        // İletişim bilgileri
        phone: employee.phone || '',
        email: employee.email || '',
        address: employee.address || '',

        // Acil durum bilgileri
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        emergency_contact_relation: employee.emergency_contact_relation || '',

        // Kişisel bilgiler
        marital_status: employee.marital_status || '',
        children_count: employee.children_count || 0,

        // İş bilgileri
        hire_date: employee.hire_date || '',
        position_title: employee.position_title || '',
        department_id: employee.department_id || '',
        employment_type: employee.employment_type || 'full_time',
        contract_type: employee.contract_type || 'permanent',
        manager_id: employee.manager_id || '',
    });

    // Eğitim bilgileri (mevcut verilerle doldur)
    const [education, setEducation] = useState(
        employee.education?.length > 0
            ? employee.education.map(edu => ({
                school_name: edu.school_name || '',
                department: edu.department || '',
                degree: edu.degree || '',
                graduation_year: edu.graduation_year || '',
            }))
            : [{ school_name: '', department: '', degree: '', graduation_year: '' }]
    );

    const addEducation = () => {
        setEducation([...education, { school_name: '', department: '', degree: '', graduation_year: '' }]);
    };

    const removeEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const updateEducation = (index, field, value) => {
        const newEducation = [...education];
        newEducation[index][field] = value;
        setEducation(newEducation);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.employees.update', employee.id), {
            data: {
                ...data,
                education: education.filter(edu => edu.school_name && edu.degree),
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex align-items-center gap-3">
                    <Link
                        href={route('admin.employees.index')}
                        className="p-2 text-muted hover:text-dark hover:bg-light rounded"
                        title="Geri"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h5 className="fw-semibold">
                        Çalışan Düzenle
                    </h5>
                </div>
            }
        >
            <Head title={`Çalışan Düzenle: ${employee.first_name} ${employee.last_name}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    <form onSubmit={handleSubmit}>
                        {/* Kimlik Bilgileri */}
                        <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                            <h5 className="fw-semibold">Kimlik Bilgileri</h5>
                            <div className="d-grid d-grid-cols-1 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        TC Kimlik No <span className="text-danger">*</span>
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                        value={data.identity_no}
                                        onChange={(e) => setData('identity_no', e.target.value)}
                                        required
                                        maxLength={11}
                                        minLength={11}
                                    />
                                    <InputError message={errors.identity_no} className="mt-1" />
                                </div>

                                <div className="d-grid d-grid-cols-2 gap-3">
                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Ad <span className="text-danger">*</span>
                                        </label>
                                        <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-1" />
                                    </div>

                                    <div>
                                        <label className="d-block fs-sm fw-medium text-dark mb-1">
                                            Soyad <span className="text-danger">*</span>
                                        </label>
                                        <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Doğum Tarihi
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Cinsiyet
                                    </label>
                                    <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                    >
                                        <option value="">Seçiniz</option>
                                        {(genderOptions || []).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* İletişim Bilgileri */}
                        <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                            <h5 className="fw-semibold">İletişim Bilgileri</h5>
                            <div className="d-grid d-grid-cols-1 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Telefon
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="0555 555 55 55"
                                    />
                                    <InputError message={errors.phone} className="mt-1" />
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        E-posta
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                <div className="">
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Adres
                                    </label>
                                    <textarea className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Acil Durum Bilgileri */}
                        <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                            <h5 className="fw-semibold">Acil Durum Bilgileri</h5>
                            <div className="d-grid d-grid-cols-1 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Kişi Adı
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Telefon
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="tel"
                                        value={data.emergency_contact_phone}
                                        onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                        placeholder="0555 555 55 55"
                                    />
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Yakınlık
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                        value={data.emergency_contact_relation}
                                        onChange={(e) => setData('emergency_contact_relation', e.target.value)}
                                        placeholder="Anne, Baba, Kardeş vb."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kişisel Bilgiler */}
                        <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                            <h5 className="fw-semibold">Kişisel Bilgiler</h5>
                            <div className="d-grid d-grid-cols-1 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Medeni Durum
                                    </label>
                                    <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={data.marital_status}
                                        onChange={(e) => setData('marital_status', e.target.value)}
                                    >
                                        <option value="">Seçiniz</option>
                                        {(maritalStatusOptions || []).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Çocuk Sayısı
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="number"
                                        value={data.children_count}
                                        onChange={(e) => setData('children_count', parseInt(e.target.value) || 0)}
                                        min={0}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* İş Bilgileri */}
                        <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                            <h5 className="fw-semibold">İş Bilgileri</h5>
                            <div className="d-grid d-grid-cols-1 gap-3">
                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        İşe Başlama Tarihi <span className="text-danger">*</span>
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="date"
                                        value={data.hire_date}
                                        onChange={(e) => setData('hire_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.hire_date} className="mt-1" />
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Pozisyon <span className="text-danger">*</span>
                                    </label>
                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                        value={data.position_title}
                                        onChange={(e) => setData('position_title', e.target.value)}
                                        required
                                        placeholder="örn. Yazılım Mühendisi"
                                    />
                                    <InputError message={errors.position_title} className="mt-1" />
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Departman <span className="text-danger">*</span>
                                    </label>
                                    <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Seçiniz</option>
                                        {(departments || []).map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.department_id} className="mt-1" />
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Çalışma Tipi
                                    </label>
                                    <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={data.employment_type}
                                        onChange={(e) => setData('employment_type', e.target.value)}
                                    >
                                        {(employmentTypeOptions || []).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Sözleşme Tipi
                                    </label>
                                    <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={data.contract_type}
                                        onChange={(e) => setData('contract_type', e.target.value)}
                                    >
                                        {(contractTypeOptions || []).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                        Yönetici
                                    </label>
                                    <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={data.manager_id}
                                        onChange={(e) => setData('manager_id', e.target.value || '')}
                                    >
                                        <option value="">Yok</option>
                                        {(managers || []).map((manager) => (
                                            <option key={manager.id} value={manager.id}>
                                                {manager.first_name} {manager.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Eğitim Bilgileri */}
                        <div className="bg-white rounded-3 shadow-sm mb-5 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold">Eğitim Bilgileri</h5>
                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="text-primary hover:text-indigo-900 fs-sm"
                                >
                                    + Eğitim Ekle
                                </button>
                            </div>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="p-4 table-light rounded">
                                        <div className="d-grid d-grid-cols-1 gap-3">
                                            <div>
                                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                                    Okul Adı
                                                </label>
                                                <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                                    value={edu.school_name}
                                                    onChange={(e) => updateEducation(index, 'school_name', e.target.value)}
                                                    placeholder="Üniversite adı"
                                                />
                                            </div>
                                            <div>
                                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                                    Bölüm
                                                </label>
                                                <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="text"
                                                    value={edu.department}
                                                    onChange={(e) => updateEducation(index, 'department', e.target.value)}
                                                    placeholder="Bölüm adı"
                                                />
                                            </div>
                                            <div>
                                                <label className="d-block fs-sm fw-medium text-dark mb-1">
                                                    Derece
                                                </label>
                                                <select className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" value={edu.degree}
                                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                >
                                                    <option value="">Seçiniz</option>
                                                    {(degreeOptions || []).map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="d-flex align-items-start gap-2">
                                                <div className="d-flex-1">
                                                    <label className="d-block fs-sm fw-medium text-dark mb-1">
                                                        Mezuniyet Yılı
                                                    </label>
                                                    <input className="form-control w-100 rounded border-secondary shadow-sm-sm focus: focus:border-indigo-500" type="number"
                                                        value={edu.graduation_year}
                                                        onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                                                        placeholder="2020"
                                                        min={1900}
                                                        max={new Date().getFullYear()}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEducation(index)}
                                                    className="mt-6 p-1 text-danger hover:text-red-900"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="d-flex justify-content-end">
                            <Link
                                href={route('admin.employees.index')}
                                className="px-4 py-2 bg-gray-300 text-dark rounded hover:bg-gray-400"
                            >
                                İptal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary btn-sm disabled:opacity-50"
                            >
                                {processing ? 'Güncelleniyor...' : 'Güncelle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}