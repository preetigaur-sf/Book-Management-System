export interface ProductReview {
  id: number;
  rating: number;
  comment?: string;
  user_id: number;
  product_id: number;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
  };
}