import { Industry } from './industry';

export interface User {
  id: string; // Same as authUser.uid
  email: string;
  name: string;
  companyName: string;
  industry: Industry | '';
  industryOther: string; // Required when industry is 'Other'
  createdAt: string;
  updatedAt: string;
}

export const createEmptyUser = (): User => ({
  id: '',
  email: '',
  name: '',
  companyName: '',
  industry: '',
  industryOther: '',
  createdAt: '',
  updatedAt: '',
});

