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
 * Çalışan oluşturma formu
 */
export default function Create({ departments = [], managers = [], errors: propErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        // Kimlik bilgileri
        identity_no: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',

        // İletişim bilgileri
        phone: '',
        email: '',
        address: '',

        // Acil durum bilgileri
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relation: '',

        // Kişisel bilgiler
        marital_status: '',
        children_count: 0,

        // İş bilgileri
        hire_date: '',
        position_title: '',
        department_id: '',
        employment_type: 'full_time',
        contract_type: 'permanent',
        manager_id: '',
    });

    // Eğitim bilgileri
    const [education, setEducation] = useState([
        { school_name: '', department: '', degree: '', graduation_year: '' }
    ]);

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
        post(route('admin.employees.store'), {
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
                        className="btn btn-link btn-sm text-muted p-0"
                        title="Geri"
                    >
                        <i className="bi bi-arrow-left fs-5"></i>
                    </Link>
                    <h5 className="fw-semibold mb-0">
                        Yeni Çalışan
                    </h5>
                </div>
            }
        >
            <Head title="Yeni Çalışan" />

            <div className="py-4">
                <div className="container-fluid px-0">
                    <form onSubmit={handleSubmit}>
                        {/* Kimlik Bilgileri */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold">Kimlik Bilgileri</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            TC Kimlik No <span className="text-danger">*</span>
                                        </label>
                                        <input className="form-control" type="text"
                                            value={data.identity_no}
                                            onChange={(e) => setData('identity_no', e.target.value)}
                                            required
                                            maxLength={11}
                                            minLength={11}
                                        />
                                        <InputError message={errors.identity_no} className="mt-1" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Ad <span className="text-danger">*</span>
                                        </label>
                                        <input className="form-control" type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-1" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Soyad <span className="text-danger">*</span>
                                        </label>
                                        <input className="form-control" type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-1" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Doğum Tarihi
                                        </label>
                                        <input className="form-control" type="date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Cinsiyet
                                        </label>
                                        <select className="form-select" value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {genderOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* İletişim Bilgileri */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold">İletişim Bilgileri</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Telefon
                                        </label>
                                        <input className="form-control" type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="0555 555 55 55"
                                        />
                                        <InputError message={errors.phone} className="mt-1" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            E-posta
                                        </label>
                                        <input className="form-control" type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            Adres
                                        </label>
                                        <textarea className="form-control" value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acil Durum Bilgileri */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold">Acil Durum Bilgileri</h5>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-medium">
                                            Kişi Adı
                                        </label>
                                        <input className="form-control" type="text"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-medium">
                                            Telefon
                                        </label>
                                        <input className="form-control" type="tel"
                                            value={data.emergency_contact_phone}
                                            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                            placeholder="0555 555 55 55"
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-medium">
                                            Yakınlık
                                        </label>
                                        <input className="form-control" type="text"
                                            value={data.emergency_contact_relation}
                                            onChange={(e) => setData('emergency_contact_relation', e.target.value)}
                                            placeholder="Anne, Baba, Kardeş vb."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kişisel Bilgiler */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold">Kişisel Bilgiler</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Medeni Durum
                                        </label>
                                        <select className="form-select" value={data.marital_status}
                                            onChange={(e) => setData('marital_status', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {maritalStatusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Çocuk Sayısı
                                        </label>
                                        <input className="form-control" type="number"
                                            value={data.children_count}
                                            onChange={(e) => setData('children_count', parseInt(e.target.value) || 0)}
                                            min={0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* İş Bilgileri */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold">İş Bilgileri</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            İşe Başlama Tarihi <span className="text-danger">*</span>
                                        </label>
                                        <input className="form-control" type="date"
                                            value={data.hire_date}
                                            onChange={(e) => setData('hire_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.hire_date} className="mt-1" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Pozisyon <span className="text-danger">*</span>
                                        </label>
                                        <input className="form-control" type="text"
                                            value={data.position_title}
                                            onChange={(e) => setData('position_title', e.target.value)}
                                            required
                                            placeholder="örn. Yazılım Mühendisi"
                                        />
                                        <InputError message={errors.position_title} className="mt-1" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Departman <span className="text-danger">*</span>
                                        </label>
                                        <select className="form-select" value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Seçiniz</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.title}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.department_id} className="mt-1" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Çalışma Tipi
                                        </label>
                                        <select className="form-select" value={data.employment_type}
                                            onChange={(e) => setData('employment_type', e.target.value)}
                                        >
                                            {employmentTypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Sözleşme Tipi
                                        </label>
                                        <select className="form-select" value={data.contract_type}
                                            onChange={(e) => setData('contract_type', e.target.value)}
                                        >
                                            {contractTypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">
                                            Yönetici
                                        </label>
                                        <select className="form-select" value={data.manager_id}
                                            onChange={(e) => setData('manager_id', e.target.value || '')}
                                        >
                                            <option value="">Yok</option>
                                            {managers.map((manager) => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.first_name} {manager.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Eğitim Bilgileri */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-semibold mb-0">Eğitim Bilgileri</h5>
                                    <button
                                        type="button"
                                        onClick={addEducation}
                                        className="btn btn-sm btn-link text-primary"
                                    >
                                        <i className="bi bi-plus-lg me-1"></i>
                                        Eğitim Ekle
                                    </button>
                                </div>
                                <div className="">
                                    {education.map((edu, index) => (
                                        <div key={index} className="card card-body bg-light mb-3">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">
                                                        Okul Adı
                                                    </label>
                                                    <input className="form-control" type="text"
                                                        value={edu.school_name}
                                                        onChange={(e) => updateEducation(index, 'school_name', e.target.value)}
                                                        placeholder="Üniversite adı"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">
                                                        Bölüm
                                                    </label>
                                                    <input className="form-control" type="text"
                                                        value={edu.department}
                                                        onChange={(e) => updateEducation(index, 'department', e.target.value)}
                                                        placeholder="Bölüm adı"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">
                                                        Derece
                                                    </label>
                                                    <select className="form-select" value={edu.degree}
                                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                    >
                                                        <option value="">Seçiniz</option>
                                                        {degreeOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-5">
                                                    <label className="form-label fw-medium">
                                                        Mezuniyet Yılı
                                                    </label>
                                                    <input className="form-control" type="number"
                                                        value={edu.graduation_year}
                                                        onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                                                        placeholder="2020"
                                                        min={1900}
                                                        max={new Date().getFullYear()}
                                                    />
                                                </div>
                                                <div className="col-md-1 d-flex align-items-end">
                                                    {education.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEducation(index)}
                                                            className="btn btn-link text-danger"
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="d-flex justify-content-end gap-2">
                            <Link
                                href={route('admin.employees.index')}
                                className="btn btn-secondary"
                            >
                                İptal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    'Kaydet'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}