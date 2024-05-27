import { ICurrentUserProfile } from "./currentuserprofile";

export interface IEditCurrentUserProfile extends ICurrentUserProfile {
  password: string | null | undefined;
}
