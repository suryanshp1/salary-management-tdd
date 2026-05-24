import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="confirm-icon">🗑️</div>
          <div className="confirm-text">
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
          <div className="flex justify-center gap-sm">
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
              {loading && <span className="spinner spinner-sm" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
