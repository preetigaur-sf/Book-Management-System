import {inject} from '@loopback/core';
import {Count,CountSchema,Filter,FilterExcludingWhere,repository,
  Where,} from '@loopback/repository';
import {del,get,getModelSchemaRef,param,patch,post,put,
requestBody,response,} from '@loopback/rest';
import {authorize, logExecution} from '../decorators';
import {Book} from '../models';
import {MessageService} from '../providers';
import {BookRepository} from '../repositories';
import {BookService} from '../services';

export class BookController{
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,

    @inject('services.BookService')
    public bookService: BookService,

    @inject('providers.MessageProvider')
    public messageService: MessageService,
  ) {}

  // CREATE BOOK
  @logExecution()
  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book),
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',
            exclude: ['id'],
          }),
        },
      },
    })
    book: Omit<Book, 'id'>,
  ): Promise<Book> {
    console.log(this.messageService.getMessage());

    // Apply discount using service
    book.price = this.bookService.calculateDiscount(book.price);

    return this.bookRepository.create(book);
  }

  // COUNT BOOKS
  @get('/books/count')
  @response(200, {
    description: 'Book model count',
    content: {
      'application/json': {
        schema: CountSchema,
      },
    },
  })
  async count(@param.where(Book) where?: Where<Book>): Promise<Count> {
    return this.bookRepository.count(where);
  }

  // GET ALL BOOKS
  @get('/books')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(@param.filter(Book) filter?: Filter<Book>): Promise<Book[]> {
    return this.bookRepository.find(filter);
  }

  // UPDATE MULTIPLE BOOKS
  @patch('/books')
  @response(200, {
    description: 'Book PATCH success count',
    content: {
      'application/json': {
        schema: CountSchema,
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            partial: true,
          }),
        },
      },
    })
    book: Book,

    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.bookRepository.updateAll(book, where);
  }

  // GET BOOK BY ID
  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,

    @param.filter(Book, {exclude: 'where'})
    filter?: FilterExcludingWhere<Book>,
  ): Promise<Book> {
    return this.bookRepository.findById(id, filter);
  }

  // UPDATE BOOK BY ID
  @patch('/books/{id}')
  @response(204, {
    description: 'Book PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            partial: true,
          }),
        },
      },
    })
    book: Partial<Book>,
  ): Promise<void> {
    await this.bookRepository.updateById(id, book);
  }

  // REPLACE BOOK BY ID
  @put('/books/{id}')
  @response(204, {
    description: 'Book PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,

    @requestBody()
    book: Book,
  ): Promise<void> {
    await this.bookRepository.replaceById(id, book);
  }

  // DELETE BOOK BY ID
  @authorize('admin')
  @del('/books/{id}')
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bookRepository.deleteById(id);
  }
}
