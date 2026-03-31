import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBook } from './addbook';
import { ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../service/book.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddBook', () => {
  
  let component: AddBook;
  let fixture: ComponentFixture<AddBook>;
  let serviceSpy: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('BookService', ['addbook']);

    await TestBed.configureTestingModule({
      imports: [AddBook, ReactiveFormsModule],
      providers: [{ provide: BookService, useValue: serviceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addbook() on submit', () => {
    const mockTestBook = {
      title: 'Test',
      author: 'ABC',
      isbn: '1234567890',
      publication_date: '2020-01-01',
      genre: 'Fiction',
      price: 100
    };

    component.bookForm.setValue(mockTestBook);
    serviceSpy.addbook.and.returnValue(of(mockTestBook));

    component.addbook();

    expect(serviceSpy.addbook).toHaveBeenCalled();
  });

  
  


  
});