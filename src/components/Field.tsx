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
          aria-label={deleteLabel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/>
          </svg>
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
