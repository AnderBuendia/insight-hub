import { describe, expect, it } from "vitest";
import { serializeMetricsToCsv } from "./exportMetricsCsv";

describe("serializeMetricsToCsv", () => {
  it("serializes metrics with a header row", () => {
    const csv = serializeMetricsToCsv([
      { type: "total", value: 60 },
      { type: "count", value: 3 },
      { type: "average", value: 20 },
    ]);

    expect(csv).toBe(
      ["type,value", "total,60", "count,3", "average,20"].join("\n"),
    );
  });

  it("returns only the header when metrics are empty", () => {
    const csv = serializeMetricsToCsv([]);

    expect(csv).toBe("type,value");
  });
});
