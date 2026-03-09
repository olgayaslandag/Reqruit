import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function Form({ form }) {
    const { props } = usePage();
    const success = props?.success;
    
    const { data, setData, post, processing, errors } = useForm({});

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Add labels to data
        const labels = {};
        form.fields.forEach(field => {
            labels[field.name] = field.label;
        });
        setData('labels', labels);
        
        post(`/forms/${form.slug}/submit`, {
            forceFormData: true,
        });
    };

    const renderField = (field) => {
        const commonProps = {
            name: field.name,
            required: field.required,
            className: 'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
        };

        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
            case 'date':
                return (
                    <input
                        type={field.type}
                        {...commonProps}
                        onChange={(e) => setData(field.name, e.target.value)}
                        value={data[field.name] || ''}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={4}
                        onChange={(e) => setData(field.name, e.target.value)}
                        value={data[field.name] || ''}
                    />
                );

            case 'select':
                return (
                    <select
                        {...commonProps}
                        onChange={(e) => setData(field.name, e.target.value)}
                        value={data[field.name] || ''}
                    >
                        <option value="">Seçiniz</option>
                        {field.options?.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option, i) => (
                            <label key={i} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    value={option}
                                    onChange={(e) => {
                                        const current = data[field.name] || [];
                                        if (e.target.checked) {
                                            setData(field.name, [...current, option]);
                                        } else {
                                            setData(field.name, current.filter(v => v !== option));
                                        }
                                    }}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option, i) => (
                            <label key={i} className="flex items-center">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={option}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300"
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            {...commonProps}
                            accept={field.options ? field.options.map(o => {
                                if (o === 'pdf') return '.pdf';
                                if (o === 'doc') return '.doc';
                                if (o === 'docx') return '.docx';
                                if (o === 'jpg' || o === 'jpeg') return '.jpg,.jpeg';
                                if (o === 'png') return '.png';
                                return '';
                            }).filter(Boolean).join(',') : undefined}
                            onChange={(e) => setData(field.name, e.target.files[0])}
                        />
                        {data[field.name] && (
                            <p className="mt-1 text-sm text-green-600">
                                Seçilen: {data[field.name].name}
                            </p>
                        )}
                        {field.options && field.options.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                                İzin verilen: {field.options.join(', ')}
                            </p>
                        )}
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        {...commonProps}
                        onChange={(e) => setData(field.name, e.target.value)}
                        value={data[field.name] || ''}
                    />
                );
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Başvurunuz Alındı!</h2>
                    <p className="text-gray-600 mb-4">
                        Başvurunuz başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                    </p>
                    {success.reference_no && (
                        <div className="bg-gray-100 rounded p-3">
                            <p className="text-sm text-gray-500">Referans Numaranız:</p>
                            <p className="text-lg font-mono font-bold">{success.reference_no}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.name}</h1>
                    {form.description && (
                        <p className="text-gray-600 mb-8">{form.description}</p>
                    )}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {form.fields.map((field, index) => (
                            <div key={index} className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {renderField(field)}
                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
