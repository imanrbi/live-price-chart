import { forwardRef } from "react";
import type { Margin } from "./types";

export const ChartXAxis = forwardRef<SVGGElement, { margin: Margin }>(({ margin }, ref) => {
  return <g ref={ref} transform={`translate(${margin.left}, ${margin.bottom})`} className="x-axis-grid" />;
});
