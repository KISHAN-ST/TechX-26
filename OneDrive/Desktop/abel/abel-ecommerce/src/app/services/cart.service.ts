import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, Product, Order, CustomerInfo } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = {
    items: [],
    total: 0,
    itemCount: 0
  };

  private cartSubject = new BehaviorSubject<Cart>(this.cart);
  public cart$ = this.cartSubject.asObservable();

  private orders: Order[] = [];

  constructor() {
    this.loadCart();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.product.price;
    } else {
      const cartItem: CartItem = {
        product,
        quantity,
        subtotal: product.price * quantity
      };
      this.cart.items.push(cartItem);
    }

    this.updateCart();
  }

  removeFromCart(productId: string): void {
    this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.items.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.product.price;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cart.items = [];
    this.updateCart();
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  getCartItems(): CartItem[] {
    return this.cart.items;
  }

  getCartTotal(): number {
    return this.cart.total;
  }

  getItemCount(): number {
    return this.cart.itemCount;
  }

  private updateCart(): void {
    this.cart.itemCount = this.cart.items.reduce((count, item) => count + item.quantity, 0);
    this.cart.total = this.cart.items.reduce((total, item) => total + item.subtotal, 0);
    this.cartSubject.next({ ...this.cart });
    this.saveCart();
  }

  private saveCart(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  private loadCart(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
        this.cartSubject.next(this.cart);
      }
    }
  }

  checkout(customerInfo: CustomerInfo): Observable<Order> {
    return new Observable(observer => {
      const order: Order = {
        id: 'ORD-' + Date.now(),
        items: [...this.cart.items],
        total: this.cart.total,
        customer: customerInfo,
        status: 'pending',
        createdDate: new Date()
      };

      this.orders.push(order);
      this.clearCart();
      observer.next(order);
      observer.complete();
    });
  }

  getOrders(): Order[] {
    return this.orders;
  }
}
