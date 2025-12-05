export interface NavigationLink {
  name: string;
  href: string;
  children?: NavigationLink[];
}

export const getNavigationLinks = (): NavigationLink[] => {
  return [
    {
      name: 'Welcome',
      href: '/welcome',
    },
    {
      name: 'Workflows',
      href: '/workflows',
    },
  ];
};

