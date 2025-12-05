'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { AppLayoutHeader, type AppLayoutBreadcrumb } from './app-layout-header';
import { getNavigationLinks } from './navigation';
import { AdminSidebar } from './sidebar';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { LayoutBuilderActions } from '@/store/builders';

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: AppLayoutBreadcrumb[];
  onBaseBreadcrumbClick?: () => void;
  baseBreadcrumbOverride?: AppLayoutBreadcrumb;
}

export const AppLayout = ({
  children,
  breadcrumbs = [],
  onBaseBreadcrumbClick,
  baseBreadcrumbOverride,
}: AppLayoutProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isSidebarVisible = !useAppSelector((state) => state.layoutBuilder.isSidebarCollapsed);
  const navigationLinks = useMemo(() => getNavigationLinks(), []);
  
  const activeNavigationLink = useMemo(
    () => navigationLinks.find((link) => link.href === pathname),
    [navigationLinks, pathname],
  );

  const breadcrumbItems = useMemo(() => {
    const baseBreadcrumb = (() => {
      if (baseBreadcrumbOverride) {
        if (onBaseBreadcrumbClick && !baseBreadcrumbOverride.onSelect && !baseBreadcrumbOverride.href) {
          return {
            ...baseBreadcrumbOverride,
            onSelect: onBaseBreadcrumbClick,
          };
        }

        return { ...baseBreadcrumbOverride };
      }

      if (!activeNavigationLink) {
        return null;
      }

      const defaultBreadcrumb: AppLayoutBreadcrumb = {
        label: activeNavigationLink.name,
      };

      if (onBaseBreadcrumbClick) {
        defaultBreadcrumb.onSelect = onBaseBreadcrumbClick;
      } else {
        defaultBreadcrumb.href = activeNavigationLink.href;
      }

      return defaultBreadcrumb;
    })();

    if (!baseBreadcrumb) {
      return breadcrumbs;
    }

    return [baseBreadcrumb, ...breadcrumbs];
  }, [activeNavigationLink, baseBreadcrumbOverride, breadcrumbs, onBaseBreadcrumbClick]);

  const handleToggleSidebar = () => {
    dispatch(LayoutBuilderActions.toggleSidebar());
  };

  return (
    <div className={styles.appShell}>
      <AdminSidebar />
      <div className={styles.mainColumn}>
        <AppLayoutHeader 
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={handleToggleSidebar}
          breadcrumbItems={breadcrumbItems} 
        />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  appShell: `
    flex h-screen overflow-hidden bg-white
  `,
  mainColumn: `
    flex flex-1 flex-col overflow-y-auto
  `,
  content: `
    flex-1 p-3
  `,
};

