import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-add-book.component',
  imports: [FormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {
  title: string = '';
  author: string = '';
  description: string = '';

  constructor(
    private booksService: BooksService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    this.firebaseService.getCurrentUser().subscribe(user => {
      console.log('Logged in user:', user);
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  async onSubmit() {
    try {
      await this.booksService.addBook(this.title, this.author, this.description);
      alert('Book added successfully!');
      this.router.navigate(['/books']);
    } catch (error) {
      alert('Failed to add book: ' + (error as any)?.message);
    }
  }
}
