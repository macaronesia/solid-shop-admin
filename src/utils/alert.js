import Swal from 'sweetalert2';

export const alertMessage = (message) => {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error'
  });
};

export const showWarningDialog = (message, onConfirm) => {
  Swal.fire({
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dd6b55'
  })
    .then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
};
