import Swal from 'sweetalert2';

export const confirmDelete = (message = 'Bu kaydı silmek istediğinize emin misiniz?', onSuccess) => {
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
    Swal.fire({
        title: 'Hata',
        text: message,
        icon: 'error',
    });
};
