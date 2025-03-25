export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  websites: Website[];
  domains: Domain[];
  emailAccounts: EmailAccount[];
}

export interface Website {
  id: string;
  url: string;
  loginUrl: string;
  username: string;
  password: string;
  expiryDate: Date;
  renewalCharge: number;
}

export interface Domain {
  id: string;
  name: string;
  registrar: string;
  expiryDate: Date;
  autoRenewal: boolean;
  renewalCharge: number;
}

export interface EmailAccount {
  id: string;
  email: string;
  password: string;
  server: string;
  port: number;
} 