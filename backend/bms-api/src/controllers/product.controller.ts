import {Count, CountSchema, Getter, repository, Where} from '@loopback/repository';

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
import {Product, User} from '../models';
import {ProductRepository} from '../repositories';
import {authenticate, AuthenticationBindings, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';
import { inject } from '@loopback/core';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
      @inject.getter(AuthenticationBindings.CURRENT_USER)
  private readonly getCurrentUser: Getter<User>,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateProduct],
  })
  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product),
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productRepository.create(product);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadProduct],
  })
  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {
      'application/json': {
        schema: CountSchema,
      },
    },
  })
  async count(@param.where(Product) where?: Where<Product>): Promise<Count> {
    return this.productRepository.count(where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadProduct],
  })
  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(): Promise<Product[]> {


    const user = await this.getCurrentUser();
    console.log(['printing current user'])
    console.log(user);
    return this.productRepository.find({
      include: [
        {
          relation: 'brand',
        },
        {
          relation: 'category',
        },
      ],
    });
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateProduct],
  })
  @patch('/products')
  @response(200, {
    description: 'Product PATCH success count',
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
          schema: getModelSchemaRef(Product, {
            partial: true,
          }),
        },
      },
    })
    product: Product,
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadProduct],
  })
  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Product> {
    return this.productRepository.findById(id, {
      include: [
        {
          relation: 'brand',
        },
        {
          relation: 'category',
        },
      ],
    });
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateProduct],
  })
  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            partial: true,
          }),
        },
      },
    })
    product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateProduct],
  })
  @put('/products/{id}')
  @response(204, {
    description: 'Product PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteProduct],
  })
  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
