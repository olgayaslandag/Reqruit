<?php

declare(strict_types=1);
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicSubmissionRequest extends FormRequest
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
        $form = $this->route('slug') ? \App\Models\Form::where('slug', $this->route('slug'))->first() : null;

        if (! $form) {
            return [];
        }

        $rules = [];

        foreach ($form->fields as $field) {
            $fieldRules = [];

            if ($field->required) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            switch ($field->type) {
                case 'email':
                    $fieldRules[] = 'email';
                    $fieldRules[] = 'max:255';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'tel':
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:20';
                    break;
                case 'date':
                    $fieldRules[] = 'date';
                    break;
                case 'file':
                    $fieldRules[] = 'file';
                    $fieldRules[] = 'max:10240'; // 10MB

                    if (! empty($field->options) && is_array($field->options)) {
                        $fieldRules[] = 'mimes:'.implode(',', $field->options);
                    }
                    break;
                default:
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:5000';
            }

            $rules[$field->name] = $fieldRules;
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'required' => 'Bu alan zorunludur.',
            'email' => 'Geçerli bir e-posta adresi giriniz.',
            'numeric' => 'Bu alan sayısal bir değer olmalıdır.',
            'date' => 'Geçerli bir tarih giriniz.',
            'file' => 'Geçerli bir dosya yükleyiniz.',
            'max' => 'Bu alan :max karakter/kilobyte değerini geçemez.',
            'mimes' => 'Desteklenmeyen dosya türü.',
        ];
    }
}
