'use client';

interface ModalFooterProps {
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export const ModalFooter = ({ isEditing, onCancel, onSave }: ModalFooterProps) => {
  return (
    <div className={styles.container}>
      <button onClick={onCancel} className={styles.cancelButton}>
        Cancel
      </button>
      <button onClick={onSave} className={styles.saveButton}>
        {isEditing ? 'Save Changes' : 'Create Workflow'}
      </button>
    </div>
  );
};

const styles = {
  container: `flex gap-3 px-5 py-4 border-t border-gray-200`,
  cancelButton: `
    flex-1 py-2.5 bg-white text-gray-700 font-medium rounded
    border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer
  `,
  saveButton: `
    flex-1 py-2.5 bg-blue-600 text-white font-medium rounded
    hover:bg-blue-700 transition-colors cursor-pointer
  `,
};

