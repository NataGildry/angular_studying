import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../models/product';
import { StockValidators } from './stock-inventory.validators';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.css']
})
export class StockInventoryComponent implements OnInit {
  total: number;
  products: Product[] = [
    { id: 1, price: 2800, name: 'MacBook Pro' },
    { id: 2, price: 50, name: 'USB-C Adaptor' },
    { id: 3, price: 400, name: 'iPod' },
    { id: 4, price: 900, name: 'iPhone' },
    { id: 5, price: 600, name: 'Apple Watch' },
  ];

  form = this.fb.group({
    store: this.fb.group({
      branch: ['', [Validators.required, StockValidators.checkBranch]],
      code: ['', Validators.required]
    }),
    selector: this.createStock({}),
    stock: this.fb.array([
      this.createStock({ product_id: 1, quantity: 10 }),
      this.createStock({ product_id: 3, quantity: 50 }),
    ])
  }, { validator: StockValidators.checkStockExists });

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.form.get('stock')
      .valueChanges.subscribe(value => console.log(value));
  }

  createStock(stock): FormGroup {
    return new FormGroup({
      product_id: new FormControl(parseInt(stock.product_id, 10) || ''),
      quantity: new FormControl(stock.quantity || 10)
    });
  }

  onSubmit(): void {
    console.log('Submit:', this.form.value);
  }

  addStock(stock): void {
    const control = this.form.get('stock') as FormArray;
    control.push(this.createStock(stock));
  }

  removeStock({ group, index }: { group: FormGroup, index: number }): void {
    const control = this.form.get('stock') as FormArray;
    control.removeAt(index);
  }
}
