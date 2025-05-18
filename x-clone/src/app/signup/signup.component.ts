import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  selectedTabIndex: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private router : Router
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nickname: [''],
      birth: ['' , [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    })
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = { ...this.signupForm.value };
      // Format the date to YYYY-MM-DD
      if (formData.birth) {
        const date = new Date(formData.birth);
        formData.birth = date.toISOString().split('T')[0];
      }
      console.log('Form data:', formData);
      this.authService.register(formData).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigateByUrl('/login')
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid.');
    }
  }

  goBack() {
    this.location.back();
  }

  nextTab() {
    this.selectedTabIndex = 1
  }

  previousTab() {
    this.selectedTabIndex = 0
  }
}
