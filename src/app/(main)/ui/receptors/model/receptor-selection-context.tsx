"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

interface ReceptorsSelectionContextValue {
  selectedReceptorId: string | null;
  setSelectedReceptorId: (id: string | null) => void;
}

const ReceptorsSelectionContext =
  createContext<ReceptorsSelectionContextValue | null>(null);

export function ReceptorSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedReceptorId, setSelectedReceptorId] = useState<string | null>(
    null,
  );

  const contextValue = useMemo(
    () => ({
      selectedReceptorId,
      setSelectedReceptorId,
    }),
    [selectedReceptorId],
  );

  return (
    <ReceptorsSelectionContext.Provider value={contextValue}>
      {children}
    </ReceptorsSelectionContext.Provider>
  );
}

export function useReceptorSelection() {
  const ctx = useContext(ReceptorsSelectionContext);
  if (!ctx) {
    throw new Error(
      "useReceptorSelection must be used within ReceptorSelectionProvider",
    );
  }
  return ctx;
}
