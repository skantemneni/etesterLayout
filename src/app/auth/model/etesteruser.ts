import { Usertest } from "../../models/etestermodel.usertest";

export interface LoggedinUser {
  idUser: number;
  username: string;
  password: string;
  authorities: Authority[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  emailAddress: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  permissions: string[];

  tests?: Usertest[];
  profiles?: string[];
  webuser?: string; /* containing extended user attributes - used in programmatically loading users through SoapUI */

  organizationName: string;
  idOrganization: number;
  channels: Channel[];
  subscriptions: Channel[];
}

export interface Authority {
  username: string;
  authority: string;
}

export interface Channel {
  idSystem: number;
  name: string;
  description?: string;
  text?: string;
  addlInfo?: string;
  editable?: number;
  published?: number;
  levels?: null; /* not used in consumption model */
}
