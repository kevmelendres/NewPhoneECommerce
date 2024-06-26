export interface IEditProduct {
  id: number;
  brand: string | null;
  color: string | null;
  description: string | null;
  deviceOS: string | null;
  image: string | null;
  model: string | null;
  previousOwnerFirstName: string | null;
  previousOwnerLastName: string | null;
  price: number | null;
  releaseDate: number | null;
  seller: string | null;
  rating: number | null;
  discount: number | null;
  availableStocks: number | null;
  soldItems: number | null;
  discountedPrice: number | null;
}
