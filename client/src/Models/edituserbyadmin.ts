import { ICurrentUserProfile } from "./currentuserprofile";

export interface IEditUserByAdmin extends ICurrentUserProfile {
  userRoles: string[] | null | undefined;
}
