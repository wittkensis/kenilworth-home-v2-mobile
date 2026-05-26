type FieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
};

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
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
    <div className="flex gap-3 pt-2 pb-2">
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="py-3 px-4 rounded-xl text-sm font-medium active:scale-95 transition-transform"
          style={{ background: 'var(--surface-raised)', color: 'var(--danger)' }}
        >
          {deleteLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-transform"
        style={{ background: 'var(--surface-raised)', color: 'var(--text-muted)' }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={pending}
        className="flex-1 py-3 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
        style={{ background: 'var(--accent)', color: '#1A1A1A' }}
      >
        {pending ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
}
