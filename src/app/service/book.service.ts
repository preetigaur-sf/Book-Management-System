import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addbook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  deletebook(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updatebook(id: number, book: Book) {
    return this.http.put(`${this.apiUrl}/${id}`, book);
  }
}