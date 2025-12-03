'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentUserActions } from '@/store/current';

export const CompanyNameInput = () => {
  const dispatch = useAppDispatch();
  const companyName = useAppSelector((state) => state.currentUser.companyName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(CurrentUserActions.setCompanyName(e.target.value));
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="companyName" className={styles.label}>
        Company Name
      </label>
      <input
        id="companyName"
        type="text"
        value={companyName}
        onChange={handleChange}
        className={styles.input}
        placeholder="Acme Inc."
        autoComplete="organization"
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

