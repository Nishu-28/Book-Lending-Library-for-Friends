import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { BorrowService } from '../../services/borrow.service';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  books: any[] = [];
  currentUser: any;
  editBookId: string | null = null;
  editBook: any = { title: '', author: '', description: '' };

  constructor(
    private firebaseService: FirebaseService,
    private borrowService: BorrowService,
    private booksService: BooksService
  ) {
    this.firebaseService.getBooks().subscribe(books => {
      this.books = books;
    }, (error: any) => alert('Error: ' + error.message));
    
    this.firebaseService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  requestBorrow(bookId: string) {
    if (!this.currentUser) {
      alert('You must be logged in to borrow a book.');
      return;
    }
    const book = this.books.find(b => b.id === bookId);
    if (!book) {
      alert('Book not found.');
      return;
    }
    this.borrowService.requestBorrow(bookId, book.ownerId)
      .then(() => alert('Borrow request sent!'))
      .catch((error: any) => alert('Error: ' + error.message));
  }

  startEdit(book: any) {
    this.editBookId = book.id;
    this.editBook = { ...book };
  }

  cancelEdit() {
    this.editBookId = null;
    this.editBook = { title: '', author: '', description: '' };
  }

  saveEdit(bookId: string) {
    this.booksService.updateBook(bookId, {
      title: this.editBook.title,
      author: this.editBook.author,
      description: this.editBook.description
    })
      .then(() => {
        alert('Book updated!');
        this.cancelEdit();
        // Refresh books
        this.firebaseService.getBooks().subscribe(books => {
          this.books = books;
        });
      })
      .catch((error: any) => alert('Error: ' + error.message));
  }

  deleteBook(bookId: string) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    this.booksService.deleteBook(bookId)
      .then(() => {
        alert('Book deleted!');
        // Refresh books
        this.firebaseService.getBooks().subscribe(books => {
          this.books = books;
        });
      })
      .catch((error: any) => alert('Error: ' + error.message));
  }
}