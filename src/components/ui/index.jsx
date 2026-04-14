import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice';

export function Spinner() {
  return <span className="spinner" />;
}

export function ToastContainer() {
  const toasts = useSelector((s) => s.ui.toasts);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach((t) => {
      const timer = setTimeout(() => dispatch(removeToast(t.id)), 3000);
      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.icon} {t.message}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {sub && <div className="empty-sub">{sub}</div>}
    </div>
  );
}
