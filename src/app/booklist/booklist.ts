import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../service/book.service';
import { IsbnPipe } from '../pipe/isbn.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IsbnPipe],
  templateUrl: './booklist.html'
})
export class Booklist implements OnInit {

  books: any[] = [];
  editBook: any = null;

  constructor(private bookservice: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookservice.getBooks().subscribe(data => {
      this.books = data;
    });
  }

  deleteBook(id: number) {
    this.bookservice.deleteBook(id).subscribe(() => {
      this.loadBooks();
    });
  }

  startEdit(book: any) {
    this.editBook = { ...book };
  }

  updateBook() {
    this.bookservice.updateBook(this.editBook.id, this.editBook).subscribe(() => {
      this.editBook = null;
      this.loadBooks();
    });
  }

  cancelEdit() {
    this.editBook = null;
  }
}