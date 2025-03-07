import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, NgIf, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm = new FormGroup({
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone_number: new FormControl('', [Validators.required, Validators.pattern("[0-9]{10}")]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private _api: RegisterService) { }
  _router = inject(Router);

  onSubmit() {
    if (this.registerForm.valid) {
      const { password, confirmPassword, phone_number, first_name, last_name, email } = this.registerForm.value;
      this._api.register(password, confirmPassword, phone_number, first_name, last_name, email).subscribe((res: any) => {
        localStorage.setItem('token', res.token);
        Swal.fire({
          title: 'Welcome!',
          text: 'You have successfully registered.',
          icon: 'success',
          confirmButtonText: 'Continue',
          confirmButtonColor: '#4CAF50', // Green Button
          background: '#f9f9f9', // Light Background
          color: '#333', // Text Color
          timer: 2500, // Auto-close after 2.5 seconds
          timerProgressBar: true, // Show progress bar
          showClass: {
            popup: 'animate_animated animate_fadeInDown' // Fancy animation
          },
          hideClass: {
            popup: 'animate_animated animate_fadeOutUp'
          }
        }).then(() => {
          this._router.navigate(['/']); // Redirect after alert
        });
      },
        (err) => {
          Swal.fire({
            title: 'Oops!',
            text: err.error.message,
            icon: 'error',
            confirmButtonText: 'Try Again',
            confirmButtonColor: '#FF5733', // Red Button
            background: '#fce4e4', // Light Red Background
            color: '#900', // Darker Red Text
            showClass: {
              popup: 'animate_animated animate_shakeX'
            },
            hideClass: {
              popup: 'animate_animated animate_fadeOut'
            }
          });
        })
    }
  }
}
