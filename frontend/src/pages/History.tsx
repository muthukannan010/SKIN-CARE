import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Scan, ChevronLeft, ChevronRight } from 'lucide-react';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import HistoryCard from '../components/common/HistoryCard';
import ConfirmDialog from '../components/common/ConfirmDialog';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const PER_PAGE = 10;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async (p: number) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await historyService.list(p, PER_PAGE);
      setItems(Array.isArray(res?.items) ? res.items : []);
      setTotal(res?.total ?? 0);
      setHasNext(Boolean(res?.has_next));
    } catch {
      setItems([]);
      setTotal(0);
      setHasNext(false);
      setError('Failed to load history from server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await historyService.delete(deleteId);
      setDeleteId(null);
      // Reload current page
      load(page);
    } catch {
      setError('Failed to delete the analysis. Please try again.');
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HistoryIcon size={26} /> Analysis History
              </h1>
              <p>{total > 0 ? `${total} total ${total === 1 ? 'analysis' : 'analyses'} recorded` : 'All your previous skin assessments'}</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/analyzer')}>
              <Scan size={16} /> New Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container" style={{ paddingTop: 0, paddingBottom: '3rem' }}>
          {error && <ErrorMessage message={error} className="mb-4" />}

          {isLoading ? (
            <LoadingSpinner label="Loading your history…" />
          ) : items.length === 0 ? (
            <EmptyState
              icon={HistoryIcon}
              title="No analyses yet"
              description="Your skin analysis history will appear here. Start by analyzing your first skin image."
              action={
                <button className="btn btn-primary" onClick={() => navigate('/analyzer')}>
                  <Scan size={16} /> Analyze Your First Image
                </button>
              }
            />
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item) => (
                  <HistoryCard key={item.id} item={item} onDelete={(id) => setDeleteId(id)} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" style={{ marginTop: '2rem' }}>
                  <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} className={`pagination-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  ))}
                  <button className="pagination-btn" disabled={!hasNext} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Analysis"
        message="Are you sure you want to delete this analysis? This record will be removed from your history."
        confirmLabel="Delete"
        danger
        isLoading={isDeleting}
      />
    </div>
  );
};

export default History;
