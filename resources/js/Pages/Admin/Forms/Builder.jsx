import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useFlashWithToast } from '@/Hooks/useFlash';

/**
 * Recursively builds a flat list from hierarchical departments with indentation
 * @param {Array} departments Recursive department list
 * @param {number} level Current nesting level
 * @returns {Array} Flattened list with level indicators
 */
function flattenHierarchicalDepartments(departments, level = 0) {
    let result = [];
    
    departments.forEach(dept => {
        result.push({
            ...dept,
            level: level
        });
        
        if (dept.children && dept.children.length > 0) {
            result.push(...flattenHierarchicalDepartments(dept.children, level + 1));
        }
    });
    
    return result;
}

const FIELD_TYPES = [
    { value: 'text', label: 'Metin' },
    { value: 'email', label: 'E-posta' },
    { value: 'tel', label: 'Telefon' },
    { value: 'number', label: 'Sayı' },
    { value: 'date', label: 'Tarih' },
    { value: 'textarea', label: 'Metin Alanı' },
    { value: 'select', label: 'Açılır Liste' },
    { value: 'checkbox', label: 'Onay Kutusu' },
    { value: 'radio', label: 'Radyo Düğmesi' },
    { value: 'file', label: 'Dosya Yükleme' },
];

export default function Builder({ departments, form }) {
    const flash = useFlashWithToast();

    const { data, setData, post, put } = useForm({
        name: form?.name || '',
        department_id: form?.department_id || '',
        description: form?.description || '',
        notification_emails: Array.isArray(form?.notification_emails) ? form.notification_emails.filter(email => email) : [],
        fields: (form?.fields?.length ? form.fields.map(field => ({
            ...field,
            options: Array.isArray(field.options) ? field.options : []
        })) : [
            { name: 'name', label: 'Ad Soyad', type: 'text', required: true, options: [] },
            { name: 'email', label: 'E-posta', type: 'email', required: true, options: [] },
        ]),
    });
    
    // Build flattened hierarchical list from nested data structure
    const hierarchicalDepartments = flattenHierarchicalDepartments(departments || []);

    const [draggedIndex, setDraggedIndex] = useState(null);

    const generateUniqueName = (baseName, excludeIndex = -1) => {
        const existingNames = data.fields
            .map((f, i) => i !== excludeIndex ? f.name : null)
            .filter(Boolean);

        let name = baseName;
        let counter = 1;
        while (existingNames.includes(name)) {
            name = `${baseName}_${counter}`;
            counter++;
        }
        return name;
    };

    const addField = (type = 'default') => {
        if (type === 'name') {
            const name = generateUniqueName('name');
            setData('fields', [...data.fields, {
                name,
                label: 'Ad Soyad',
                type: 'text',
                required: true,
                options: [],
            }]);
            return;
        }
        if (type === 'email') {
            const name = generateUniqueName('email');
            setData('fields', [...data.fields, {
                name,
                label: 'E-posta',
                type: 'email',
                required: true,
                options: [],
            }]);
            return;
        }

        const newField = {
            label: 'Yeni Alan',
            name: '',
            type: 'text',
            required: false,
            options: [],
        };
        setData('fields', [...data.fields, newField]);
    };

    const updateField = (index, key, value) => {
        const newFields = [...data.fields];

        if (key === 'label' && !newFields[index].name) {
            newFields[index].name = generateUniqueName(newFields[index].label.toLowerCase().replace(/\s+/g, '_'), index);
        }

        if (key === 'name') {
            const uniqueName = generateUniqueName(value, index);
            newFields[index].name = uniqueName;
        } else {
            newFields[index][key] = value;
        }

        setData('fields', newFields);
    };

    const removeField = (index) => {
        const field = data.fields[index];
        if (field.name === 'name' || field.name === 'email') {
            return;
        }
        const newFields = data.fields.filter((_, i) => i !== index);
        setData('fields', newFields);
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newFields = [...data.fields];
        const draggedField = newFields[draggedIndex];
        newFields.splice(draggedIndex, 1);
        newFields.splice(index, 0, draggedField);

        setData('fields', newFields);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleOptionChange = (fieldIndex, optionIndex, value) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].options = [...(newFields[fieldIndex].options || [])];
        newFields[fieldIndex].options[optionIndex] = value;
        setData('fields', newFields);
    };

    const addOption = (fieldIndex) => {
        const newFields = [...data.fields];
        if (!newFields[fieldIndex].options) {
            newFields[fieldIndex].options = [];
        }
        newFields[fieldIndex].options.push('Yeni Seçenek');
        setData('fields', newFields);
    };

    const removeOption = (fieldIndex, optionIndex) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
        setData('fields', newFields);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanedNotificationEmails = (data.notification_emails || []).filter(email => email.trim() !== '');

        const formData = {
            ...data,
            notification_emails: cleanedNotificationEmails
        };

        if (form?.id) {
            put(`/admin/forms/${form.id}`, formData);
        } else {
            post('/admin/forms', formData);
        }
    };

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: form ? 'Form Düzenle' : 'Yeni Form',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'Formlar', url: route('admin.forms.index') },
                    { label: form ? 'Düzenle' : 'Oluştur', url: '#' },
                ],
            }}
        >
            <Head title={form ? 'Form Düzenle' : 'Yeni Form'} />

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="mb-0">Form Ayarları</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Form Adı</label>
                                    <input className="form-control" type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Departman</label>
                                    <select className="form-select" value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Seçiniz</option>
                                        {hierarchicalDepartments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {'└'.repeat(dept.level) + ' ' + dept.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Açıklama</label>
                                    <textarea className="form-control" value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Bildirim E-postaları</label>
                                    <small className="text-muted d-block mb-2">Bu formdan başvuru geldiğinde bildirim gönderilecek e-postalar</small>
                                    {(data.notification_emails || []).map((email, idx) => (
                                        <div key={`${idx}-${email || 'empty'}`} className="d-flex gap-2 mb-2">
                                            <input className="form-control" type="email"
                                                value={email || ''}
                                                onChange={(e) => {
                                                    const newEmails = [...(data.notification_emails || [])];
                                                    newEmails[idx] = e.target.value;
                                                    setData('notification_emails', newEmails);
                                                }}
                                                placeholder="email@example.com"
                                            />
                                            {(data.notification_emails || []).length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newEmails = (data.notification_emails || []).filter((_, i) => i !== idx);
                                                        setData('notification_emails', newEmails);
                                                    }}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    <i className="ti ti-x"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setData('notification_emails', [...(data.notification_emails || []), ''])}
                                        className="btn btn-link btn-sm p-0"
                                    >
                                        + E-posta ekle
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    {form ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Form Alanları</h5>
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => addField('name')}
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        + Ad Soyad
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addField('email')}
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        + E-posta
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addField('default')}
                                        className="btn btn-success btn-sm"
                                    >
                                        + Alan Ekle
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                {data.fields.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                    {data.fields.map((field, index) => (
                                        <div
                                            key={field.name || `field-${index}`}
                                                draggable
                                                onDragStart={() => handleDragStart(index)}
                                                onDragOver={(e) => handleDragOver(e, index)}
                                                onDragEnd={handleDragEnd}
                                                className={`border rounded p-3 ${draggedIndex === index ? 'opacity-50' : ''}`}
                                            >
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <span className="text-muted"><i className="ti ti-draggable"></i></span>
                                                    {field.name !== 'name' && field.name !== 'email' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeField(index)}
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            <i className="ti ti-trash"></i> Sil
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Etiket</label>
                                                        <input className="form-control" type="text"
                                                            value={field.label}
                                                            onChange={(e) => updateField(index, 'label', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Tür</label>
                                                        <select className="form-select" value={field.type}
                                                            onChange={(e) => updateField(index, 'type', e.target.value)}
                                                        >
                                                            {FIELD_TYPES.map((type) => (
                                                                <option key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => updateField(index, 'required', e.target.checked)}
                                                                className="form-check-input"
                                                                id={`required_${field.name || index}`}
                                                            />
                                                            <label className="form-check-label" htmlFor={`required_${field.name || index}`}>
                                                                Zorunlu
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {['select', 'checkbox', 'radio'].includes(field.type) && (
                                                    <div className="mt-3">
                                                        <label className="form-label">Seçenekler</label>
                                                        {(field.options || []).map((option, optionIndex) => (
                                                            <div key={`${optionIndex}-${option}`} className="d-flex gap-2 mb-2">
                                                                <input className="form-control" type="text"
                                                                    value={option}
                                                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeOption(index, optionIndex)}
                                                                    className="btn btn-outline-danger btn-sm"
                                                                >
                                                                    <i className="ti ti-trash"></i>
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => addOption(index)}
                                                            className="btn btn-link btn-sm p-0"
                                                        >
                                                            + Seçenek ekle
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-5">
                                        Henüz alan eklenmedi. "Alan Ekle" butonuna tıklayarak başlayabilirsiniz.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
