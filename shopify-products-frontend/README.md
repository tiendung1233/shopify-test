# Shopify Products Application

A modern web application that displays products from a Shopify store with features:

- Display product list with images, prices, and inventory
- Sort products by price (ascending/descending)
- Pagination and load more functionality
- Responsive design

## Project Structure

The project consists of two parts:

- Backend (server): Node.js + Express + TypeScript
- Frontend: React + Vite + TypeScript

## System Requirements

- Node.js (version 18 or higher)
- Yarn or npm
- Shopify store and API credentials

## Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd shopify-products
```

### 2. Backend Setup

```bash
cd server
yarn install
```

Create a `.env` file in the `server` directory with the following content:

```env
PORT=3000
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SHOP=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token
```

### 3. Frontend Setup

```bash
cd ../shopify-products-frontend
yarn install
```

Create a `.env` file in the `shopify-products-frontend` directory with the following content:

```env
VITE_API_URL=http://localhost:3000
```

## Running the Application

### 1. Start Backend

```bash
cd server
yarn dev
```

The server will run at http://localhost:3000

### 2. Start Frontend

```bash
cd shopify-products-frontend
yarn dev
```

The application will run at http://localhost:5173

## Available Scripts

### Backend

- `yarn dev`: Run server in development mode with hot-reload
- `yarn build`: Build TypeScript to JavaScript
- `yarn start`: Run server in production mode

### Frontend

- `yarn dev`: Run application in development mode
- `yarn build`: Build application for production
- `yarn preview`: Preview production build

## API Endpoints

### GET /api/products

Get list of products with query parameters:

- `sort`: Sort field (default: 'price')
- `direction`: Sort direction ('asc' or 'desc', default: 'asc')
- `limit`: Products per page (default: 12)
- `page`: Page number (default: 1)
- `cursor`: Cursor for pagination

Response:

```json
{
  "products": [
    {
      "id": number,
      "title": string,
      "handle": string,
      "image": string | null,
      "price": number,
      "inventory_quantity": number,
      "created_at": string,
      "updated_at": string
    }
  ],
  "pagination": {
    "has_next_page": boolean,
    "next_cursor": string | null,
    "total_products": number,
    "current_page": number,
    "total_pages": number
  }
}
```

## Troubleshooting

1. If you encounter CORS errors:

   - Verify the URL in frontend `.env` file matches the backend URL
   - Ensure the backend server is running and accessible

2. If products are not loading:

   - Check Shopify API credentials in backend `.env` file
   - Verify access token has products read permission
   - Check browser console and server terminal for detailed errors

3. If you encounter TypeScript errors:
   - Run `yarn install` to reinstall dependencies
   - Delete `node_modules` directory and `yarn.lock` file, then run `yarn install` again

## Development Notes

- The backend uses cursor-based pagination for better performance
- Frontend implements infinite scroll with load more button
- All API responses are typed with TypeScript interfaces
- The application uses modern React practices with hooks and functional components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
