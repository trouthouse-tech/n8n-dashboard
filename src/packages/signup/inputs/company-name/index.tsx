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
    text-sm font-medium text-gray-700
  `,
  input: `
    w-full px-4 py-3 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-colors
  `,
};

