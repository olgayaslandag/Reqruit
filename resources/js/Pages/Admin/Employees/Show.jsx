import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { confirmDelete, showSuccess, showError } from '@/Utils/sweetAlert';
import InputError from '@/Components/InputError';
import axios from 'axios';
import {
    getStatusBadgeLarge,
    getEmploymentTypeLabel,
    getContractTypeLabel,
    getGenderLabel,
    getMaritalStatusLabel,
    getDegreeLabel,
} from '@/Utils/employeeHelpers.jsx';

/**
 * Employee detay sayfası
 * GET /admin/employees/{id}
 */
export default function Show({ employee }) {
    const [activeTab, setActiveTab] = useState('info');
    const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('other');

    // Pozisyon ekleme formu
    const { data: positionData, setData: setPositionData, post: postPosition, processing: positionProcessing } = useForm({
        position_title: '',
        department_id: '',
        start_date: '',
        end_date: '',
        description: '',
    });

    // İşten çıkarma formu
    const { data: terminateData, setData: setTerminateData, post: postTerminate, processing: terminateProcessing } = useForm({
        termination_date: '',
        termination_reason: '',
    });

    // Belge yükleme
    const handleDocumentUpload = async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('document-file');
        const file = fileInput.files[0];

        if (!file) {
            showError('Lütfen bir dosya seçin.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', uploadType);

        try {
            const response = await axios.post(
                route('admin.employees.uploadDocument', employee.id),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.success) {
                showSuccess('Doküman başarıyla yüklendi.');
                setIsUploadModalOpen(false);
                fileInput.value = '';
                router.reload();
            }
        } catch (err) {
            showError(err.response?.data?.message || 'Doküman yüklenirken hata oluştu.');
        }
    };

    // Belge silme
    const handleDocumentDelete = (documentId) => {
        confirmDelete('Bu dokümanı silmek istediğinize emin misiniz?', async () => {
            try {
                const response = await axios.delete(
                    route('admin.employees.deleteDocument', { employee: employee.id, documentId })
                );
                if (response.data.success) {
                    showSuccess('Doküman başarıyla silindi.');
                    router.reload();
                }
            } catch (err) {
                showError(err.response?.data?.message || 'Doküman silinirken hata oluştu.');
            }
        });
    };

    // Pozisyon ekleme
    const handlePositionAdd = (e) => {
        e.preventDefault();
        postPosition(route('admin.employees.addPosition', employee.id));
    };

    // İşten çıkarma
    const handleTerminate = (e) => {
        e.preventDefault();
        postTerminate(route('admin.employees.terminate', employee.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-semibold text-dark">
                            {employee.first_name} {employee.last_name}
                        </h5>
                        <p className="fs-sm text-muted">
                            {employee.email} • {employee.phone}
                        </p>
                    </div>
                    
                    <button
                        onClick={() => handleDocumentDelete(123)} // sadece test
                        className="btn btn-danger btn-sm"
                    >
                        Sil
                    </button>
                </div>
            }
        >
            <Head title={`${employee.first_name} ${employee.last_name}`} />

            <div className="py-12">
                <div className="mw-100 mx-auto">
                    {/* Tabs */}
                    <div className="bg-white rounded-3 shadow-sm">
                        <div className="border-b border-secondary">
                            <nav className="d-flex -mb-px">
                                {[
                                    { id: 'info', label: 'Bilgi', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                    { id: 'education', label: 'Eğitim', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
                                    { id: 'certificates', label: 'Sertifikalar', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
                                    { id: 'documents', label: 'Belgeler', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                                    { id: 'positions', label: 'Pozisyon Geçmişi', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-1/5 py-4 px-1 text-center border-b-2 fw-medium fs-sm ${
                                            activeTab === tab.id
                                                ? 'border-indigo-500 text-primary'
                                                : 'border-transparent text-muted hover:text-dark hover:border-secondary'
                                        }`}
                                    >
                                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                        </svg>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-4">
                            {/* Info Tab */}
                            {activeTab === 'info' && (
                                <div>Bilgi içeriği burada</div>
                            )}
                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <div>Eğitim içeriği burada</div>
                            )}
                            {/* Certificates Tab */}
                            {activeTab === 'certificates' && (
                                <div>Sertifikalar içeriği burada</div>
                            )}
                            {/* Documents Tab */}
                            {activeTab === 'documents' && (
                                <div>Belgeler içeriği burada</div>
                            )}
                            {/* Positions (disabled) */}
                            {activeTab === 'positions' && (
                                <div>Bu modül temporarily pasif</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}