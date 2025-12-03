export interface NavigationLink {
  name: string;
  href: string;
  children?: NavigationLink[];
}

export const getNavigationLinks = (): NavigationLink[] => {
  return [
    {
      name: 'Home',
      href: '/welcome',
    },
    {
      name: 'Workflows',
      href: '/welcome',
    },
  ];
};

