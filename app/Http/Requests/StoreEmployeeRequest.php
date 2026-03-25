<?php

namespace App\Http\Requests;

use App\Enums\ContractTypeEnum;
use App\Enums\DegreeEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\MaritalStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Kimlik bilgileri
            'identity_no' => ['required', 'string', 'max:11', 'min:11', 'unique:employees,identity_no'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'birth_date' => ['required', 'date', 'before:today', 'after_or_equal:' . now()->subYears(65)->format('Y-m-d')],
            'gender' => ['required', Rule::enum(GenderEnum::class)],

            // İletişim bilgileri
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9\+\-\s]+$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],

            // Acil durum bilgileri
            'emergency_contact_name' => ['nullable', 'string', 'max:200'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9\+\-\s]+$/'],
            'emergency_contact_relation' => ['nullable', 'string', 'max:50'],

            // Kişisel bilgiler
            'marital_status' => ['nullable', Rule::enum(MaritalStatusEnum::class)],
            'children_count' => ['nullable', 'integer', 'min:0', 'max:20'],

            // İş bilgileri
            'hire_date' => ['required', 'date', 'before_or_equal:today'],
            'position_title' => ['required', 'string', 'max:200'],
            'department_id' => ['required', 'exists:departments,id'],
            'employment_type' => ['required', Rule::enum(EmploymentTypeEnum::class)],
            'contract_type' => ['required', Rule::enum(ContractTypeEnum::class)],
            'manager_id' => ['nullable', 'exists:employees,id', 'not_in:' . $this->id ?? 0],

            // Eğitim bilgileri (isteğe bağlı)
            'education' => ['nullable', 'array'],
            'education.*.school_name' => ['required_with:education', 'string', 'max:200'],
            'education.*.department' => ['nullable', 'string', 'max:200'],
            'education.*.degree' => ['required_with:education', Rule::enum(DegreeEnum::class)],
            'education.*.graduation_year' => ['nullable', 'integer', 'min:1950', 'max:' . now()->year],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Kimlik bilgileri
            'identity_no.required' => 'TC Kimlik No zorunludur.',
            'identity_no.unique' => 'Bu TC Kimlik numarası zaten kayıtlı.',
            'identity_no.min' => 'TC Kimlik No 11 karakter olmalıdır.',
            'first_name.required' => 'Ad zorunludur.',
            'last_name.required' => 'Soyad zorunludur.',
            'birth_date.required' => 'Doğum tarihi zorunludur.',
            'birth_date.before' => 'Geçerli bir doğum tarihi giriniz.',
            'gender.required' => 'Cinsiyet zorunludur.',

            // İletişim bilgileri
            'email.email' => 'Geçerli bir e-posta adresi giriniz.',
            'phone.regex' => 'Geçerli bir telefon numarası giriniz.',

            // İş bilgileri
            'hire_date.required' => 'İşe başlama tarihi zorunludur.',
            'position_title.required' => 'Pozisyon unvanı zorunludur.',
            'department_id.required' => 'Departman seçimi zorunludur.',
            'department_id.exists' => 'Seçilen departman geçersiz.',
            'employment_type.required' => 'Çalışma tipi zorunludur.',
            'contract_type.required' => 'Sözleşme tipi zorunludur.',
            'manager_id.exists' => 'Seçilen yönetici geçersiz.',
            'manager_id.not_in' => 'Kendinizi yönetici olarak seçemezsiniz.',

            // Eğitim
            'education.*.school_name.required_with' => 'Okul adı zorunludur.',
            'education.*.degree.required_with' => 'Eğitim derecesi zorunludur.',
            'education.*.graduation_year.min' => 'Geçerli bir mezuniyet yılı giriniz.',
        ];
    }
}