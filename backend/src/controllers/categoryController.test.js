import request from 'supertest';
import express from 'express';
import { categoryController } from './categoryController.js';
import { categoryService } from '../services/categoryService.js';

// Mock the category service
jest.mock('../services/categoryService.js');

const app = express();
app.use(express.json());

// Setup routes
app.get('/api/categories', categoryController.getAllCategories);

describe('Category Controller - Cache-Control Headers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/categories should set Cache-Control header to public, max-age=60', async () => {
    // Mock the service response
    categoryService.getAllCategories.mockResolvedValue([
      { id: 1, name: 'Bikes' },
      { id: 2, name: 'Accessories' }
    ]);

    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('public, max-age=60');
  });
});
