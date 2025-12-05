'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { getNavigationLinks } from '../navigation';
import type { NavigationLink } from '../navigation';
import { useAuth } from '@/context/auth';
import { useAppSelector } from '@/store/hooks';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const navigationLinks = getNavigationLinks();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const isHidden = useAppSelector((state) => state.layoutBuilder.isSidebarCollapsed);

  // Don't render if sidebar is hidden
  if (isHidden) {
    return null;
  }

  const isLinkActive = (href: string): boolean => {
    return pathname === href;
  };

  const isParentActive = (link: NavigationLink): boolean => {
    if (!link.children) return false;
    return link.children.some((child) => pathname === child.href || pathname.startsWith(child.href + '/'));
  };

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const resolveLinkClassName = (href: string, isChild = false): string => {
    const isActive = isLinkActive(href);
    const baseStyle = isChild ? styles.childMenuButton : styles.menuButton;
    return `${baseStyle} ${isActive ? styles.menuButtonActive : styles.menuButtonInactive}`;
  };

  const renderNavItem = (link: NavigationLink) => {
    const hasChildren = link.children && link.children.length > 0;
    const isExpanded = expandedItems.has(link.name);
    const isParentHighlighted = isParentActive(link);

    if (hasChildren) {
      return (
        <li key={link.href} className={styles.menuItem}>
          <div className={styles.accordionHeader}>
            <Link
              href={link.href}
              className={`${styles.menuButton} ${isParentHighlighted ? styles.menuButtonActive : styles.menuButtonInactive}`}
            >
              <span>{link.name}</span>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleExpanded(link.name);
              }}
              className={styles.chevronButton}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={`${styles.chevronIcon} ${isExpanded ? styles.chevronExpanded : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {isExpanded && (
            <ul className={styles.childMenuList}>
              {link.children!.map((child) => (
                <li key={child.href} className={styles.childMenuItem}>
                  <Link
                    href={child.href}
                    className={resolveLinkClassName(child.href, true)}
                  >
                    <span>{child.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={link.href + link.name} className={styles.menuItem}>
        <Link
          href={link.href}
          className={resolveLinkClassName(link.href)}
        >
          <span>{link.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.logoMark}>N8</div>
          <span className={styles.logoText}>Workflows</span>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.menuList}>
            {navigationLinks.map(renderNavItem)}
          </ul>
        </nav>

        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className={styles.userEmail}>
              {user?.email || 'Unknown'}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: `
    relative flex h-screen w-[160px] flex-col
    border-r border-gray-200 bg-white
    overflow-y-auto
  `,
  inner: `
    flex h-full flex-1 flex-col gap-3 p-3
  `,
  header: `
    flex items-center gap-2 rounded-md bg-gray-50 px-2 py-3
  `,
  logoMark: `
    flex h-8 w-8 items-center justify-center rounded-md
    border border-gray-200 bg-blue-600 text-white font-bold text-sm
  `,
  logoText: `
    font-sans text-sm font-semibold text-gray-800
  `,
  navigation: `
    flex-1 overflow-y-auto
  `,
  menuList: `
    flex flex-col gap-0.5
  `,
  menuItem: `
    group relative
  `,
  accordionHeader: `
    flex items-center justify-between
  `,
  menuButton: `
    flex flex-1 items-center gap-2 rounded-md px-2 py-1.5
    text-xs font-medium text-gray-600
    transition-colors hover:bg-gray-100 hover:text-gray-900
  `,
  menuButtonActive: `
    bg-blue-50 text-blue-700
  `,
  menuButtonInactive: `
    bg-transparent
  `,
  chevronButton: `
    flex items-center justify-center w-6 h-6
    rounded hover:bg-gray-100 transition-colors cursor-pointer
  `,
  chevronIcon: `
    w-3 h-3 text-gray-400 transition-transform duration-200
  `,
  chevronExpanded: `
    rotate-90
  `,
  childMenuList: `
    ml-3 mt-0.5 flex flex-col gap-0.5
    border-l border-gray-200 pl-2
  `,
  childMenuItem: `
    group relative
  `,
  childMenuButton: `
    flex w-full items-center gap-2 rounded-md px-2 py-1
    text-xs font-medium text-gray-500
    transition-colors hover:bg-gray-100 hover:text-gray-900
  `,
  footer: `
    mt-auto pt-3 border-t border-gray-200
    flex flex-col gap-3
  `,
  userInfo: `
    flex items-center gap-2
  `,
  userAvatar: `
    w-8 h-8 rounded-full bg-gray-100
    flex items-center justify-center
    text-xs font-medium text-gray-600
  `,
  userEmail: `
    text-xs text-gray-600 truncate flex-1
  `,
  signOutButton: `
    w-full px-2 py-1.5 rounded-md
    text-xs font-medium text-gray-600
    hover:bg-gray-100 hover:text-gray-900
    transition-colors text-left cursor-pointer
  `,
};
