import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BorrowService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  requestBorrow(bookId: string, ownerId: string): Promise<any> {
    return addDoc(collection(this.firestore, 'borrowRequests'), {
      bookId,
      ownerId,
      requesterId: this.auth.currentUser?.uid,
      status: 'pending',
      requestedAt: new Date()
    });
  }

  getRequestsForBook(bookId: string): Observable<any[]> {
    const q = query(collection(this.firestore, 'borrowRequests'), where('bookId', '==', bookId));
    return from(getDocs(q)).pipe(
      // @ts-ignore
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }

  updateRequestStatus(requestId: string, status: 'accepted' | 'rejected' | 'returned'): Promise<void> {
    const requestRef = doc(this.firestore, 'borrowRequests', requestId);
    return updateDoc(requestRef, { status });
  }

  getRequestsByUser(userId: string): Observable<any[]> {
    const q = query(collection(this.firestore, 'borrowRequests'), where('requesterId', '==', userId));
    return from(getDocs(q)).pipe(
      // @ts-ignore
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }
}