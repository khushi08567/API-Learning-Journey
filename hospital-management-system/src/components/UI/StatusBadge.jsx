import { STATUS_COLORS } from '../../utils/constants';

export default function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const label = status?.replace(/_/g, ' ') || 'unknown';
  return (
    <span className="status-badge" style={{ background: style.bg, color: style.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.color, display: 'inline-block' }}></span>
      {label}
    </span>
  );
}
