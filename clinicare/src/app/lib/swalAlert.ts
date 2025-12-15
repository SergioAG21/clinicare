import Swal from 'sweetalert2';

export const swalAlert = (
  title: string,
  message: string,
  icon: 'error' | 'success' | 'warning',
  timer?: number,
  showCancelButton?: boolean,
  showConfirmButton?: boolean
) => {
  return Swal.fire({
    title: title,
    html: `<p class="swal-text"> ${
      message ||
      'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
    }</p>`,
    icon: icon,
    showConfirmButton: showConfirmButton,
    confirmButtonText: 'Confirmar',
    showCancelButton: showCancelButton,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ff6b6b',
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
    },
    timer: timer,
    allowOutsideClick: timer && timer > 1000 ? false : true,
  });
};
