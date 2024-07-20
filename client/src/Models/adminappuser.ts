export interface IAdminAppUser {
  id: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  municipality: string;
  province: string;
  region: string;
  street: string;
  barangay: string;
  zipCode: string;
  userRoles: string[];
}
