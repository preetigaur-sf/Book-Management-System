import {repository} from '@loopback/repository';
import {Book} from '../models';
import {BookRepository} from '../repositories/book.repository';

export class BookService {
  constructor(
    @repository(BookRepository)
    private bookRepository: BookRepository,
  ) {}

  calculateDiscount(price: number): number {
    if (!price || price <= 0) return 0;

    if (price > 1000) {
      return price * 0.9;
    }

    return price;
  }

  async createBook(book: Book): Promise<Book> {
    const discountPrice = this.calculateDiscount(book.price);

    const finalBook = {
      ...book,
      price: discountPrice,
    };

    return this.bookRepository.create(finalBook);
  }

  async getBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async getBookById(id: number): Promise<Book> {
    return this.bookRepository.findById(id);
  }

  async updateBook(id: number, book: Partial<Book>): Promise<Book> {
    await this.bookRepository.updateById(id, book);
    return this.bookRepository.findById(id);
  }

  async deleteBook(id: number): Promise<void> {
    await this.bookRepository.deleteById(id);
  }
}
