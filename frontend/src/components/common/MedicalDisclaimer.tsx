import React from 'react';
import { AlertTriangle } from 'lucide-react';

const MedicalDisclaimer: React.FC = () => (
  <div className="disclaimer-banner" role="note" aria-label="Medical disclaimer">
    <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
    <span>
      <strong>Medical Disclaimer:</strong>{' '}
      This tool provides AI-based informational results and is <strong>not a medical diagnosis</strong>.
      Consult a qualified healthcare professional for diagnosis and treatment. Do not delay seeking
      professional medical advice based on information provided by this tool.
    </span>
  </div>
);

export default MedicalDisclaimer;
