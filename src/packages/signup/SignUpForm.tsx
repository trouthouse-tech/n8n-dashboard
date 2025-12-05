'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createUserThunk } from '@/store/thunks';
import { CurrentUserActions } from '@/store/current';
import { useApp } from '@/context/app';
import { isOtherIndustry } from '@/model';
import {
  EmailInput,
  NameInput,
  CompanyNameInput,
  IndustryInput,
  IndustryOtherInput,
} from './inputs';

export const SignUpForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { completeOnboarding } = useApp();
  const currentUser = useAppSelector((state) => state.currentUser);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    if (!currentUser.email) {
      setError('Email is required');
      return false;
    }
    if (!currentUser.name) {
      setError('Name is required');
      return false;
    }
    if (!currentUser.industry) {
      setError('Industry is required');
      return false;
    }
    if (isOtherIndustry(currentUser.industry) && !currentUser.industryOther) {
      setError('Please describe your industry');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user in local storage
      const result = await dispatch(createUserThunk());

      if (result.status !== 200) {
        setError('Failed to create user profile');
        return;
      }

      // Mark onboarding as complete
      completeOnboarding();

      router.push('/workflows');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset currentUser on mount to clear any previous data
  useState(() => {
    dispatch(CurrentUserActions.reset());
  });

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.errorBox}>
          {error}
        </div>
      )}

      <EmailInput />
      <NameInput />
      <CompanyNameInput />
      <IndustryInput />
      <IndustryOtherInput />

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? (
          <div className={styles.buttonSpinner} />
        ) : (
          'Get Started'
        )}
      </button>
    </form>
  );
};

const styles = {
  form: `
    flex flex-col gap-5
  `,
  errorBox: `
    p-3 bg-red-50 border border-red-200 rounded
    text-red-600 text-sm text-center
  `,
  submitButton: `
    w-full py-3 mt-2
    bg-blue-600 text-white font-semibold rounded
    hover:bg-blue-700 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center cursor-pointer
  `,
  buttonSpinner: `
    w-5 h-5 border-2 border-white/30 border-t-white
    rounded-full animate-spin
  `,
};
