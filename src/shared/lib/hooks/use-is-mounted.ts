import { useEffect, useState } from "react";

export function useIsMounted() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Defer setState to avoid react-hooks/set-state-in-effect (cascading renders).
        const id = requestAnimationFrame(() => setIsMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return isMounted;
}
