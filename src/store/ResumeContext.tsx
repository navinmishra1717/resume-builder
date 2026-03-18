import React, { createContext, useContext } from 'react';
import { useResumeStore, ResumeStore } from './useResumeStore';

const ResumeContext = createContext<ResumeStore | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const store = useResumeStore();
  return <ResumeContext.Provider value={store}>{children}</ResumeContext.Provider>;
}

export function useResume(): ResumeStore {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
