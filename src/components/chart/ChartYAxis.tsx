import { forwardRef } from "react";
import type { Margin } from "./types";

export const ChartYAxis = forwardRef<SVGGElement, { margin: Margin }>(({ margin }, ref) => {
  return <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`} className="y-axis-grid" />;
});
