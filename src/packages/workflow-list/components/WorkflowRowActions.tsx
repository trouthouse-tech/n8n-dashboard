'use client';

import { useState, useRef, useEffect } from 'react';

interface WorkflowRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const WorkflowRowActions = ({ onEdit, onDelete }: WorkflowRowActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  return (
    <div ref={menuRef} className={styles.container}>
      <button onClick={handleClick} className={styles.trigger}>
        ⋮
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button onClick={handleEdit} className={styles.item}>
            Edit
          </button>
          <button onClick={handleDelete} className={styles.itemDanger}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `relative`,
  trigger: `
    w-8 h-8 flex items-center justify-center
    text-gray-400 hover:text-gray-600 hover:bg-gray-100
    rounded transition-colors cursor-pointer text-lg font-bold
  `,
  dropdown: `
    absolute right-0 top-full mt-1 z-10
    bg-white border border-gray-200 rounded-lg shadow-lg
    min-w-[120px] py-1
  `,
  item: `
    w-full px-4 py-2 text-left text-sm text-gray-700
    hover:bg-gray-50 transition-colors cursor-pointer
  `,
  itemDanger: `
    w-full px-4 py-2 text-left text-sm text-red-600
    hover:bg-red-50 transition-colors cursor-pointer
  `,
};

