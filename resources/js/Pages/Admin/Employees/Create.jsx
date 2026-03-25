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
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.employees.index')}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
                        title="Geri"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Yeni Çalışan
                    </h2>
                </div>
            }
        >
            <Head title="Yeni Çalışan" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        {/* Kimlik Bilgileri */}
                        <div className="bg-white rounded-lg shadow mb-6 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kimlik Bilgileri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        TC Kimlik No <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.identity_no}
                                        onChange={(e) => setData('identity_no', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        maxLength={11}
                                        minLength={11}
                                    />
                                    <InputError message={errors.identity_no} className="mt-1" />
                                </div>

                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Soyad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Doğum Tarihi
                                    </label>
                                    <input
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cinsiyet
                                    </label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

                        {/* İletişim Bilgileri */}
                        <div className="bg-white rounded-lg shadow mb-6 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">İletişim Bilgileri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0555 555 55 55"
                                    />
                                    <InputError message={errors.phone} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adres
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Acil Durum Bilgileri */}
                        <div className="bg-white rounded-lg shadow mb-6 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Acil Durum Bilgileri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kişi Adı
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.emergency_contact_phone}
                                        onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0555 555 55 55"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Yakınlık
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_relation}
                                        onChange={(e) => setData('emergency_contact_relation', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Anne, Baba, Kardeş vb."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kişisel Bilgiler */}
                        <div className="bg-white rounded-lg shadow mb-6 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kişisel Bilgiler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Medeni Durum
                                    </label>
                                    <select
                                        value={data.marital_status}
                                        onChange={(e) => setData('marital_status', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Seçiniz</option>
                                        {maritalStatusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Çocuk Sayısı
                                    </label>
                                    <input
                                        type="number"
                                        value={data.children_count}
                                        onChange={(e) => setData('children_count', parseInt(e.target.value) || 0)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        min={0}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* İş Bilgileri */}
                        <div className="bg-white rounded-lg shadow mb-6 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">İş Bilgileri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        İşe Başlama Tarihi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.hire_date}
                                        onChange={(e) => setData('hire_date', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    <InputError message={errors.hire_date} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pozisyon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.position_title}
                                        onChange={(e) => setData('position_title', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="örn. Yazılım Mühendisi"
                                    />
                                    <InputError message={errors.position_title} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Departman <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Çalışma Tipi
                                    </label>
                                    <select
                                        value={data.employment_type}
                                        onChange={(e) => setData('employment_type', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {employmentTypeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sözleşme Tipi
                                    </label>
                                    <select
                                        value={data.contract_type}
                                        onChange={(e) => setData('contract_type', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {contractTypeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Yönetici
                                    </label>
                                    <select
                                        value={data.manager_id}
                                        onChange={(e) => setData('manager_id', e.target.value || '')}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

                        {/* Eğitim Bilgileri */}
                        <div className="bg-white rounded-lg shadow mb-6 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Eğitim Bilgileri</h3>
                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                                >
                                    + Eğitim Ekle
                                </button>
                            </div>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Okul Adı
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.school_name}
                                                    onChange={(e) => updateEducation(index, 'school_name', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Üniversite adı"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Bölüm
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.department}
                                                    onChange={(e) => updateEducation(index, 'department', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Bölüm adı"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Derece
                                                </label>
                                                <select
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="">Seçiniz</option>
                                                    {degreeOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Mezuniyet Yılı
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={edu.graduation_year}
                                                        onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="2020"
                                                        min={1900}
                                                        max={new Date().getFullYear()}
                                                    />
                                                </div>
                                                {education.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(index)}
                                                        className="mt-6 p-1 text-red-600 hover:text-red-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('admin.employees.index')}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                İptal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}