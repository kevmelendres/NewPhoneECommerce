export interface ICurrentUserProfile {
  displayName: string | null | undefined;
  email: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  municipality: string | null | undefined;
  province: string | null | undefined;
  region: string | null | undefined;
  street: string | null | undefined;
  zipcode: string | null | undefined;
  barangay: string | null | undefined;
}

export interface ICurrentUserProfileC {
  DisplayName: string | null | undefined;
  Email: string | null | undefined;
  FirstName: string | null | undefined;
  LastName: string | null | undefined;
  Municipality: string | null | undefined;
  Province: string | null | undefined;
  Region: string | null | undefined;
  Street: string | null | undefined;
  Zipcode: number;
  Barangay: string | null | undefined;
}
