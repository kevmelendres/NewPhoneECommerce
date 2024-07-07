export interface IAddNewProduct {
  brand: string | null;
  model: string | null;
  deviceOS: string | null;
  releaseDate: number | null;
  price: number | null;
  color: string | null;
  description: string | null;
  image: string | null;
  seller: string | null;
  previousOwnerFirstName: string | null;
  previousOwnerLastName: string | null;
  rating: number | null;
  discount: number | null;
  availableStocks: number | null;
  soldItems: number | null;
}
