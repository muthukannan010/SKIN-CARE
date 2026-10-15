import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, AlertCircle } from 'lucide-react';
import { analysisService } from '../services/analysisService';
import { ApiError } from '../types';
import ImageUploader from '../components/analyzer/ImageUploader';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer';
import ErrorMessage from '../components/common/ErrorMessage';

const Analyzer: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!file || isAnalyzing) return;
    setError('');
    setIsAnalyzing(true);
    try {
      const res = await analysisService.analyze(file);
      navigate(`/result/${res.result.id}`);
    } catch (err) {
      const ae = err as ApiError;
      setError(
        ae.status === 422
          ? 'The uploaded image could not be processed. Please try a clearer, higher-quality photo.'
          : ae.status === 503
          ? 'The AI model is temporarily unavailable. Please try again in a moment.'
          : ae.message || 'Analysis failed. Please try again.'
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <h1>Skin Health Analyzer</h1>
          <p>Upload a clear photo of the skin area you want to analyze.</p>
        </div>
      </div>

      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '3rem' }}>
          <MedicalDisclaimer />

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-slate-800)' }}>
              Upload Skin Image
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)', marginBottom: '1.5rem' }}>
              For best results, use a well-lit, in-focus image showing only the affected area. Accepted formats: JPG, PNG, WebP, BMP — max 10 MB.
            </p>

            <ImageUploader onFileSelected={setFile} disabled={isAnalyzing} />

            {error && <ErrorMessage message={error} className="mt-3" />}

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '1.5rem' }}
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              aria-busy={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Analyzing your image…
                </>
              ) : (
                <>
                  <Scan size={18} /> Analyze Image
                </>
              )}
            </button>

            {isAnalyzing && (
              <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginTop: '0.75rem' }}>
                Our AI model is processing your image. This may take up to 30 seconds.
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="card" style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-slate-700)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ color: 'var(--color-teal-600)' }} /> Photo Tips for Best Results
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'Use natural or bright, even lighting — avoid shadows and flash glare',
                'Hold the camera steady and close enough for the affected area to be clearly visible',
                'Ensure the skin area is in sharp focus',
                'Remove any makeup, ointments, or coverings from the area before photographing',
                'A plain background helps the model focus on the skin',
              ].map((tip) => (
                <li key={tip} style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', paddingLeft: '1.25rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
