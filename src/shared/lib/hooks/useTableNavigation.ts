import { useRouter } from "next/navigation";
import { useCallback } from "react";

type RowData = Record<string, unknown>;

/**
 * Hook for creating optimized navigation handlers for table rows
 * Uses useCallback to prevent unnecessary re-renders
 */
export const useTableNavigation = <T extends RowData>(
  pathBuilder: string
) => {
  const router = useRouter();

  return useCallback(
    (row: T) => {
      const path = pathBuilder
        .replace(/\$\{([^}]+)\}/g, (_, key) => String(row[key]));
      router.push(path);
    },
    [router, pathBuilder]
  );
};

// Pre-configured helpers for common paths
export const TABLE_PATHS = {
  subnet: `/subnet/\${program_id}`,
  dopaminerYapper: `/dopaminer/\${yapper_id}`,
  dopaminerUser: `/dopaminer/\${user_id}`,
} as const;
