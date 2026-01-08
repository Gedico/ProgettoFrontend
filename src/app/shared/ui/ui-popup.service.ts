import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export interface ConfirmOptions {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UiPopupService {
  success(title: string, text?: string): Promise<void> {
    return this.fire('success', title, text);
  }

  error(title: string, text?: string): Promise<void> {
    return this.fire('error', title, text);
  }

  info(title: string, text?: string): Promise<void> {
    return this.fire('info', title, text);
  }

  warning(title: string, text?: string): Promise<void> {
    return this.fire('warning', title, text);
  }

  async confirm(opts: ConfirmOptions): Promise<boolean> {
    const res = await Swal.fire({
      icon: opts.danger ? 'warning' : 'question',
      title: opts.title,
      text: opts.text,
      showCancelButton: true,
      confirmButtonText: opts.confirmText ?? 'Conferma',
      cancelButtonText: opts.cancelText ?? 'Annulla',
      reverseButtons: true,
      focusCancel: true,
      buttonsStyling: false,
      customClass: {
        popup: 'sw-popup',
        title: 'sw-title',
        htmlContainer: 'sw-text',
        confirmButton: opts.danger ? 'sw-btn sw-btnDanger' : 'sw-btn sw-btnPrimary',
        cancelButton: 'sw-btn sw-btnGhost'
      }
    });

    return Boolean(res.isConfirmed);
  }

  private async fire(icon: SweetAlertIcon, title: string, text?: string): Promise<void> {
    await Swal.fire({
      icon,
      title,
      text,
      timer: 2200,
      showConfirmButton: false,
      timerProgressBar: true,
      buttonsStyling: false,
      customClass: {
        popup: 'sw-popup',
        title: 'sw-title',
        htmlContainer: 'sw-text'
      }
    });
    return undefined;
  }
}
