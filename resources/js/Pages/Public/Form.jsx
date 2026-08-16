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
            id: field.name,
            required: field.required,
            className: 'dd-input',
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
                    <div className="dd-checkbox-group">
                        {field.options?.map((option, i) => (
                            <label key={i} className="dd-checkbox-label">
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    value={option}
                                    className="dd-checkbox"
                                    onChange={(e) => {
                                        const current = data[field.name] || [];
                                        if (e.target.checked) {
                                            setData(field.name, [...current, option]);
                                        } else {
                                            setData(field.name, current.filter(v => v !== option));
                                        }
                                    }}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'radio':
                return (
                    <div className="dd-radio-group">
                        {field.options?.map((option, i) => (
                            <label key={i} className="dd-radio-label">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={option}
                                    className="dd-radio"
                                    onChange={(e) => setData(field.name, e.target.value)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <div className="dd-file-wrapper">
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
                            <p className="dd-file-selected">
                                Seçilen: {data[field.name].name}
                            </p>
                        )}
                        {field.options && field.options.length > 0 && (
                            <p className="dd-file-info">
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
            <div className="dd-success-wrapper">
                <div className="dd-success-icon">✓</div>
                <h5 className="text-success">Başvurunuz Alındı!</h5>
                <p className="dd-success-message">
                    Başvurunuz başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                </p>
                {success.reference_no && (
                    <div className="dd-reference">
                        <p className="dd-reference-label">Referans Numaranız:</p>
                        <p className="dd-reference-no">{success.reference_no}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="dd-form-wrapper">
            <div className="dd-form-container">
                <h1 className="dd-form-title">{form.name}</h1>
                {form.description && (
                    <p className="dd-form-description">{form.description}</p>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="dd-form">
                    {form.fields.map(field => (
                        <div key={field.name} className="dd-field">
                            <label
                                className="dd-label"
                                htmlFor={field.type === 'checkbox' || field.type === 'radio' ? undefined : field.name}
                            >
                                {field.label}
                                {field.required && <span className="dd-required">*</span>}
                            </label>
                            {renderField(field)}
                            {errors[field.name] && (
                                <p className="dd-error">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={processing}
                        className="dd-submit-btn"
                    >
                        {processing ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
}