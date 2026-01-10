export interface ILoginUser {
  email: string;
  password: string;
}

export interface IChangePassword {
  old_password: string;
  new_password: string;
}
