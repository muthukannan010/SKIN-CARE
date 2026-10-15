import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'Is NEXORA AI a medical device?', a: 'No. NEXORA AI is an informational tool only. It is not a medical device, does not provide medical diagnoses, and must not replace professional medical advice. Always consult a licensed healthcare provider for any health concern.' },
  { q: 'How accurate is the AI?', a: 'The AI model provides predictions with associated confidence scores. These reflect statistical likelihood based on training data — not clinical certainty. Accuracy varies by image quality and condition. Treat all results as informational only.' },
  { q: 'What skin conditions can it detect?', a: 'The model is trained to recognize common skin conditions. The exact list depends on the backend model version. Each result page displays the model version used. Some rare or atypical presentations may not be recognized accurately.' },
  { q: 'Is my image data stored?', a: 'Your images and analysis results are stored securely in your personal account, accessible only to you. We do not share your data with third parties. See our Privacy Policy for full details.' },
  { q: 'What photo format should I use?', a: 'We support JPG, PNG, WebP, and BMP images up to 10 MB. For best results, use a clear, well-lit, in-focus image showing only the affected skin area.' },
  { q: 'Can I delete my analysis history?', a: 'Yes. You can delete any individual analysis from your History page. The backend enforces that you can only delete your own analyses.' },
  { q: 'Does NEXORA AI work on mobile?', a: 'Yes. The interface is fully responsive and works on smartphones, tablets, and desktop browsers.' },
  { q: 'What should I do with the results?', a: 'Use the results as informational context. If any result raises concern, follow the "when to see a doctor" guidance provided in every analysis and consult a qualified healthcare professional.' },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Common questions about NEXORA AI</p>
        </div>
      </div>
      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '4rem' }}>
          <div className="card">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i} aria-controls={`faq-answer-${i}`}>
                  {faq.q}
                  {open === i ? <ChevronUp size={18} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} style={{ flexShrink: 0 }} />}
                </button>
                {open === i && (
                  <div id={`faq-answer-${i}`} className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
