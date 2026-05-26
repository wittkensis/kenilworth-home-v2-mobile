type FieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
};

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

type FormActionsProps = {
  onDelete?: () => void;
  onCancel: () => void;
  submitLabel?: string;
  deleteLabel?: string;
  pending?: boolean;
};

export function FormActions({ onDelete, onCancel, submitLabel = 'Save', deleteLabel = 'Delete', pending }: FormActionsProps) {
  return (
    <div className="sheet-actions">
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="btn btn-destructive"
        >
          {deleteLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onCancel}
        className="btn btn-ghost"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary"
      >
        {pending ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
}
