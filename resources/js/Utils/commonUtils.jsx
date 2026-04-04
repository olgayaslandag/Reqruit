/**
 * Common utility functions to eliminate code duplication
 */

/**
 * Flattens a nested departments structure for hierarchical selection
 * @param {Array} depts - Array of departments with children
 * @param {number} level - Current level of nesting
 * @returns {Array} - Flat array with level information
 */
export const flattenDepartments = (depts, level = 0) => {
    let result = [];
    depts?.forEach(dept => {
        result.push({ ...dept, level });
        if (dept.children && dept.children.length > 0) {
            result = result.concat(flattenDepartments(dept.children, level + 1));
        }
    });
    return result;
};

/**
 * General status badge generator with standardized colors
 * @param {string} status - Status value
 * @param {string} type - Type of status for coloring scheme (defaults to 'generic')
 * @returns {JSX.Element} - Badge element
 */
export const getStatusBadge = (status, type = 'generic') => {
    let colorClass = '';
    let label = '';

    switch (type) {
        case 'advanced_request':
            switch (status?.toLowerCase()) {
                case 'pending': 
                    colorClass = 'bg-warning text-dark'; 
                    label = 'Beklemede'; 
                    break;
                case 'approved': 
                    colorClass = 'bg-success'; 
                    label = 'Onaylandı'; 
                    break;
                case 'rejected': 
                    colorClass = 'bg-danger'; 
                    label = 'Reddedildi'; 
                    break;
                case 'cancelled': 
                    colorClass = 'bg-secondary'; 
                    label = 'İptal Edildi'; 
                    break;
                case 'paid': 
                    colorClass = 'bg-primary'; 
                    label = 'Ödendi'; 
                    break;
                default: 
                    colorClass = 'bg-light text-dark'; 
                    label = status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Bilinmiyor'; 
            }
            break;
            
        case 'payroll':
            switch (status?.toLowerCase()) {
                case 'draft': 
                    colorClass = 'bg-secondary'; 
                    label = 'Taslak'; 
                    break;
                case 'submitted': 
                    colorClass = 'bg-info'; 
                    label = 'Gönderildi'; 
                    break;
                case 'approved': 
                    colorClass = 'bg-success'; 
                    label = 'Onaylandı'; 
                    break;
                case 'closed': 
                    colorClass = 'bg-success'; 
                    label = 'Kapandı'; 
                    break;
                default: 
                    colorClass = 'bg-light text-dark'; 
                    label = status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Bilinmiyor'; 
            }
            break;
            
        case 'leave':
            switch (status?.toLowerCase()) {
                case 'pending': 
                    colorClass = 'bg-warning text-dark'; 
                    label = 'Beklemede'; 
                    break;
                case 'approved': 
                    colorClass = 'bg-success'; 
                    label = 'Onaylandı'; 
                    break;
                case 'rejected': 
                    colorClass = 'bg-danger'; 
                    label = 'Reddedildi'; 
                    break;
                case 'cancelled': 
                    colorClass = 'bg-secondary'; 
                    label = 'İptal Edildi'; 
                    break;
                default: 
                    colorClass = 'bg-light text-dark'; 
                    label = status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Bilinmiyor'; 
                    break;
            }
            break;
            
        case 'attendance':
            switch (status?.toLowerCase()) {
                case 'present': 
                    colorClass = 'bg-success text-white'; 
                    label = 'Devrede'; 
                    break;
                case 'absent': 
                    colorClass = 'bg-danger text-white'; 
                    label = 'Devre Dışı'; 
                    break;
                case 'late': 
                    colorClass = 'bg-warning text-dark'; 
                    label = 'Geç Giriş'; 
                    break;
                case 'early_departure': 
                    colorClass = 'bg-warning text-dark'; 
                    label = 'Erken Çıkış'; 
                    break;
                case 'on_leave': 
                    colorClass = 'bg-info text-white'; 
                    label = 'İzinli'; 
                    break;
                default: 
                    colorClass = 'bg-light text-dark'; 
                    label = status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Bilinmiyor'; 
            }
            break;
            
        case 'shift':
            switch (status?.toLowerCase()) {
                case 'active': 
                    colorClass = 'bg-success text-white'; 
                    label = 'Aktif'; 
                    break;
                case 'inactive': 
                    colorClass = 'bg-secondary text-white'; 
                    label = 'Pasif'; 
                    break;
                case 'draft': 
                    colorClass = 'bg-warning text-dark'; 
                    label = 'Taslak'; 
                    break;
                default: 
                    colorClass = 'bg-light text-dark'; 
                    label = status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Bilinmiyor'; 
                    break;
            }
            break;
            
        default: // Generic case
            switch (status?.toLowerCase()) {
                case 'pending': 
                    colorClass = 'bg-warning text-dark'; 
                    label = 'Beklemede'; 
                    break;
                case 'active': 
                case 'success': 
                case 'completed': 
                    colorClass = 'bg-success'; 
                    label = status.includes('active') ? 'Aktif' : status.charAt(0).toUpperCase() + status.slice(1); 
                    break;
                case 'inactive': 
                    colorClass = 'bg-secondary'; 
                    label = 'Pasif'; 
                    break;
                case 'approved': 
                    colorClass = 'bg-success'; 
                    label = 'Onaylandı'; 
                    break;
                case 'rejected': 
                case 'failed': 
                    colorClass = 'bg-danger'; 
                    label = status.includes('rejected') ? 'Reddedildi' : 'Başarısız'; 
                    break;
                case 'canceled': 
                case 'cancelled': 
                    colorClass = 'bg-secondary'; 
                    label = 'İptal Edildi'; 
                    break;
                default: 
                    colorClass = 'bg-light text-dark'; 
                    label = status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Bilinmiyor'; 
            }
            break;
    }

    return (
        <span className={`badge ${colorClass}`}>
            {label}
        </span>
    );
};

