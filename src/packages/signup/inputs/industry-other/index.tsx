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
    text-sm font-medium text-gray-700
  `,
  textarea: `
    w-full px-4 py-3 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-colors resize-none
  `,
};

