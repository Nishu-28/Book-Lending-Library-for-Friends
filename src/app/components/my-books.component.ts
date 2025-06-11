import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '../services/books.service';
import { FirebaseService } from '../services/firebase.service';
import { BorrowService } from '../services/borrow.service';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">My Books</h1>
      <div *ngIf="books.length === 0" class="text-center text-gray-500 mt-8">
        You have not added any books yet.
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="books.length > 0">
        <div *ngFor="let book of books" class="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h3 class="text-xl font-semibold text-gray-800">{{ book.title }}</h3>
          <p class="text-gray-600 mt-1">by {{ book.author }}</p>
          <p class="text-gray-700 mt-2">{{ book.description }}</p>
          <div class="mt-4">
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{{ book.status }}</span>
          </div>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mt-12 mb-4">My Borrow Requests</h2>
      <div *ngIf="activeBorrowRequests.length === 0" class="text-center text-gray-500 mt-4">
        You have not requested to borrow any books.
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="activeBorrowRequests.length > 0">
        <div *ngFor="let request of activeBorrowRequests" class="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <p class="font-semibold">Book: {{ request.bookTitle || request.bookId }}</p>
          <p>Status: {{ request.status }}</p>
          <button *ngIf="request.status === 'accepted'" (click)="returnBook(request.bookId, request.id)" class="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Return</button>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mt-12 mb-4">My Borrow History</h2>
      <div *ngIf="borrowHistory.length === 0" class="text-center text-gray-500 mt-4">
        No borrow history yet.
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="borrowHistory.length > 0">
        <div *ngFor="let request of borrowHistory" class="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <p class="font-semibold">Book: {{ request.bookTitle || request.bookId }}</p>
          <p>Status: {{ request.status }}</p>
        </div>
      </div>
    </div>
  `
})
export class MyBooksComponent {
  books: any[] = [];
  borrowRequests: any[] = [];
  activeBorrowRequests: any[] = [];
  borrowHistory: any[] = [];
  currentUser: any;

  constructor(private booksService: BooksService, private firebaseService: FirebaseService, private borrowService: BorrowService) {
    this.firebaseService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.booksService.getBooksByOwner(user.uid).subscribe(books => {
          this.books = books;
        });
        this.borrowService.getRequestsByUser(user.uid).subscribe(async requests => {
          const allBooks = (await this.firebaseService.getBooks().toPromise()) || [];
          this.borrowRequests = requests.map(req => {
            const book = allBooks.find((b: any) => b.id === req.bookId);
            return { ...req, bookTitle: book && (book as any).title ? (book as any).title : req.bookId };
          });
          this.activeBorrowRequests = this.borrowRequests.filter(r => r.status === 'pending' || r.status === 'accepted');
          this.borrowHistory = this.borrowRequests.filter(r => r.status === 'returned' || r.status === 'rejected');
        });
      }
    });
  }

  returnBook(bookId: string, requestId: string) {
    this.booksService.updateBook(bookId, { status: 'available' })
      .then(() => this.borrowService.updateRequestStatus(requestId, 'returned'))
      .then(() => alert('Book returned!'))
      .catch((error: any) => alert('Error returning book: ' + error.message));
  }
} 