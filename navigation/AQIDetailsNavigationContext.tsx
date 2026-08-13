import { createContext, useContext, type ReactNode } from 'react';

import type { AQIDetailsParams } from './types';

type AQIDetailsNavigationContextValue = (params: AQIDetailsParams) => void;

const AQIDetailsNavigationContext =
  createContext<AQIDetailsNavigationContextValue | null>(null);

type AQIDetailsNavigationProviderProps = {
  children: ReactNode;
  openAQIDetails: AQIDetailsNavigationContextValue;
};

export function AQIDetailsNavigationProvider({
  children,
  openAQIDetails,
}: AQIDetailsNavigationProviderProps) {
  return (
    <AQIDetailsNavigationContext.Provider value={openAQIDetails}>
      {children}
    </AQIDetailsNavigationContext.Provider>
  );
}

export function useOpenAQIDetails() {
  const openAQIDetails = useContext(AQIDetailsNavigationContext);

  if (!openAQIDetails) {
    throw new Error('useOpenAQIDetails must be used inside MainApp navigation.');
  }

  return openAQIDetails;
}
