import dotenv from 'dotenv';
dotenv.config();
import { Session } from '@shopify/shopify-api';
import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  shopifyApi,
  LATEST_API_VERSION,
} from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: ['read_products'],
  hostName: (process.env.SHOPIFY_SHOP || '').replace(/https?:\/\//, ''),
  isCustomStoreApp: true,
  isEmbeddedApp: false,
  adminApiAccessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: LATEST_API_VERSION,
});
interface ProductVariant {
  price: string;
  inventory_quantity: number;
}

interface Product {
  id: number;
  title: string;
  handle: string;
  images: { src: string }[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

interface CustomProduct {
  id: number;
  title: string;
  handle: string;
  image: string | null;
  price: number;
  inventory_quantity: number;
  created_at: string;
  updated_at: string;
}

interface ProductQuery extends Request {
  query: {
    sort?: string;
    direction?: 'asc' | 'desc';
    limit?: string;
    page?: string;
    cursor?: string;
  }
}

app.get('/api/products', async (req: ProductQuery, res: Response) => {
  try {
    const {
      sort = 'price',
      direction = 'asc',
      limit = '12',
      page = '1',
      cursor = null
    } = req.query;
    const session = new Session({
      id: 'offline_' + (process.env.SHOPIFY_SHOP || ''),
      shop: process.env.SHOPIFY_SHOP || '',
      state: 'dummy',
      isOnline: false,
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
    });
    const client = new shopify.clients.Rest({ session });

    const queryParams: Record<string, any> = {
      limit: parseInt(limit),
      fields: 'id,title,handle,images,variants,created_at,updated_at',
    };

    if (cursor) {
      queryParams.page_info = cursor;
    } else {
      queryParams.status = 'active';
    }

    const response = await client.get({ path: 'products', query: queryParams });

    const rawProducts = (response.body as any).products as Product[];

    let products: CustomProduct[] = rawProducts
      .filter(product => product.variants.some(v => v.inventory_quantity > 0))
      .map(product => {
        const prices = product.variants.map(v => parseFloat(v.price));
        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.images[0]?.src || null,
          price: Math.min(...prices),
          inventory_quantity: product.variants.reduce((sum, v) => sum + v.inventory_quantity, 0),
          created_at: product.created_at,
          updated_at: product.updated_at
        };
      });

    products.sort((a, b) => {
      return direction === 'asc' ? a.price - b.price : b.price - a.price;
    });

    res.json({
      products,
      pagination: {
        has_next_page: response.pageInfo?.nextPage ? true : false,
        next_cursor: response.pageInfo?.nextPage?.query?.page_info || null,
        total_products: products.length,
        current_page: parseInt(page),
        total_pages: Math.ceil(products.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
