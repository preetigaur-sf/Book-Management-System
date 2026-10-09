import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({ providedIn: 'root' })
export class BookService {

  private api = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.api);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.api}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.api, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.api}/${id}`, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}