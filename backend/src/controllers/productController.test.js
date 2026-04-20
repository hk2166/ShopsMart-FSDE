import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import { productController } from './productController.js';
import * as productServiceModule from '../services/productService.js';

const app = express();
app.use(express.json());

// Setup routes
app.get('/api/products', productController.getAllProducts);

describe('Product Controller - Cache-Control Headers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/products should set Cache-Control header to public, max-age=60', async () => {
    // Mock the service response
    productServiceModule.productService.getAllProducts = jest.fn().mockResolvedValue({
      products: [],
      total: 0,
      page: 1,
      totalPages: 0
    });

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('public, max-age=60');
  });

  test('GET /api/products with filters should set Cache-Control header', async () => {
    // Mock the service response
    productServiceModule.productService.getAllProducts = jest.fn().mockResolvedValue({
      products: [{ id: 1, name: 'Test Product' }],
      total: 1,
      page: 1,
      totalPages: 1
    });

    const response = await request(app)
      .get('/api/products')
      .query({ category: 'bikes', minPrice: 100 });

    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('public, max-age=60');
  });
});
