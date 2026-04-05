import Swal from 'sweetalert2';

export const confirmDelete = (message = 'Bu kaydı silmek istediğinize emin misiniz?', onSuccess) => {
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 is not loaded');
        if (onSuccess) onSuccess();
        return;
    }

    Swal.fire({
        title: 'Emin misiniz?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Evet, Sil',
        cancelButtonText: 'İptal',
    }).then((result) => {
        if (result.isConfirmed && onSuccess) {
            onSuccess();
        }
    });
};

export const showSuccess = (message) => {
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 is not loaded');
        return;
    }

    Swal.fire({
        title: 'Başarılı',
        text: message,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
    });
};

export const showError = (message) => {
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 is not loaded');
        return;
    }

    Swal.fire({
        title: 'Hata',
        text: message,
        icon: 'error',
    });
};

export const confirmAction = (message = 'Emin misiniz?', onConfirm, onCancel) => {
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 is not loaded');
        if (onConfirm) onConfirm();
        return;
    }

    Swal.fire({
        title: 'Onay',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Evet',
        cancelButtonText: 'İptal',
    }).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        } else if (result.isDismissed && onCancel) {
            onCancel();
        }
    });
};
