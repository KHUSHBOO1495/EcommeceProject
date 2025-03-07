import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  constructor(private _api: LoginService) { }
  _router = inject(Router);

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._api.login(email, password).subscribe((res: any) => {
        localStorage.setItem('token', res.token);
        Swal.fire({
          title: 'Welcome Back!',
          text: 'You have successfully logged in.',
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
