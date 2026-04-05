import { useState } from 'react';
import { router, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess, showError } from '@/Utils/sweetAlert';

import {
    getStatusBadgeLarge,
    getEmploymentTypeLabel,
    getContractTypeLabel,
    getGenderLabel,
    getMaritalStatusLabel,
    getDegreeLabel,
} from '@/Utils/employeeHelpers.jsx';

import {
    getAttendanceStatusBadge,
    formatTime,
    formatDate,
    calculateWorkingHours,
    getOvertimeHours,
    attendanceStatusOptions,
    attendanceTypeOptions,
} from '@/Utils/attendanceHelpers.jsx';

import { getStatusBadgeClass } from '@/Utils/commonUtils.jsx';
import InputError from '@/Components/InputError';

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
    const { data: positionData, setData: setPositionData, post: postPosition, processing: positionProcessing, errors: positionErrors } = useForm({
        position_title: '',
        department_id: '',
        start_date: '',
        end_date: '',
        description: '',
    });

    // İşten çıkarma formu
    const { data: terminateData, setData: setTerminateData, post: postTerminate, processing: terminateProcessing, errors: terminateErrors } = useForm({
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

        // Using Inertia's router.post for direct file upload
        router.post(
            route('admin.employees.uploadDocument', employee.id),
            { file: file, document_type: uploadType },
            {
                forceFormData: true, // Force Inertia to use FormData for file uploads
                onSuccess: () => {
                    showSuccess('Doküman başarıyla yüklendi.');
                    setIsUploadModalOpen(false);
                    fileInput.value = '';
                },
                onError: (errors) => {
                    const errorMessage = errors.file || Object.values(errors).flat().join(', ') || 'Doküman yüklenirken hata oluştu.';
                    showError(errorMessage);
                }
            }
        );
    };

    // Belge silme
    const handleDocumentDelete = (documentId) => {
        confirmDelete('Bu dokümanı silmek istediğinize emin misiniz?', async () => {
            try {
                router.delete(
                    route('admin.employees.deleteDocument', { employee: employee.id, documentId }),
                    {
                        onSuccess: () => {
                            showSuccess('Doküman başarıyla silindi.');
                        },
                        onError: (errors) => {
                            const errorMessage = Object.values(errors).flat().join(', ') || 'Doküman silinirken hata oluştu.';
                            showError(errorMessage);
                        }
                    }
                );
            } catch (err) {
                showError('Doküman silinirken hata oluştu.');
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

    // Info Tab Content
    const renderInfoTab = () => (
        <div className="row">
            <div className="col-md-6">
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h6 className="mb-0 fw-bold"><i className="ti ti-user me-2"></i>Kişisel Bilgiler</h6>
                    </div>
                    <div className="card-body">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td width="30%" className="text-muted">Ad Soyad:</td>
                                    <td><strong>{employee.first_name} {employee.last_name}</strong></td>
                                </tr>
                                <tr>
                                    <td className="text-muted">TC Kimlik No:</td>
                                    <td>{employee.identity_no || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Doğum Tarihi:</td>
                                    <td>{employee.birth_date ? formatDate(employee.birth_date) : '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Cinsiyet:</td>
                                    <td>{getGenderLabel(employee.gender)}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Medeni Hâl:</td>
                                    <td>{getMaritalStatusLabel(employee.marital_status)}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Telefon:</td>
                                    <td>{employee.phone || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Email:</td>
                                    <td>{employee.email || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="col-md-6">
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h6 className="mb-0 fw-bold"><i className="ti ti-home me-2"></i>Adres Bilgileri</h6>
                    </div>
                    <div className="card-body">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td width="30%" className="text-muted">İkamet:</td>
                                    <td>{employee.residence_address || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">İkamet İlçe:</td>
                                    <td>{employee.residence_district || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">İkamet Şehir:</td>
                                    <td>{employee.residence_city || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Kurumsal:</td>
                                    <td>{employee.corporate_address || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Kurumsal İlçe:</td>
                                    <td>{employee.corporate_district || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Kurumsal Şehir:</td>
                                    <td>{employee.corporate_city || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="card">
                    <div className="card-header bg-light">
                        <h6 className="mb-0 fw-bold"><i className="ti ti-briefcase me-2"></i>İş Bilgileri</h6>
                    </div>
                    <div className="card-body">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td width="30%" className="text-muted">Pozisyon:</td>
                                    <td><strong>{employee.position_title || '-'}</strong></td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Departman:</td>
                                    <td>{employee.department?.title || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Çalışma Tipi:</td>
                                    <td>{getEmploymentTypeLabel(employee.employment_type)}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Sözleşme Türü:</td>
                                    <td>{getContractTypeLabel(employee.contract_type)}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">İşe Giriş:</td>
                                    <td>{employee.hire_date ? formatDate(employee.hire_date) : '-'}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Statü:</td>
                                    <td>{getStatusBadgeLarge(employee)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    // Documents Tab Content
    const renderDocumentsTab = () => (
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold"><i className="ti ti-files me-2"></i>Belgeler</h6>
                    <button
                        onClick={() => {
                            setUploadType('other');
                            setIsUploadModalOpen(true);
                        }}
                        className="btn btn-primary"
                    >
                        <i className="ti ti-upload me-1"></i>Belge Yükle
                    </button>
                </div>
                
                {employee.documents && employee.documents.length > 0 ? (
                    <div className="row">
                        {employee.documents.map(document => (
                            <div key={document.id} className="col-md-4 mb-3">
                                <div className="card border">
                                    <div className="card-body">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0">
                                                <div className="bg-light rounded p-2">
                                                    <i className="ti ti-file-text fs-3 text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1 fw-semibold">{document.name}</h6>
                                                <small className="text-muted">{document.type}</small><br/>
                                                <small className="text-muted">{formatDate(document.created_at)}</small>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <a 
                                                    href={`/storage/documents/${document.file_path}`} 
                                                    target="_blank" 
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Görüntüle"
                                                >
                                                    <i className="ti ti-eye"></i>
                                                </a>
                                                <button 
                                                    onClick={() => handleDocumentDelete(document.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Sil"
                                                >
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="ti ti-files fs-1 text-muted mb-2"></i>
                        <p className="text-muted">Herhangi bir belge gönderilmedi.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Education Tab Content
    const renderEducationTab = () => (
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold"><i className="ti ti-school me-2"></i>Eğitim Bilgileri</h6>
                </div>
                
                {employee.educations && employee.educations.length > 0 ? (
                    <div className="row">
                        {employee.educations.map(edu => (
                            <div key={edu.id} className="col-md-4 mb-3">
                                <div className="card border">
                                    <div className="card-body">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0">
                                                <div className="bg-light rounded p-2">
                                                    <i className="ti ti-building-school fs-3 text-info"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1 fw-semibold">{edu.school_name}</h6>
                                                <small className="text-muted">{getDegreeLabel(edu.degree)} • {edu.field_of_study}</small><br/>
                                                <small className="text-muted">{edu.start_year} - {edu.end_year}</small>
                                            </div>
                                        </div>
                                        {edu.description && (
                                            <p className="mt-2 mb-0 text-muted small">{edu.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="ti ti-school fs-1 text-muted mb-2"></i>
                        <p className="text-muted">Herhangi bir eğitim bilgisi bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Certificates Tab Content
    const renderCertificatesTab = () => (
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold"><i className="ti ti-award me-2"></i>Sertifikalar</h6>
                </div>
                
                {employee.certifications && employee.certifications.length > 0 ? (
                    <div className="row">
                        {employee.certifications.map(cert => (
                            <div key={cert.id} className="col-md-4 mb-3">
                                <div className="card border">
                                    <div className="card-body">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0">
                                                <div className="bg-light rounded p-2">
                                                    <i className="ti ti-badge fs-3 text-success"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1 fw-semibold">{cert.name}</h6>
                                                <small className="text-muted">{cert.issuing_organization}</small><br/>
                                                <small className="text-muted">{formatDate(cert.issued_date)} • Belge No: {cert.certificate_number || '-'}</small>
                                            </div>
                                        </div>
                                        {cert.valid_until && (
                                            <div className="mt-2">
                                                <small className={`badge ${new Date(cert.valid_until) < new Date() ? 'bg-danger' : 'bg-success'}`}>
                                                    Son Geçerlilik: {formatDate(cert.valid_until)}
                                                    {new Date(cert.valid_until) < new Date() && ' • Süresi Bitmiş'}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="ti ti-award fs-1 text-muted mb-2"></i>
                        <p className="text-muted">Herhangi bir sertifika bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Attendances Tab Content
    const renderAttendancesTab = () => (
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold"><i className="ti ti-clock me-2"></i>Devamsızlık Kayıtları</h6>
                </div>
                
                {employee.attendances && employee.attendances.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Tarih</th>
                                    <th>Giriş</th>
                                    <th>Çıkış</th>
                                    <th>Toplam Saat</th>
                                    <th>Fazla Mesai</th>
                                    <th>Durum</th>
                                    <th>Tip</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.attendances.map(attendance => (
                                    <tr key={attendance.id}>
                                        <td>{formatDate(attendance.date)}</td>
                                        <td>{formatTime(attendance.clock_in)}</td>
                                        <td>{formatTime(attendance.clock_out)}</td>
                                        <td>{calculateWorkingHours(attendance.clock_in, attendance.clock_out)}</td>
                                        <td>{getOvertimeHours(attendance.clock_in, attendance.clock_out)}</td>
                                        <td>{getAttendanceStatusBadge(attendance.status, attendance.clock_in, attendance.clock_out)}</td>
                                        <td>{attendanceTypeOptions.find(opt => opt.value === attendance.type)?.label || 'Normal Devam'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="ti ti-clock fs-1 text-muted mb-2"></i>
                        <p className="text-muted">Henüz devamsızlık kaydı yok.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Leaves Tab Content
    const renderLeavesTab = () => (
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold"><i className="ti ti-calendar-event me-2"></i>İzin Kayıtları</h6>
                </div>
                
                {employee.leave_requests && employee.leave_requests.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Başlangıç</th>
                                    <th>Bitiş</th>
                                    <th>Yarım Gün</th>
                                    <th>Tür</th>
                                    <th>Açıklama</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.leave_requests.map(leave => (
                                    <tr key={leave.id}>
                                        <td>{formatDate(leave.start_date)}</td>
                                        <td>{formatDate(leave.end_date)}</td>
                                        <td>
                                            <span className={`badge ${leave.is_half_day ? 'bg-primary' : 'bg-light text-dark'}`}>
                                                {leave.is_half_day ? 'Evet' : 'Hayır'}
                                            </span>
                                        </td>
                                        <td>{leave.leave_type?.name || '-'}</td>
                                        <td>{leave.reason || '-'}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(leave.status, 'leave')}`}>
                                                {leave.status === 'pending' && 'Beklemede'}
                                                {leave.status === 'approved' && 'Onaylandı'}
                                                {leave.status === 'rejected' && 'Reddedildi'}
                                                {leave.status === 'cancelled' && 'İptal Edildi'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="ti ti-calendar-event fs-1 text-muted mb-2"></i>
                        <p className="text-muted">Henüz izin kaydı yok.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Advances Tab Content
    const renderAdvancesTab = () => (
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold"><i className="ti ti-receipt-tax me-2"></i>Avans Başvuruları</h6>
                </div>
                
                {employee.advances && employee.advances.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Tarih</th>
                                    <th>Tutar</th>
                                    <th>Tür</th>
                                    <th>Taksit</th>
                                    <th>Açıklama</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.advances.map(advance => (
                                    <tr key={advance.id}>
                                        <td>{formatDate(advance.request_date)}</td>
                                        <td><strong>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(parseFloat(advance.amount))}</strong></td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {advance.type === 'salary' && 'Maaş Avansı'}
                                                {advance.type === 'emergency' && 'Acil Durum'}
                                                {advance.type === 'education' && 'Eğitim'}
                                                {advance.type === 'housing' && 'Konut'}
                                                {advance.type === 'other' && 'Diğer'}
                                            </span>
                                        </td>
                                        <td>{advance.installments || 1} taksit</td>
                                        <td>{advance.description || '-'}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(advance.status, 'advanced_request')}`}>
                                                {advance.status === 'pending' && 'Beklemede'}
                                                {advance.status === 'approved' && 'Onaylandı'}
                                                {advance.status === 'rejected' && 'Reddedildi'}
                                                {advance.status === 'cancelled' && 'İptal'}
                                                {advance.status === 'paid' && 'Ödendi'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="ti ti-receipt-tax fs-1 text-muted mb-2"></i>
                        <p className="text-muted">Henüz avans başvurusu alınmadı.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Render positions tab (temporarily disabled)
    const renderPositionsTab = () => (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <i className="ti ti-briefcase fs-1 text-muted mb-2"></i>
                        <h5 className="mb-2 text-muted">Bu Modül Pasif</h5>
                        <p className="text-muted">Posizyon geçmiş modülü暫 zamanlamıştır.</p>
                        
                        {/* Pozisyon Ekleme Formu */}
                        {false && (
                            <div>
                                <button 
                                    onClick={() => setIsPositionModalOpen(true)}
                                    className="btn btn-primary my-3"
                                >
                                    <i className="ti ti-plus me-1"></i>Pozisyon Ekle
                                </button>
                                
                                {isPositionModalOpen && (
                                    <div className="modal show d-block modal-overlay">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Yeni Pozisyon Ekle</h5>
                                                    <button 
                                                        type="button" 
                                                        className="btn-close" 
                                                        onClick={() => setIsPositionModalOpen(false)}>
                                                    </button>
                                                </div>
                                                <form onSubmit={handlePositionAdd}>
                                                    <div className="modal-body">
                                                        <div className="mb-3">
                                                            <label className="form-label">Pozisyon Adı</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={positionData.position_title}
                                                                onChange={(e) => setPositionData('position_title', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={positionErrors.position_title} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Departman</label>
                                                            <select
                                                                className="form-control"
                                                                value={positionData.department_id}
                                                                onChange={(e) => setPositionData('department_id', e.target.value)}
                                                                required
                                                            >
                                                                <option value="">Seçiniz</option>
                                                                {/* Assuming this comes from shared props, we could enhance this */}
                                                                <option value="1">Human Resources</option>
                                                                <option value="2">Financial Services</option>
                                                                <option value="3">Engineering</option>
                                                                <option value="4">Sales</option>
                                                                <option value="5">Marketing</option>
                                                            </select>
                                                            <InputError message={positionErrors.department_id} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Başlangıç Tarihi</label>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={positionData.start_date}
                                                                onChange={(e) => setPositionData('start_date', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={positionErrors.start_date} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Bitiş Tarihi (Opsiyonel)</label>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={positionData.end_date}
                                                                onChange={(e) => setPositionData('end_date', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Açıklama</label>
                                                            <textarea
                                                                className="form-control"
                                                                rows={3}
                                                                value={positionData.description}
                                                                onChange={(e) => setPositionData('description', e.target.value)}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-light" 
                                                            onClick={() => setIsPositionModalOpen(false)}>
                                                            İptal
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            className="btn btn-primary"
                                                            disabled={positionProcessing}
                                                        >
                                                            {positionProcessing ? 'İşleniyor...' : 'Ekle'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-semibold text-dark">
                            {employee.first_name} {employee.last_name}
                        </h5>
                        <p className="fs-sm text-muted">
                            {employee.email} • {employee.phone} • {getEmploymentTypeLabel(employee.employment_type)}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`${employee.first_name} ${employee.last_name}`} />

            <div className="py-4">
                <div className="mw-100 mx-auto">
                    {/* Tabs */}
                    <div className="bg-white rounded-3 shadow-sm">
                        <div className="border-b border-secondary">
                            <nav className="d-flex flex-wrap -mb-px small">
                                {[
                                    { id: 'info', label: 'Bilgi', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                    { id: 'education', label: 'Eğitim', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
                                    { id: 'certificates', label: 'Sertifikalar', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
                                    { id: 'documents', label: 'Belgeler', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                                    { id: 'attendances', label: 'Devamlılık', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                    { id: 'leaves', label: 'İzinler', icon: 'M19 9l-7 7-7-7' },
                                    { id: 'advances', label: 'Avanslar', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                    { id: 'positions', label: 'Pozisyon Geçmişi', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-3 px-2 text-center border-b-2 fw-medium small ${
                                            activeTab === tab.id
                                                ? 'border-indigo-500 text-primary'
                                                : 'border-transparent text-muted hover:text-dark hover:border-secondary'
                                        }`}
                                    >
                                        <div className="d-flex flex-column align-items-center">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                            </svg>
                                            <span className="mt-1">{tab.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-4">
                            {/* Info Tab */}
                            {activeTab === 'info' && renderInfoTab()}
                            
                            {/* Education Tab */}
                            {activeTab === 'education' && renderEducationTab()}
                            
                            {/* Certificates Tab */}
                            {activeTab === 'certificates' && renderCertificatesTab()}
                            
                            {/* Documents Tab */}
                            {activeTab === 'documents' && renderDocumentsTab()}
                            
                            {/* Attendances Tab */}
                            {activeTab === 'attendances' && renderAttendancesTab()}
                            
                            {/* Leaves Tab */}
                            {activeTab === 'leaves' && renderLeavesTab()}
                            
                            {/* Advances Tab */}
                            {activeTab === 'advances' && renderAdvancesTab()}
                            
                            {/* Positions Tab */}
                            {activeTab === 'positions' && renderPositionsTab()}
                        </div>
                    </div>

                    {/* Document Upload Modal */}
                    {isUploadModalOpen && (
                        <div className="modal show d-block modal-overlay">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Belge Yükle</h5>
                                        <button 
                                            type="button" 
                                            className="btn-close" 
                                            onClick={() => setIsUploadModalOpen(false)}>
                                        </button>
                                    </div>
                                    <form onSubmit={handleDocumentUpload}>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Dosya</label>
                                                <input 
                                                    type="file" 
                                                    id="document-file" 
                                                    className="form-control" 
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                                                    required 
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Belge Türü</label>
                                                <select 
                                                    className="form-control" 
                                                    value={uploadType} 
                                                    onChange={(e) => setUploadType(e.target.value)}
                                                >
                                                    <option value="contract">Sözleşme</option>
                                                    <option value="identity">Kimlik</option>
                                                    <option value="education">Eğitim</option>
                                                    <option value="certificate">Sertifika</option>
                                                    <option value="medical">Sağlık Raporu</option>
                                                    <option value="other">Diğer</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button 
                                                type="button" 
                                                className="btn btn-light" 
                                                onClick={() => setIsUploadModalOpen(false)}>
                                                İptal
                                            </button>
                                            <button type="submit" className="btn btn-primary">Yükle</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terminate Employee Modal */}
                    {isTerminateModalOpen && (
                        <div className="modal show d-block modal-overlay">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">İşten Çıkar</h5>
                                        <button 
                                            type="button" 
                                            className="btn-close" 
                                            onClick={() => setIsTerminateModalOpen(false)}>
                                        </button>
                                    </div>
                                    <form onSubmit={handleTerminate}>
                                        <div className="modal-body">
                                            <div className="alert alert-warning">
                                                Bu çalışanı işten çıkarmak, çalışanla ilgili tüm sistem erişimlerini kaldıracaktır. 
                                                Bu işlem geri alınamaz!
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label className="form-label">Çıkış Tarihi</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={terminateData.termination_date}
                                                    onChange={(e) => setTerminateData('termination_date', e.target.value)}
                                                    required
                                                />
                                                <InputError message={terminateErrors.termination_date} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Çıkış Nedeni</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={terminateData.termination_reason}
                                                    onChange={(e) => setTerminateData('termination_reason', e.target.value)}
                                                    required
                                                />
                                                <InputError message={terminateErrors.termination_reason} />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button 
                                                type="button" 
                                                className="btn btn-light" 
                                                onClick={() => setIsTerminateModalOpen(false)}>
                                                İptal
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-danger"
                                                disabled={terminateProcessing}
                                            >
                                                {terminateProcessing ? 'İşleniyor...' : 'Çıkar'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}