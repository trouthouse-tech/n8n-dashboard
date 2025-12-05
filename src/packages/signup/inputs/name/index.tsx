'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentUserActions } from '@/store/current';

export const NameInput = () => {
  const dispatch = useAppDispatch();
  const name = useAppSelector((state) => state.currentUser.name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(CurrentUserActions.setName(e.target.value));
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="name" className={styles.label}>
        Full Name
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={handleChange}
        className={styles.input}
        placeholder="John Doe"
        required
        autoComplete="name"
      />
    </div>
  );
};

const styles = {
  inputGroup: `
    flex flex-col gap-2
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  input: `
    w-full px-4 py-3 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-colors
  `,
};

