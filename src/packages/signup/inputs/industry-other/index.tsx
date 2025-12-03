'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentUserActions } from '@/store/current';
import { isOtherIndustry } from '@/model';

export const IndustryOtherInput = () => {
  const dispatch = useAppDispatch();
  const industry = useAppSelector((state) => state.currentUser.industry);
  const industryOther = useAppSelector((state) => state.currentUser.industryOther);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(CurrentUserActions.setIndustryOther(e.target.value));
  };

  // Only show when industry is "Other"
  if (!isOtherIndustry(industry)) {
    return null;
  }

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="industryOther" className={styles.label}>
        Please describe your industry
      </label>
      <textarea
        id="industryOther"
        value={industryOther}
        onChange={handleChange}
        className={styles.textarea}
        placeholder="Describe your industry..."
        required
        rows={3}
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
  textarea: `
    w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg
    text-white placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
    transition-colors resize-none
  `,
};

