import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BookService', () => {
  let service: BookService;
  let httpMockTest: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(BookService);
    httpMockTest = TestBed.inject(HttpTestingController);
  });

  it('should fetch books', () => {
    const mockBooks = [
      { id: 1, title: 'Test Book', author: 'ABC', isbn: '123', publication_date: '2020-01-01', genre: 'Fiction', price: 100 }
    ];

    service.getBooks().subscribe((books) => {
      expect(books.length).toBe(1);
      expect(books).toEqual(mockBooks);
    });

    const req = httpMockTest.expectOne('http://localhost:3000/books');
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);
  });

  it('should add a book',()=>{
    const mockBookTest = { id: 1,title: 'Test Book A',author:'xyz',isbn:'123456789987654', publication_date:'2003-12-29',genre:'Non-Fiction',price:220};
  });

  it('should delete a book',()=>{
    const bookId = 2;
    service.deletebook(bookId).subscribe();
    const request = httpMockTest.expectOne(`http://localhost:3000/books/${bookId}`)
  });


});