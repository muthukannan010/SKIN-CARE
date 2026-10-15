import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Image as ImageIcon, Calendar, Cpu,
  Stethoscope, AlertTriangle, Siren, Shield, HeartPulse,
  Activity, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { analysisService } from '../services/analysisService';
import type { AnalysisResult as AnalysisResultData } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer';
import { ConfidenceIndicator, PredictionCard } from '../components/results/PredictionCard';

const ResultSection: React.FC<{ icon: React.ReactNode; title: string; items: string[]; defaultOpen?: boolean }> = ({
  icon, title, items, defaultOpen = true
}) => {
  const [open, setOpen] = useState(defaultOpen);
  if (!items?.length) return null;
  return (
    <div className="result-section">
      <button
        className="result-section-title"
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        onClick={() => setOpen((p) => !p)}
      >
        {icon} {title}
        <span style={{ marginLeft: 'auto' }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      {open && (
        <ul className="result-list">
          {items.map((item, i) => (
            <li key={i} className="result-list-item">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AnalysisResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await analysisService.getResult(id);
        setResult(data);
      } catch {
        setError('Could not load analysis result. It may have been deleted or you may not have access.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) return <LoadingSpinner fullPage label="Loading analysis result…" />;

  return (
    <div className="page-wrapper">
      <div className="result-header">
        <div className="container">
          <Link to="/history" className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Back to History
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
            Analysis Result
          </h1>
          {result && (
            <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '0.3rem', fontSize: '0.875rem' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
              {new Date(result.analyzed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>

      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container" style={{ paddingBottom: '3rem', paddingTop: 0 }}>
          {error ? (
            <ErrorMessage message={error} className="mt-4" />
          ) : result ? (
            <>
              <MedicalDisclaimer />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '1.5rem' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Image */}
                  <div className="card" style={{ padding: '1rem' }}>
                    {result.image_url ? (
                      <img src={result.image_url} alt="Analyzed skin image" style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover', maxHeight: 280 }} />
                    ) : (
                      <div style={{ background: 'var(--color-slate-100)', borderRadius: 'var(--radius-md)', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate-400)' }}>
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>

                  {/* Primary Result */}
                  <div className="card" style={{ border: '2px solid var(--color-teal-200)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal-700)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                      Top Prediction
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '1rem' }}>
                      {result.predicted_condition}
                    </p>
                    <ConfidenceIndicator confidence={result.confidence} />
                  </div>

                  {/* Meta */}
                  <div className="card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-slate-500)' }}>
                        <Cpu size={14} /> Model: <span style={{ fontWeight: 600, color: 'var(--color-slate-700)' }}>{result.model_version}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-slate-500)' }}>
                        <Calendar size={14} /> Analyzed: <span style={{ fontWeight: 600, color: 'var(--color-slate-700)' }}>
                          {new Date(result.analyzed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* All Predictions */}
                  {result.predictions?.length > 0 && (
                    <div className="card">
                      <p style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.875rem' }}>All Predictions</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {result.predictions.map((p) => (
                          <PredictionCard key={p.rank} prediction={p} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="card">
                  {/* Description */}
                  {result.description && (
                    <div className="result-section">
                      <p className="result-section-title"><FileText size={16} /> About This Condition</p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate-600)', lineHeight: 1.7 }}>
                        {result.description}
                      </p>
                    </div>
                  )}

                  <ResultSection icon={<Activity size={16} />} title="Common Symptoms" items={result.symptoms} />
                  <ResultSection icon={<Stethoscope size={16} />} title="Possible Causes" items={result.possible_causes} />
                  <ResultSection icon={<HeartPulse size={16} />} title="Supportive Care" items={result.supportive_care} />
                  <ResultSection icon={<Shield size={16} />} title="Prevention" items={result.prevention} defaultOpen={false} />
                  <ResultSection icon={<AlertTriangle size={16} />} title="When to See a Doctor" items={result.when_to_see_doctor} />

                  {result.emergency_warning_signs?.length > 0 && (
                    <div className="result-section">
                      <p className="result-section-title" style={{ color: 'var(--color-error)' }}>
                        <Siren size={16} /> Emergency Warning Signs
                      </p>
                      <div className="info-box info-box-red" style={{ marginTop: '0.5rem' }}>
                        <ul className="result-list" style={{ margin: 0 }}>
                          {result.emergency_warning_signs.map((s, i) => (
                            <li key={i} className="result-list-item" style={{ color: '#991b1b' }}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/analyzer" className="btn btn-primary">Analyze Another Image</Link>
                <Link to="/history" className="btn btn-outline">View History</Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
