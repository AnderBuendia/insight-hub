"use client";

import { useState } from "react";
import { DatasetsInfra, type DatasetsScenario } from "@/infra";

export function ScenarioControls({ onReload }: { onReload: () => void }) {
  const [value, setValue] = useState<DatasetsScenario>("success");

  function setScenario(next: DatasetsScenario) {
    setValue(next);
    DatasetsInfra.setDatasetsScenario(next);
    onReload(); // uses your already-working reload
  }

  return (
    <div>
      <span>Scenario: </span>

      <button type="button" onClick={() => setScenario("success")} aria-pressed={value === "success"}>
        success
      </button>

      <button type="button" onClick={() => setScenario("empty")} aria-pressed={value === "empty"}>
        empty
      </button>

      <button type="button" onClick={() => setScenario("error")} aria-pressed={value === "error"}>
        error
      </button>
    </div>
  );
}
