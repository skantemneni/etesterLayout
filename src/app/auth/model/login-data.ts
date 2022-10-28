import { LoggedinUser } from "./etesteruser";

export interface LoginDialogData {
  username: string;
  password: string;
  email: string;
  authToken: string;
  loggedinUser?: LoggedinUser;
}

export interface LoginEvent {
  username: string;
  email: string;
  authToken: string;
  loggedinUser?: LoggedinUser;
  isLoggedIn?: boolean;
}
