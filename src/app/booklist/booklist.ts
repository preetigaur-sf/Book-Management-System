import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../service/book.service';
import { Router } from '@angular/router';
import { Book } from '../models/book';

@Component({
  selector: 'app-booklist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booklist.html',
})
export class Booklist {
  books: Book[] = [];

  constructor(
    private bookservice: BookService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookservice.getBooks().subscribe((data) => {
      console.log('DATA:', data);
      this.books = data;
    });
  }

  deletebook(id: number) {
    this.bookservice.deletebook(id).subscribe(() => {
      this.loadBooks();
    });
  }

  editbook(id: number) {
    this.router.navigate(['/editbook', id]);
  }
}
