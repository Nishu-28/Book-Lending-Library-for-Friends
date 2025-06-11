import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ this makes it a standalone component
  imports: [CommonModule, FormsModule], // ✅ import FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;
  isSignUp: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  async onSubmit() {
    this.error = null;
    try {
      if (this.isSignUp) {
        await this.authService.signup(this.email, this.password);
        this.toast.show('Signup successful!');
      } else {
        await this.authService.login(this.email, this.password);
        this.toast.show('Login successful!');
      }
      this.router.navigate(['/']); // Navigate to home after successful auth
    } catch (error: any) {
      this.error = error.message;
      this.toast.show(error.message);
    }
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.error = null;
  }
}
