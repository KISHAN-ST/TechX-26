import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = this.getMockProducts();
  private categories: Category[] = this.getMockCategories();
  
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  public products$ = this.productsSubject.asObservable();
  
  private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {}

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return new Observable(observer => {
      const product = this.products.find(p => p.id === id);
      observer.next(product);
      observer.complete();
    });
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return new Observable(observer => {
      const filtered = this.products.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase()) ||
        p.description.toLowerCase().includes(keyword.toLowerCase())
      );
      observer.next(filtered);
      observer.complete();
    });
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return new Observable(observer => {
      const filtered = this.products.filter(p => p.category === categoryId);
      observer.next(filtered);
      observer.complete();
    });
  }

  private getMockCategories(): Category[] {
    return [
      { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets' },
      { id: '2', name: 'Clothing', description: 'Fashion and apparel' },
      { id: '3', name: 'Books', description: 'Physical and digital books' },
      { id: '4', name: 'Home & Kitchen', description: 'Home appliances and kitchen tools' },
      { id: '5', name: 'Sports', description: 'Sports equipment and gear' }
    ];
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
        price: 199.99,
        originalPrice: 299.99,
        category: '1',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 50,
        rating: 4.8,
        reviews: 245,
        discount: 33,
        releaseDate: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Ultra-Slim Laptop',
        description: '15-inch laptop with Intel i7, 16GB RAM, 512GB SSD, perfect for professionals',
        price: 899.99,
        originalPrice: 1199.99,
        category: '1',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 25,
        rating: 4.9,
        reviews: 156,
        discount: 25,
        releaseDate: new Date('2024-02-20')
      },
      {
        id: '3',
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery',
        price: 299.99,
        originalPrice: 399.99,
        category: '1',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 40,
        rating: 4.6,
        reviews: 189,
        discount: 25,
        releaseDate: new Date('2024-01-08')
      },
      {
        id: '4',
        name: 'Cotton T-Shirt Pack',
        description: 'Set of 3 premium cotton t-shirts in various colors, comfortable and durable',
        price: 49.99,
        originalPrice: 69.99,
        category: '2',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 100,
        rating: 4.5,
        reviews: 98,
        discount: 29,
        releaseDate: new Date('2024-03-01')
      },
      {
        id: '5',
        name: 'Professional Camera',
        description: '24MP mirrorless camera with 4K video recording and advanced autofocus',
        price: 1299.99,
        originalPrice: 1699.99,
        category: '1',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
        inStock: false,
        quantity: 0,
        rating: 4.9,
        reviews: 342,
        discount: 24,
        releaseDate: new Date('2023-11-10')
      },
      {
        id: '6',
        name: 'The Art of Web Design',
        description: 'Comprehensive guide to modern web design principles and best practices',
        price: 34.99,
        category: '3',
        image: 'https://images.unsplash.com/photo-1507842072343-583f20270319?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 35,
        rating: 4.7,
        reviews: 67,
        releaseDate: new Date('2023-09-20')
      },
      {
        id: '7',
        name: 'Stainless Steel Cookware Set',
        description: '10-piece cookware set with non-stick coating and heat-resistant handles',
        price: 89.99,
        originalPrice: 149.99,
        category: '4',
        image: 'https://images.unsplash.com/photo-1584568694244-14fbbc83bd30?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 28,
        rating: 4.4,
        reviews: 145,
        discount: 40,
        releaseDate: new Date('2024-02-14')
      },
      {
        id: '8',
        name: 'Fitness Yoga Mat',
        description: 'Premium non-slip yoga mat with carrying strap, 6mm thickness',
        price: 29.99,
        originalPrice: 49.99,
        category: '5',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 55,
        rating: 4.6,
        reviews: 112,
        discount: 40,
        releaseDate: new Date('2024-01-25')
      },
      {
        id: '9',
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof speaker with 360-degree sound and 12-hour battery life',
        price: 79.99,
        originalPrice: 129.99,
        category: '1',
        image: 'https://images.unsplash.com/photo-1589003077984-894e133814c9?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 42,
        rating: 4.7,
        reviews: 223,
        discount: 38,
        releaseDate: new Date('2024-03-05')
      },
      {
        id: '10',
        name: 'Running Shoes Deluxe',
        description: 'Lightweight running shoes with superior cushioning and breathable mesh',
        price: 129.99,
        originalPrice: 179.99,
        category: '5',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        inStock: true,
        quantity: 60,
        rating: 4.8,
        reviews: 287,
        discount: 28,
        releaseDate: new Date('2024-02-01')
      }
    ];
  }
}
