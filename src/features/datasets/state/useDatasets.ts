import { useCallback, useEffect, useState } from "react";
import type { Dataset, DatasetId } from "@/domain";
import { DatasetsInfra } from "@/infra";
import type { DatasetsState } from "./types";

function mapInfraToDomain(d: { id: string; name: string; description?: string }): Dataset {
  return { id: d.id, name: d.name, description: d.description };
}

export function useDatasets() {
  const [state, setState] = useState<DatasetsState>({ status: "idle" });

  const load = useCallback(async () => {
    setState({ status: "loading" });

    const result = await DatasetsInfra.listDatasets();

    if (!result.ok) {
      setState({ status: "error", message: result.error.message });
      return;
    }

    const datasets = result.data.map(mapInfraToDomain);

    if (datasets.length === 0) {
      setState({ status: "empty" });
      return;
    }

    setState({ status: "success", datasets });
  }, []);

  useEffect(() => {
    load().catch((err) => console.error("Failed to load datasets:", err)); // initial load
  }, [load]);

  const selectDataset = useCallback((id: DatasetId) => {
    setState((prev) => {
      if (prev.status !== "success") return prev;
      return { ...prev, selectedId: id };
    });
  }, []);

  return { state, actions: { reload: load, selectDataset } };
}
