function successNotification(message) {
    Swal.fire({
        text: message,
        icon: 'success',
        background: '#d4edda',
        color: '#155724',
        confirmButtonColor: '#28a745',
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
    });
}

function errorNotification(message) {
    Swal.fire({
        text: message,
        icon: 'error',
        background: '#f8d7da',
        color: '#721c24',
        confirmButtonColor: '#dc3545',
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
    });
}