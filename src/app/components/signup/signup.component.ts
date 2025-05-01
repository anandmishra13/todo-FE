import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private _snackBar = inject(MatSnackBar);
  signupForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    readonly formBuilder: FormBuilder,
    readonly router: Router,
    readonly authService: AuthService,
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.f['username'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this._snackBar.open('Registered Successfully, Please login', '', {
            duration: 3000
          })
          this.router.navigate(['/login'], { queryParams: { registered: true } });
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  login() {
    this.router.navigate(['/login'])
  }
}
