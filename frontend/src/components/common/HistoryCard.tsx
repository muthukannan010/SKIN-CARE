import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { HistoryItem } from '../../types';
import { ConfidenceIndicator } from '../results/PredictionCard';

interface HistoryCardProps {
  item: HistoryItem;
  onDelete?: (id: string) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onDelete }) => {
  const date = item.analyzed_at
    ? new Date(item.analyzed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent Scan';

  return (
    <div className="history-card">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.predicted_condition || 'Skin analysis'}
          className="history-thumb"
          style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
        />
      ) : (
        <div className="history-thumb-placeholder" style={{ width: '70px', height: '70px', borderRadius: '12px' }}>
          <ImageIcon size={24} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-slate-800)', marginBottom: '0.25rem' }} className="truncate">
          {item.predicted_condition}
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginBottom: '0.5rem' }}>{date}</p>
        <ConfidenceIndicator confidence={item.confidence} size="sm" />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <Link to={`/history/${item.id}`} className="btn btn-outline btn-sm btn-icon" title="View report">
          <Eye size={15} />
        </Link>
        {onDelete && (
          <button
            className="btn btn-ghost btn-sm btn-icon"
            style={{ color: 'var(--color-error)' }}
            onClick={() => onDelete(item.id)}
            title="Delete scan"
            aria-label="Delete analysis"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
