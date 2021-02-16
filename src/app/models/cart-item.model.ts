import { Product } from './product.model';

export class CartItem {
  constructor(
    public product: Product = null,
    public amount: number = null,
    public number: string = '',
    public date: string = new Date().toISOString().split('T')[0]
    ) {}
}
