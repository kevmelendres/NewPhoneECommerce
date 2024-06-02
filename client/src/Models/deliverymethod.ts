export interface IDeliveryMethod {
  name: string;
  deliveryDays: number;
  description: string;
  price: number;
  id?: number;
}
