import { IEditUserByAdmin } from "./edituserbyadmin";

export interface IAddUserByAdmin extends IEditUserByAdmin {
  password: string | undefined;
}
