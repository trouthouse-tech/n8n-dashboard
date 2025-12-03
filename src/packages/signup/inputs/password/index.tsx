'use client';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  placeholder?: string;
}

export const PasswordInput = ({
  value,
  onChange,
  id = 'password',
  label = 'Password',
  placeholder = '••••••••',
}: PasswordInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="password"
        value={value}
        onChange={handleChange}
        className={styles.input}
        placeholder={placeholder}
        required
        autoComplete="new-password"
        minLength={6}
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

