import { IOrderItemDetailed } from "./orderitemdetailed";

export interface IOrderDetailed {
  buyerEmail: string;
  firstName: string;
  lastName: string;
  addressCountry: string;
  addressRegion: string;
  addressProvince: string;
  addressMunicipality: string;
  addressBarangay: string;
  addressZipCode: number;
  addressStreet: string;
  deliveryMethod: string;
  deliveryMethodId: number;
  deliveryMethodPrice: number;
  deliveryMethodDays: number;
  subtotal: number;
  orderId: number;
  orderStatus: string;
  orderItems: IOrderItemDetailed[];
  orderDate: string;
}
