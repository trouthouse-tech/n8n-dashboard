'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentUserActions } from '@/store/current';
import { INDUSTRIES } from '@/model';

export const IndustryInput = () => {
  const dispatch = useAppDispatch();
  const industry = useAppSelector((state) => state.currentUser.industry);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(CurrentUserActions.setIndustry(e.target.value));
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="industry" className={styles.label}>
        Industry
      </label>
      <select
        id="industry"
        value={industry}
        onChange={handleChange}
        className={styles.select}
        required
      >
        <option value="">Select an industry...</option>
        {INDUSTRIES.map((ind) => (
          <option key={ind} value={ind}>
            {ind}
          </option>
        ))}
      </select>
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
  select: `
    w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg
    text-white
    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
    transition-colors
    appearance-none cursor-pointer
  `,
};

