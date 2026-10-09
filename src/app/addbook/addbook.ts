import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from '../service/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addbook',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './addbook.html',
})
export class Addbook {

  book = {
    title: '',
    author: '',
    isbn: '',
    publication_date: '',
    genre: '',
    price: 0,
  };

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  addBook() {

    if (!(this.book.isbn.length === 10 || this.book.isbn.length === 13)) {
      alert('ISBN must be 10 or 13 digits');
      return;
    }

    this.bookService.addBook(this.book).subscribe(() => {
      alert('Book Added Successfully');
      this.router.navigate(['/booklist']);
    });
  }
}