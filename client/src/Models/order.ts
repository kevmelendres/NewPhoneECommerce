export interface IOrder {
  buyerEmail: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  addressCountry: string | null | undefined;
  addressRegion: string | null | undefined;
  addressProvince: string | null | undefined;
  addressMunicipality: string | null | undefined;
  addressBarangay: string | null | undefined;
  addressZipCode: number | undefined;
  addressStreet: string | null | undefined;

  deliveryMethodId: number;
  subtotal: number;
}
