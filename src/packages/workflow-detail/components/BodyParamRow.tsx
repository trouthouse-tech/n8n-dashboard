'use client';

import { WorkflowBodyParam } from '@/model';

interface BodyParamRowProps {
  param: WorkflowBodyParam;
  onChange: (param: WorkflowBodyParam) => void;
  onRemove: () => void;
}

export const BodyParamRow = ({ param, onChange, onRemove }: BodyParamRowProps) => {
  return (
    <div className={styles.row}>
      <input
        type="text"
        value={param.key}
        onChange={(e) => onChange({ ...param, key: e.target.value })}
        placeholder="key"
        className={styles.input}
      />
      <input
        type="text"
        value={param.value}
        onChange={(e) => onChange({ ...param, value: e.target.value })}
        placeholder="value"
        className={styles.input}
      />
      <button onClick={onRemove} className={styles.removeButton}>
        ✕
      </button>
    </div>
  );
};

const styles = {
  row: `flex gap-2`,
  input: `
    flex-1 px-3 py-2 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400 text-sm
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-all
  `,
  removeButton: `
    w-8 h-8 flex items-center justify-center text-gray-400 
    hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer text-sm
  `,
};

