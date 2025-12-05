'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentWorkflowActions } from '@/store/current';

export const BodyParamsField = () => {
  const dispatch = useAppDispatch();
  const defaultBody = useAppSelector((state) => state.currentWorkflow.defaultBody);

  const handleAddParam = () => {
    dispatch(
      CurrentWorkflowActions.addBodyParam({
        id: crypto.randomUUID(),
        key: '',
        value: '',
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Default Body Parameters</label>
        <button onClick={handleAddParam} className={styles.addButton}>
          + Add
        </button>
      </div>
      <div className={styles.list}>
        {defaultBody.map((param) => (
          <div key={param.id} className={styles.row}>
            <input
              type="text"
              value={param.key}
              onChange={(e) =>
                dispatch(CurrentWorkflowActions.updateBodyParam({ ...param, key: e.target.value }))
              }
              placeholder="key"
              className={styles.input}
            />
            <input
              type="text"
              value={param.value}
              onChange={(e) =>
                dispatch(CurrentWorkflowActions.updateBodyParam({ ...param, value: e.target.value }))
              }
              placeholder="value"
              className={styles.input}
            />
            <button
              onClick={() => dispatch(CurrentWorkflowActions.removeBodyParam(param.id))}
              className={styles.removeButton}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-2`,
  header: `flex items-center justify-between`,
  label: `text-xs font-medium text-gray-600 tracking-wider uppercase`,
  addButton: `text-xs text-blue-600 hover:text-blue-700 cursor-pointer`,
  list: `flex flex-col gap-2`,
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

