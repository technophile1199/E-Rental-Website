import { Order } from './order.model';

export interface Roles {
  admin: boolean;
  Seller: boolean;
}

export class User {
  public email: string;
  public roles?: Roles;
  public displayName?: string;
  public photoURL?: string;
  public phoneNumber?: Number;
  public PhoneNumber?: string;
  public firstName?: string;
  public lastName?: string;
  public password?: string;
  public confirmPassword?: string;
  public uid?: string;

  constructor(authData) {
    this.email = authData.email;
    this.firstName = authData.firstName ? authData.firstName : '';
    this.lastName = authData.lastName ? authData.lastName : '';
    this.roles = {
      admin: false,
      Seller: false,
    };
  }
}
