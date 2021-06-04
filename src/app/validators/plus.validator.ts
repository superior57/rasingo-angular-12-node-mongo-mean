import { AbstractControl } from '@angular/forms';

export function plusValidator(control: AbstractControl) {
  console.log(control.value.length);
  if (control.value.length == 0) {
    return { plusNotValid: true }
  }
  return null;
}
