import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Flash({ flash }) {
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: 'Başarılı',
                text: flash.success,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
            });
        }
        
        if (flash?.error) {
            Swal.fire({
                title: 'Hata',
                text: flash.error,
                icon: 'error',
            });
        }
    }, [flash]);

    return null;
}
