export interface IOrderItemDetailed {
  orderId: number;
  quantity: number;
  orderItemId: number;
  productId: number;
  brand: string;
  model: string;
  deviceOS: string;
  releaseDate: number;
  price: number;
  color: string;
  description: string;
  image: string;
  seller: string;
  previousOwner: string;
  rating: number;
  discount: number;
  availableStocks: number;
  soldItems: number;
  discountedPrice: number;
}
