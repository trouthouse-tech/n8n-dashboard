export interface AppLayoutBreadcrumb {
  label: string;
  href?: string;
  onSelect?: () => void;
  menuItems?: {
    label: string;
    onSelect: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
  }[];
}

