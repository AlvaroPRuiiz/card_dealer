import { useEffect, useState } from "react";

type AssetState = "checking" | "available" | "missing";

export function useAssetAvailability(path: string) {
  const [state, setState] = useState<AssetState>("checking");

  useEffect(() => {
    let cancelled = false;
    setState("checking");

    fetch(path, { method: "HEAD" })
      .then((response) => {
        if (!cancelled) setState(response.ok ? "available" : "missing");
      })
      .catch(() => {
        if (!cancelled) setState("missing");
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
