import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BookListComponent } from './components/book-list.component/book-list.component';
import { AddBookComponent } from './components/add-book.component/add-book.component';
import { RequestManagementComponent } from './components/request-management.component/request-management.component';
import { MyBooksComponent } from './components/my-books.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BookListComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'manage-requests', component: RequestManagementComponent },
  { path: 'my-books', component: MyBooksComponent },
  { path: '', redirectTo: '/books', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }