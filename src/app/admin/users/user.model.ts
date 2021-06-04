export interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
  approved: boolean;
  companyName: string;
  oib: string;
  telephone: string;
  address: string;
  city: string;
  countryCode: string;
  postalCode: string;
  userType: string;
}
