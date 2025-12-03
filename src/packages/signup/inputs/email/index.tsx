'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentUserActions } from '@/store/current';

export const EmailInput = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.currentUser.email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(CurrentUserActions.setEmail(e.target.value));
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="email" className={styles.label}>
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={handleChange}
        className={styles.input}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
    </div>
  );
};

const styles = {
  inputGroup: `
    flex flex-col gap-2
  `,
  label: `
    text-sm font-medium text-slate-300
  `,
  input: `
    w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg
    text-white placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
    transition-colors
  `,
};

