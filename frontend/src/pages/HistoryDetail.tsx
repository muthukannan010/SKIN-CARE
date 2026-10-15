import React from 'react';
import AnalysisResult from './AnalysisResult';

// HistoryDetail reuses AnalysisResult page since both display the same data
// The result page fetches by ID which applies to both direct navigation and history detail
const HistoryDetail: React.FC = () => {
  return <AnalysisResult />;
};

export default HistoryDetail;
