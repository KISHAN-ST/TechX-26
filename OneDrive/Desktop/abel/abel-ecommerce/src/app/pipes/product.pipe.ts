import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product.model';

@Pipe({
  name: 'filterByCategory',
  standalone: true
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(products: Product[], categoryId: string): Product[] {
    if (!categoryId || categoryId === 'all') {
      return products;
    }
    return products.filter(product => product.category === categoryId);
  }
}

@Pipe({
  name: 'searchProducts',
  standalone: true
})
export class SearchProductsPipe implements PipeTransform {
  transform(products: Product[], searchTerm: string): Product[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return products;
    }
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  }
}

@Pipe({
  name: 'inStock',
  standalone: true
})
export class InStockPipe implements PipeTransform {
  transform(products: Product[], inStockOnly: boolean): Product[] {
    if (!inStockOnly) {
      return products;
    }
    return products.filter(product => product.inStock);
  }
}