/**
 * Get appropriate badge class for a specific status (simple string version)
 * @param {string} status - Status value
 * @param {string} type - Type of status for coloring scheme
 * @returns {string} - CSS class string
 */
export const getStatusBadgeClass = (status, type = 'generic') => {
    switch (type) {
        case 'advanced_request':
            switch (status?.toLowerCase()) {
                case 'pending': return 'bg-warning text-dark';
                case 'approved': return 'bg-success';
                case 'rejected': return 'bg-danger';
                case 'cancelled': return 'bg-secondary';
                case 'paid': return 'bg-primary';
                default: return 'bg-light text-dark';
            }
        case 'payroll':
            switch (status?.toLowerCase()) {
                case 'draft': return 'bg-secondary';
                case 'submitted': return 'bg-info';
                case 'approved': return 'bg-success';
                case 'closed': return 'bg-success';
                default: return 'bg-light text-dark';
            }
        case 'attendance':
            switch (status?.toLowerCase()) {
                case 'present': return 'bg-success text-white';
                case 'absent': return 'bg-danger text-white';
                case 'late': return 'bg-warning text-dark';
                case 'early_departure': return 'bg-warning text-dark';
                case 'on_leave': return 'bg-info text-white';
                default: return 'bg-light text-dark';
            }
        case 'shift':
            switch (status?.toLowerCase()) {
                case 'active': return 'bg-success text-white';
                case 'inactive': return 'bg-secondary text-white';
                case 'draft': return 'bg-warning text-dark';
                default: return 'bg-light text-dark';
            }
        default: // Generic case
            switch (status?.toLowerCase()) {
                case 'pending': return 'bg-warning text-dark';
                case 'active': 
                case 'success': 
                case 'completed': return 'bg-success';
                case 'inactive': return 'bg-secondary';
                case 'approved': return 'bg-success';
                case 'rejected': 
                case 'failed': return 'bg-danger';
                case 'canceled': 
                case 'cancelled': return 'bg-secondary';
                default: return 'bg-light text-dark';
            }
    }
};

/**
 * Get approval status badge class specifically for payrolls
 * @param {string} status - Approval status
 * @returns {string} - CSS class string
 */
export const getApprovalStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'submitted': return 'bg-info text-white';
        case 'approved': return 'bg-success text-white';
        case 'partial': return 'bg-warning text-dark';
        case 'rejected': return 'bg-danger text-white';
        default: return 'bg-light text-dark';
    }
};

/**
 * Get work calendar status badge class
 * @param {boolean} isActive - Whether the calendar is active
 * @returns {string} - CSS class string
 */
export const getWorkCalendarStatusBadgeClass = (isActive) => {
    return isActive ? 'bg-success' : 'bg-danger';
};