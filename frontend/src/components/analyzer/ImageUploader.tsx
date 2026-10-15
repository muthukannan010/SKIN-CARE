import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import ErrorMessage from '../common/ErrorMessage';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];
const MAX_SIZE_MB = 10;

interface ImageUploaderProps {
  onFileSelected: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelected, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback((file: File) => {
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPG, PNG, WebP, or BMP image.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onFileSelected(file);
  }, [onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  }, [disabled, validateAndSet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    onFileSelected(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div
        className={`upload-zone${dragOver ? ' drag-over' : ''}${preview ? ' has-image' : ''}`}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && !preview && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload skin image"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        style={{ cursor: disabled ? 'not-allowed' : preview ? 'default' : 'pointer' }}
      >
        {preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <img src={preview} alt="Selected skin image" className="upload-preview" />
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
              📎 {fileName}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                disabled={disabled}
              >
                <RefreshCw size={14} /> Change Image
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-error)' }}
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                disabled={disabled}
              >
                <X size={14} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              {dragOver ? <Upload size={28} /> : <ImageIcon size={28} />}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-slate-700)', marginBottom: '0.4rem' }}>
              {dragOver ? 'Drop your image here' : 'Upload a skin image'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)', marginBottom: '1rem' }}>
              Drag & drop or <span style={{ color: 'var(--color-teal-600)', fontWeight: 600 }}>browse files</span>
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)' }}>
              Supports JPG, PNG, WebP, BMP · Max {MAX_SIZE_MB} MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
          aria-label="File input"
        />
      </div>
      {error && <ErrorMessage message={error} className="mt-2" />}
    </div>
  );
};

export default ImageUploader;
