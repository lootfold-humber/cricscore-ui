import { AbstractControl, ValidationErrors } from '@angular/forms';

export class SignUpFormValidator {
  static validatePassword(form: AbstractControl): ValidationErrors | null {
    const pass = form.get('password')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    if (pass !== confirmPass) {
      return { password: true };
    }

    return null;
  }
}
