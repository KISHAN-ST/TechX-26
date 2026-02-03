import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Product, Category } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FilterByCategoryPipe, SearchProductsPipe, InStockPipe } from '../../pipes/product.pipe';
import { HighlightDiscountDirective, OutOfStockDirective, PriceHighlightDirective } from '../../directives/product.directive';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    FilterByCategoryPipe,
    SearchProductsPipe,
    InStockPipe,
    HighlightDiscountDirective,
    OutOfStockDirective,
    PriceHighlightDirective
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = 'all';
  searchTerm = '';
  inStockOnly = false;
  cols = 4;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productService.products$.subscribe(products => {
      this.products = products;
    });

    this.productService.categories$.subscribe(categories => {
      this.categories = categories;
    });

    this.updateGridCols();
    window.addEventListener('resize', () => this.updateGridCols());
  }

  updateGridCols(): void {
    const width = window.innerWidth;
    if (width < 600) {
      this.cols = 1;
    } else if (width < 900) {
      this.cols = 2;
    } else if (width < 1200) {
      this.cols = 3;
    } else {
      this.cols = 4;
    }
  }

  addToCart(product: Product): void {
    if (product.inStock) {
      this.cartService.addToCart(product, 1);
      this.snackBar.open(`${product.name} added to cart!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }

  resetFilters(): void {
    this.selectedCategory = 'all';
    this.searchTerm = '';
    this.inStockOnly = false;
  }

  getDiscountedProducts(): Product[] {
    return this.products.filter(p => p.discount && p.discount >= 20);
  }
}
