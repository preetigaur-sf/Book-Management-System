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

import {Brand} from '../models';
import {BrandRepository} from '../repositories';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';

export class BrandController {
  constructor(
    @repository(BrandRepository)
    public brandRepository: BrandRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateBrand],
  })
  @post('/brands')
  @response(200, {
    description: 'Brand model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Brand),
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {
            title: 'NewBrand',
            exclude: ['id'],
          }),
        },
      },
    })
    brand: Omit<Brand, 'id'>,
  ): Promise<Brand> {
    return this.brandRepository.create(brand);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadBrand],
  })
  @get('/brands/count')
  @response(200, {
    description: 'Brand model count',
    content: {
      'application/json': {
        schema: CountSchema,
      },
    },
  })
  async count(@param.where(Brand) where?: Where<Brand>): Promise<Count> {
    return this.brandRepository.count(where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadBrand],
  })
  @get('/brands')
  @response(200, {
    description: 'Array of Brand model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Brand, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(@param.filter(Brand) filter?: Filter<Brand>): Promise<Brand[]> {
    return this.brandRepository.find(filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateBrand],
  })
  @patch('/brands')
  @response(200, {
    description: 'Brand PATCH success count',
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
          schema: getModelSchemaRef(Brand, {
            partial: true,
          }),
        },
      },
    })
    brand: Brand,
    @param.where(Brand) where?: Where<Brand>,
  ): Promise<Count> {
    return this.brandRepository.updateAll(brand, where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadBrand],
  })
  @get('/brands/{id}')
  @response(200, {
    description: 'Brand model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Brand, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Brand, {
      exclude: 'where',
    })
    filter?: FilterExcludingWhere<Brand>,
  ): Promise<Brand> {
    return this.brandRepository.findById(id, filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateBrand],
  })
  @patch('/brands/{id}')
  @response(204, {
    description: 'Brand PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {
            partial: true,
          }),
        },
      },
    })
    brand: Brand,
  ): Promise<void> {
    await this.brandRepository.updateById(id, brand);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateBrand],
  })
  @put('/brands/{id}')
  @response(204, {
    description: 'Brand PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() brand: Brand,
  ): Promise<void> {
    await this.brandRepository.replaceById(id, brand);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteBrand],
  })
  @del('/brands/{id}')
  @response(204, {
    description: 'Brand DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.brandRepository.deleteById(id);
  }
}
