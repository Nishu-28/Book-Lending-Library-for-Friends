import { Component } from '@angular/core';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
})
export class AddBookComponent {
  title: string = '';
  author: string = '';
  description: string = '';
  
  constructor(private booksService: BooksService) {}
  
  onSubmit() {
    this.booksService.addBook(this.title, this.author, this.description);
    this.title = '';
    this.author = '';
    this.description = '';
  }
}