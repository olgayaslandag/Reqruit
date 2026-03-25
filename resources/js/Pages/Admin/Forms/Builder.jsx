import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

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
            // Generate unique name from the provided value
            const uniqueName = generateUniqueName(value, index);
            newFields[index].name = uniqueName;
            // Don't set newFields[index][key] = value here, because we want the unique name
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
        
        // Clean up notification emails - remove empty ones
        const cleanedNotificationEmails = (data.notification_emails || []).filter(email => email.trim() !== '');
        
        // Prepare the data to send
        const formData = {
            ...data,
            notification_emails: cleanedNotificationEmails
        };
        
        // Debug: Log the data being sent
        console.log('Form data being submitted:', formData);
        
        if (form?.id) {
            put(`/admin/forms/${form.id}`, formData, {
                onSuccess: () => router.visit('/admin/forms'),
                onError: (errors) => {
                    console.error('Form update errors:', errors);
                    // Optionally display errors to user
                    alert('Form güncellenirken hata oluştu. Konsolu kontrol edin.');
                },
            });
        } else {
            post('/admin/forms', formData, {
                onSuccess: () => router.visit('/admin/forms'),
                onError: (errors) => {
                    console.error('Form create errors:', errors);
                    // Optionally display errors to user
                    alert('Form oluşturulurken hata oluştu. Konsolu kontrol edin.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={form ? 'Form Düzenle' : 'Yeni Form'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-6">
                            {/* Form Settings */}
                            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-4">Form Ayarları</h2>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Form Adı</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
                                    <select
                                        value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Seçiniz</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        rows={3}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bildirim E-postaları</label>
                                    <p className="text-xs text-gray-500 mb-2">Bu formdan başvuru geldiğinde bildirim gönderilecek e-postalar (departmandan bağımsız)</p>
                                    {(data.notification_emails || []).map((email, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="email"
                                                value={email || ''}
                                                onChange={(e) => {
                                                    const newEmails = [...(data.notification_emails || [])];
                                                    newEmails[index] = e.target.value;
                                                    setData('notification_emails', newEmails);
                                                }}
                                                placeholder="email@example.com"
                                                className="flex-1 border-gray-300 rounded-md shadow-sm"
                                            />
                                            {(data.notification_emails || []).length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newEmails = (data.notification_emails || []).filter((_, i) => i !== index);
                                                        setData('notification_emails', newEmails);
                                                    }}
                                                    className="p-2 text-red-600 hover:text-red-900"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setData('notification_emails', [...(data.notification_emails || []), ''])}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                    >
                                        + E-posta ekle
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    {form ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>

                            {/* Fields */}
                            <div className="col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Form Alanları</h2>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => addField('name')}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                                        >
                                            + Ad Soyad
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => addField('email')}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                                        >
                                            + E-posta
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => addField('default')}
                                            className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                        >
                                            + Alan Ekle
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {data.fields.map((field, index) => (
                                        <div
                                            key={index}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className={`bg-white p-4 rounded-lg shadow cursor-move ${
                                                draggedIndex === index ? 'opacity-50' : ''
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-gray-400">☰</span>
                                                {field.name !== 'name' && field.name !== 'email' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeField(index)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Sil
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Etiket</label>
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => updateField(index, 'label', e.target.value)}
                                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => updateField(index, 'type', e.target.value)}
                                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                                    >
                                                        {FIELD_TYPES.map((type) => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => updateField(index, 'required', e.target.checked)}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                    />
                                                    <label className="ml-2 text-sm text-gray-700">Zorunlu</label>
                                                </div>
                                            </div>

                                            {/* Options for select/checkbox/radio */}
                                            {['select', 'checkbox', 'radio'].includes(field.type) && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seçenekler</label>
                                                    {(field.options || []).map((option, optionIndex) => (
                                                        <div key={optionIndex} className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                                className="flex-1 border-gray-300 rounded-md shadow-sm text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(index, optionIndex)}
                                                                className="text-red-600 hover:text-red-900 text-sm"
                                                            >
                                                                Sil
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addOption(index)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                    >
                                                        + Seçenek ekle
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {data.fields.length === 0 && (
                                        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                                            Henüz alan eklenmedi. "Alan Ekle" butonuna tıklayarak başlayabilirsiniz.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
