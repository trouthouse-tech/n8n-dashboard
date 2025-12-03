export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Marketing & Advertising',
  'Consulting',
  'Non-Profit',
  'Government',
  'Other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const isOtherIndustry = (industry: string): boolean => {
  return industry === 'Other';
};

