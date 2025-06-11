import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../services/books.service';
import { AuthService } from '../../services/auth.service';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-request-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-management.component.html',
})
export class RequestManagementComponent {
  requests: any[] = [];
  currentUser: any;
  
  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private borrowService: BorrowService
  ) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.booksService.getBooksByOwner(user.uid).subscribe(books => {
          books.forEach(book => {
            this.borrowService.getRequestsForBook(book.id).subscribe((requests: any[]) => {
              this.requests = [...this.requests, ...requests];
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