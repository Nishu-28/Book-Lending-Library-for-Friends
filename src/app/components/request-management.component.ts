import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '../services/books.service';
import { AuthService } from '../services/auth.service';
import { BorrowService } from '../services/borrow.service';

@Component({
  selector: 'app-request-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Borrow Requests</h1>
      <div *ngIf="requests.length === 0" class="text-gray-500">
        No pending requests
      </div>
      <div *ngFor="let request of requests" class="bg-white rounded-lg shadow-md p-6 mb-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold">Request for Book: {{ request.bookTitle || request.bookId }}</p>
            <p>Status: {{ request.status }}</p>
            <p>Requested on: {{ request.requestedAt ? (request.requestedAt | date:'medium') : '' }}</p>
          </div>
          <div *ngIf="request.status === 'pending'">
            <button (click)="respondToRequest(request.id, 'accepted', request.bookId)"
              class="mr-2 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
              Accept
            </button>
            <button (click)="respondToRequest(request.id, 'rejected', request.bookId)"
              class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RequestManagementComponent {
  requests: any[] = [];
  currentUser: any;
  bookIdToTitle: { [key: string]: string } = {};

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private borrowService: BorrowService
  ) {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      if (user) {
        this.booksService.getBooksByOwner(user.uid).subscribe((books: any[]) => {
          // Map bookId to title
          this.bookIdToTitle = {};
          books.forEach((book: any) => {
            this.bookIdToTitle[book.id] = book.title;
          });
          books.forEach((book: any) => {
            this.borrowService.getRequestsForBook(book.id).subscribe((requests: any[]) => {
              // Enhance requests with book title
              this.requests = [
                ...this.requests,
                ...requests.map(req => ({
                  ...req,
                  bookTitle: this.bookIdToTitle[req.bookId],
                  requestedAt: req.requestedAt ? new Date(req.requestedAt.seconds ? req.requestedAt.seconds * 1000 : req.requestedAt) : null
                }))
              ];
            });
          });
        });
      }
    });
  }

  respondToRequest(requestId: string, status: 'accepted' | 'rejected', bookId?: string) {
    this.borrowService.updateRequestStatus(requestId, status)
      .then(() => {
        if (status === 'accepted' && bookId) {
          this.booksService.updateBook(bookId, { status: 'borrowed' })
            .then(() => alert('Request updated and book marked as borrowed!'))
            .catch((error: any) => alert('Error updating book: ' + error.message));
        } else {
          alert('Request updated');
        }
      })
      .catch((error: any) => alert('Error: ' + error.message));
  }
} 