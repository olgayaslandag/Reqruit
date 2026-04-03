import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { confirmDelete, showSuccess } from '@/Utils/sweetAlert';
import {
    getStatusBadge,
    getEmploymentTypeLabel,
    employmentTypeOptions,
    statusFilterOptions,
} from '@/Utils/employeeHelpers.jsx';
import Pagination from '@/Components/Pagination';

export default function Index({ employees, filters, employeeTree }) {
    const { props } = usePage();
    const flash = props.flash;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [localFilters, setLocalFilters] = useState({
        status: filters.status || '',
        department_id: filters.department_id || '',
        employment_type: filters.employment_type || '',
    });

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.employees.index'), {
            ...localFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Filtre değişikliği
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.employees.index'), {
            ...newFilters,
            search: searchTerm,
        }, { replace: true });
    };

    // Silme işlemi
    const handleDelete = (id) => {
        confirmDelete('Bu çalışanı silmek istediğinize emin misiniz?', () => {
            router.delete(route('admin.employees.destroy', id), {
                onSuccess: () => showSuccess('Çalışan başarıyla silindi.'),
            });
        });
    };

    // Tree yapısı için recursive row toplama fonksiyonu
    const collectEmployeeRows = (employee, level = 0) => {
        const indent = level * 24;
        const hasChildren = employee.children && employee.children.length > 0;

        const rows = [
            <tr key={employee.id} className="table-hover">
                <td className="px-4 py-3">
                    <div className="d-flex align-items-center" style={{ paddingLeft: indent }}>
                        {hasChildren ? (
                            <i className="ti ti-chevron-right me-2 text-muted"></i>
                        ) : level > 0 ? (
                            <span className="me-2 text-muted">└</span>
                        ) : (
                            <span className="me-2"></span>
                        )}
                        <div>
                            <Link
                                href={route('admin.employees.show', employee.id)}
                                className={`text-decoration-none ${level === 0 ? 'text-dark fw-semibold' : 'text-dark fw-semibold'}`}
                            >
                                {employee.first_name} {employee.last_name}
                                <span className="ms-2">
                                    {getStatusBadge(employee)}
                                </span>
                            </Link>
                            {employee.manager && (
                                <div className="small text-muted">
                                    Yönetici: {employee.manager.first_name} {employee.manager.last_name}
                                </div>
                            )}
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3 text-nowrap">
                    <span className="text-dark">{employee.identity_no}</span>
                </td>
                <td className="px-4 py-3 text-nowrap">
                    <span className="text-dark">
                        {employee.department?.title || '-'}
                    </span>
                </td>
                <td className="px-4 py-3 text-nowrap">
                    <span className="text-dark">
                        {employee.position_title || '-'}
                    </span>
                </td>
                <td className="px-4 py-3 text-nowrap">
                    <span className="text-muted">
                        {getEmploymentTypeLabel(employee.employment_type)}
                    </span>
                </td>
                <td className="px-4 py-3 text-nowrap text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                        <Link
                            href={route('admin.employees.show', employee.id)}
                            className="btn btn-link text-primary p-0"
                            title="Görüntüle"
                        >
                            <i className="ti ti-eye"></i>
                        </Link>
                        <Link
                            href={route('admin.employees.edit', employee.id)}
                            className="btn btn-link text-secondary p-0"
                            title="Düzenle"
                        >
                            <i className="ti ti-edit"></i>
                        </Link>
                        <button
                            onClick={() => handleDelete(employee.id)}
                            className="btn btn-link text-danger p-0"
                            title="Sil"
                        >
                            <i className="ti ti-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        ];

        // Recursive olarak children'ları ekle
        if (employee.children) {
            employee.children.forEach(child => {
                rows.push(...collectEmployeeRows(child, level + 1));
            });
        }

        return rows;
    };

    // Tree verisinden tüm satırları oluştur
    const allRows = employeeTree ? employeeTree.flatMap(emp => collectEmployeeRows(emp)) : [];

    return (
        <AuthenticatedLayout
            pageHeader={{
                title: 'Çalışanlar',
                breadcrumbs: [
                    { label: 'Ana Sayfa', url: route('dashboard') },
                    { label: 'İnsan Kaynakları', url: '#' },
                    { label: 'Çalışanlar', url: route('admin.employees.index') },
                ],
                newUrl: route('admin.employees.create'),
                filterCollapse: true,
            }}
        >
            <Head title="Çalışanlar" />


            {/* Arama ve Filtreler */}
            <div className="card mb-3 collapse" id="filterCollapse">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="row g-3 align-items-end">
                        {/* Arama */}
                        <div className="col-md-3">
                            <label className="form-label fw-medium">
                                Arama
                            </label>
                            <input className="form-control form-control-sm" type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="İsim, TC Kimlik No..."
                            />
                        </div>

                        {/* Durum Filtresi */}
                        <div className="col-md-2">
                            <label className="form-label fw-medium">
                                Durum
                            </label>
                            <select className="form-select form-select-sm" value={localFilters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Tümü</option>
                                {statusFilterOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Departman Filtresi */}
                        <div className="col-md-3">
                            <label className="form-label fw-medium">
                                Departman
                            </label>
                            <select className="form-select form-select-sm" value={localFilters.department_id}
                                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                            >
                                <option value="">Tümü</option>
                                {props.departments?.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Çalışma Tipi */}
                        <div className="col-md-2">
                            <label className="form-label fw-medium">
                                Çalışma Tipi
                            </label>
                            <select className="form-select form-select-sm" value={localFilters.employment_type}
                                onChange={(e) => handleFilterChange('employment_type', e.target.value)}
                            >
                                <option value="">Tümü</option>
                                {employmentTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ara Butonu */}
                        <div className="col-md-2">
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                            >
                                <i className="ti ti-search me-1"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tree Yapısı - Tablo */}
            <div className="card mb-3">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="px-4 py-3">
                                    Çalışan
                                </th>
                                <th className="px-4 py-3">
                                    TC Kimlik No
                                </th>
                                <th className="px-4 py-3">
                                    Departman
                                </th>
                                <th className="px-4 py-3">
                                    Pozisyon
                                </th>
                                <th className="px-4 py-3">
                                    Çalışma Tipi
                                </th>
                                <th className="px-4 py-3 text-end">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allRows.length > 0 ? (
                                allRows
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-muted">
                                        Çalışan bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination meta={employees} baseUrl={route('admin.employees.index')} />
        </AuthenticatedLayout>
    );
}
