import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyInput]',
  standalone: true
})
export class CurrencyInputDirective {

  private formatting = false;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private ngControl: NgControl
  ) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (this.formatting) {
      return;
    }

    const digits = value.replace(/\D/g, '');

    if (!digits) {
      this.updateValue(null, '');
      return;
    }

    const numeric = Number(digits);

    const formatted = new Intl.NumberFormat('it-IT', {
      maximumFractionDigits: 0
    }).format(numeric);

    this.updateValue(numeric, formatted);
  }

  @HostListener('blur')
  onBlur() {
    const native = this.el.nativeElement;
    const digits = native.value.replace(/\D/g, '');

    if (!digits) {
      this.updateValue(null, '');
      return;
    }

    const numeric = Number(digits);
    const formatted = new Intl.NumberFormat('it-IT', {
      maximumFractionDigits: 0
    }).format(numeric);

    this.updateValue(numeric, formatted);
  }

  private updateValue(numeric: number | null, display: string) {
    this.formatting = true;

    if (this.ngControl?.control) {
      this.ngControl.control.setValue(numeric, { emitEvent: true });
    }

    this.el.nativeElement.value = display;

    this.formatting = false;
  }
}
