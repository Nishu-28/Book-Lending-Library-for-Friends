import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class BooksService {
  constructor(private firebaseService: FirebaseService) {}
  
  addBook(title: string, author: string, description: string) {
    return this.firebaseService.addBook(title, author, description);
  }
  
  getBooks() {
    return this.firebaseService.getBooks();
  }
  
  getBooksByOwner(ownerId: string) {
    return this.firebaseService.getBooksByOwner(ownerId);
  }

  updateBook(bookId: string, data: Partial<{title: string, author: string, description: string, status: string}>) {
    return this.firebaseService.updateBook(bookId, data);
  }

  deleteBook(bookId: string) {
    return this.firebaseService.deleteBook(bookId);
  }
}