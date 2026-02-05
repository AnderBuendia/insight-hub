import type { Dataset, DatasetId } from "@/domain";

export type DatasetsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "success"; datasets: Dataset[]; selectedId?: DatasetId };
