import { Brand } from "./brand";
import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  sku: string;
  image_url: string;
  category_id: number;
  brand_id: number;

  brand? :Brand;
category?: Category;
}