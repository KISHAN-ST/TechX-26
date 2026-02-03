import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightDiscount]',
  standalone: true
})
export class HighlightDiscountDirective implements OnInit {
  @Input() appHighlightDiscount: number | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appHighlightDiscount && this.appHighlightDiscount >= 20) {
      this.el.nativeElement.style.backgroundColor = '#fff3cd';
      this.el.nativeElement.style.border = '2px solid #ffc107';
      this.el.nativeElement.style.borderRadius = '8px';
      this.el.nativeElement.style.padding = '12px';
    }
  }
}

@Directive({
  selector: '[appOutOfStock]',
  standalone: true
})
export class OutOfStockDirective implements OnInit {
  @Input() appOutOfStock: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appOutOfStock) {
      this.el.nativeElement.style.opacity = '0.6';
      this.el.nativeElement.style.pointerEvents = 'none';
      const badge = document.createElement('div');
      badge.style.position = 'absolute';
      badge.style.top = '10px';
      badge.style.right = '10px';
      badge.style.backgroundColor = '#dc3545';
      badge.style.color = 'white';
      badge.style.padding = '4px 8px';
      badge.style.borderRadius = '4px';
      badge.style.fontSize = '12px';
      badge.style.fontWeight = 'bold';
      badge.textContent = 'OUT OF STOCK';
      this.el.nativeElement.style.position = 'relative';
      this.el.nativeElement.appendChild(badge);
    }
  }
}

@Directive({
  selector: '[appPriceHighlight]',
  standalone: true
})
export class PriceHighlightDirective implements OnInit {
  @Input() appPriceHighlight: number | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appPriceHighlight && this.appPriceHighlight >= 500) {
      this.el.nativeElement.style.color = '#0d6efd';
      this.el.nativeElement.style.fontWeight = 'bold';
      this.el.nativeElement.style.fontSize = '1.1em';
    }
  }
}
