import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'book-lending-library';
  currentUser: any = null;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.firebaseService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
