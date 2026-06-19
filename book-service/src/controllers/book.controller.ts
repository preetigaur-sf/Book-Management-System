import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';

import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';

import {Book} from '../models';
import {
  BookRepository,
  AuthorRepository,
  CategoryRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {BookSubject} from '../observers/book.subject';
import { LoggerObserver } from '../observers/logger.observer';
import { title } from 'process';

export class BookController {
  private booksubject = new BookSubject();
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,

    @repository(AuthorRepository)
    public authorRepository: AuthorRepository,

    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {
    this.booksubject.subscribe(new LoggerObserver(),);
  }

  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'title',
              'isbn',
              'publication_date',
              'price',
              'author',
              'category',
            ],
            properties: {
              title: {type: 'string'},
              isbn: {type: 'string'},
              publication_date: {type: 'string'},
              price: {type: 'number'},
              author: {type: 'string'},
              category: {type: 'string'},
            },
          },
        },
      },
    })
    book: any,
  ): Promise<Book> {
    let authorId: number;
    let categoryId: number;

    const existingAuthor = await this.authorRepository.findOne({
      where: {
        name: book.author,
      },
    });

    if (existingAuthor) {
      authorId = existingAuthor.id!;
    } else {
      const newAuthor = await this.authorRepository.create({
        name: book.author,
      });

      authorId = newAuthor.id!;
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: book.category,
      },
    });

    if (existingCategory) {
      categoryId = existingCategory.id!;
    } else {
      const newCategory = await this.categoryRepository.create({
        name: book.category,
      });

      categoryId = newCategory.id!;
    }

    this.booksubject.notify(`Book Added Successfully ${book.title}`);
    return this.bookRepository.create({
      title: book.title,
      isbn: book.isbn,
      publication_date: new Date(book.publication_date),
      price: book.price,
      authorId,
      categoryId,
    });
  }

  @get('/books/count')
  @response(200, {
    description: 'Book model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Book) where?: Where<Book>): Promise<Count> {
    this.booksubject.notify(`Book Counted Successfully`);
    return this.bookRepository.count(where);
  }

  @authenticate('jwt')
  @get('/books')
  @response(200, {
    description: 'Books with author and category',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Book) filter?: Filter<Book>): Promise<Book[]> {
    return this.bookRepository.find({
      ...filter,
      include: ['author', 'category'],
    });
  }

  @authenticate('jwt')
  @get('/books/{id}')
  @response(200, {
    description: 'Book with relations',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Book, {exclude: 'where'})
    filter?: FilterExcludingWhere<Book>,
  ): Promise<Book> {
    this.booksubject.notify(`Book Fetched Successfully ${id}`);
    return this.bookRepository.findById(id, {
      ...filter,
      include: ['author', 'category'],
    });
  }

  @patch('/books')
  @response(200, {
    description: 'Book PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Book,
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    this.booksubject.notify(`Book data edited Successfully`);
    return this.bookRepository.updateAll(book, where);
  }

  @authenticate('jwt')
  @patch('/books/{id}')
  @response(204, {
    description: 'Book PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,

    @requestBody()
    book: any,

    @inject(SecurityBindings.USER)
    currentUser: any,
  ): Promise<void> {
    if (currentUser.role !== 'admin') {
      throw new HttpErrors.Forbidden('Only admin can edit books');
    }

    let authorId: number | undefined;
    let categoryId: number | undefined;

    if (book.authorName) {
      const existingAuthor = await this.authorRepository.findOne({
        where: {name: book.authorName},
      });

      if (existingAuthor) {
        authorId = existingAuthor.id!;
      } else {
        const newAuthor = await this.authorRepository.create({
          name: book.authorName,
        });

        authorId = newAuthor.id!;
      }
    }

    if (book.categoryName) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {name: book.categoryName},
      });

      if (existingCategory) {
        categoryId = existingCategory.id!;
      } else {
        const newCategory = await this.categoryRepository.create({
          name: book.categoryName,
        });

        categoryId = newCategory.id!;
      }
    }

    this.booksubject.notify(`Book edited Successfully by ID: ${id}`);
    await this.bookRepository.updateById(id, {
      title: book.title,
      isbn: book.isbn,
      publication_date: new Date(book.publication_date),
      price: book.price,
      ...(authorId && {authorId}),
      ...(categoryId && {categoryId}),
    });
  }

  @authenticate('jwt')
  @put('/books/{id}')
  async replaceById(
    @param.path.number('id') id: number,

    @requestBody()
    book: any,

    @inject(SecurityBindings.USER)
    currentUser: any,
  ): Promise<void> {
    if (currentUser.role !== 'admin') {
      throw new HttpErrors.Forbidden('Only admin can edit books');
    }

    let authorId: number;
    let categoryId: number;

    const existingAuthor = await this.authorRepository.findOne({
      where: {name: book.authorName},
    });

    if (existingAuthor) {
      authorId = existingAuthor.id!;
    } else {
      const newAuthor = await this.authorRepository.create({
        name: book.authorName,
      });

      authorId = newAuthor.id!;
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: {name: book.categoryName},
    });

    if (existingCategory) {
      categoryId = existingCategory.id!;
    } else {
      const newCategory = await this.categoryRepository.create({
        name: book.categoryName,
      });

      categoryId = newCategory.id!;
    }

    this.booksubject.notify(`Book Update Successfully`);
    await this.bookRepository.replaceById(id, {
      id,
      title: book.title,
      isbn: book.isbn,
      publication_date: new Date(book.publication_date),
      price: book.price,
      authorId,
      categoryId,
    });
  }

  @del('/books/{id}')
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    this.booksubject.notify(`Book Deleted Successfully which name is: ${title} `);
    await this.bookRepository.deleteById(id);
  }
}
