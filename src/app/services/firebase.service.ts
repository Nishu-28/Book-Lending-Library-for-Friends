import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, query, where, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  getCurrentUser() {
    return authState(this.auth);
  }

  getBooks() {
    const booksRef = collection(this.firestore, 'books');
    return from(getDocs(booksRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      )
    );
  }

  getBooksByOwner(ownerId: string) {
    const booksRef = collection(this.firestore, 'books');
    const q = query(booksRef, where('ownerId', '==', ownerId));
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      )
    );
  }

  async addBook(title: string, author: string, description: string) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    const data = {
      title,
      author,
      description,
      ownerId: user.uid,
      status: 'available',
      createdAt: new Date()
    };
    console.log('addBook: user', user);
    console.log('addBook: data', data);
    const booksRef = collection(this.firestore, 'books');
    return addDoc(booksRef, data);
  }

  async updateBook(bookId: string, data: Partial<{title: string, author: string, description: string, status: string}>) {
    const user = this.auth.currentUser;
    console.log('updateBook: user', user);
    console.log('updateBook: bookId', bookId, 'data', data);
    const bookRef = doc(this.firestore, 'books', bookId);
    return updateDoc(bookRef, data);
  }

  async deleteBook(bookId: string) {
    const user = this.auth.currentUser;
    console.log('deleteBook: user', user);
    console.log('deleteBook: bookId', bookId);
    const bookRef = doc(this.firestore, 'books', bookId);
    return deleteDoc(bookRef);
  }
} 