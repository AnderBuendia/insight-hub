import { useEffect, useMemo, useState } from "react";
import type { Dataset, DatasetId } from "@/domain";
import { DatasetsInfra } from "@/infra";
import type { DatasetsState } from "./types";

function mapInfraDatasetToDomain(d: { id: string; name: string; description?: string }): Dataset {
  return { id: d.id, name: d.name, description: d.description };
}

export function useDatasets() {
  const [state, setState] = useState<DatasetsState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ status: "loading" });
      const result = await DatasetsInfra.listDatasets();

      if (cancelled) return;

      if (!result.ok) {
        setState({ status: "error", message: result.error.message });
        return;
      }

      const datasets = result.data.map(mapInfraDatasetToDomain);
      if (datasets.length === 0) {
        setState({ status: "empty" });
        return;
      }

      setState({ status: "success", datasets });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const actions = useMemo(() => {
    return {
      selectDataset(id: DatasetId) {
        setState((prev) => {
          if (prev.status !== "success") return prev;
          return { ...prev, selectedId: id };
        });
      },
      reload() {
        // simple reload strategy for v1
        setState({ status: "idle" });
      },
    };
  }, []);

  return { state, actions };
}
