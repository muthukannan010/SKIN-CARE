import React from 'react';
import { Prediction } from '../../types';

interface ConfidenceIndicatorProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence, size = 'md', showLabel = true
}) => {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 80 ? 'var(--color-teal-500)' :
    pct >= 60 ? 'var(--color-warning)' :
    'var(--color-error)';

  const heights: Record<string, string> = { sm: '5px', md: '8px', lg: '12px' };
  const height = heights[size];

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>Confidence</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{pct}%</span>
        </div>
      )}
      <div className="confidence-bar" style={{ height }}>
        <div
          className="confidence-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

interface PredictionCardProps {
  prediction: Prediction;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const pct = Math.round(prediction.confidence * 100);
  return (
    <div className="prediction-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        <div className="prediction-rank">{prediction.rank}</div>
        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-slate-700)' }}>
          {prediction.condition}
        </span>
      </div>
      <div style={{ minWidth: 140 }}>
        <ConfidenceIndicator confidence={prediction.confidence} size="sm" showLabel={false} />
        <div style={{ textAlign: 'right', marginTop: '0.2rem', fontSize: '0.8rem', fontWeight: 600,
          color: pct >= 80 ? 'var(--color-teal-600)' : pct >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }}>
          {pct}%
        </div>
      </div>
    </div>
  );
};
