import { describe, expect, it } from "vitest";
import {
  serializeAnalysisExport,
} from "./exportAnalysis";

describe("exportAnalysis", () => {
  it("serializes the payload as formatted JSON", () => {
    const json = serializeAnalysisExport({
      datasetId: "ds_sales",
      filters: {},
      metrics: [],
      insights: [],
    });

    expect(json).toContain('"datasetId": "ds_sales"');
    expect(json).toContain('"filters": {}');
  });

  it("serializes all payload fields", () => {
    const json = serializeAnalysisExport({
      datasetId: "ds_sales",
      filters: { category: "even" },
      metrics: [
        { type: "total", value: 60 },
        { type: "count", value: 3 },
        { type: "average", value: 20 },
      ],
      insights: [
        {
          id: "neutral",
          message: 'No unusual patterns were detected for the "even" category.',
          severity: "info",
        },
      ],
    });

    expect(json).toContain('"datasetId": "ds_sales"');
    expect(json).toContain('"category": "even"');
    expect(json).toContain('"type": "total"');
    expect(json).toContain('"severity": "info"');
  });
});
